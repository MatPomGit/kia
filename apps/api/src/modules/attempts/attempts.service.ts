import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { AttemptStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { TelemetryBatchDto, TelemetryEventDto } from "./dto/telemetry.dto";

type SanitizedPayload = TelemetryEventDto["payload"];

const MAX_EVENTS_PER_BATCH = 500;
const MAX_EVENTS_PER_ATTEMPT = 10_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_BATCHES_PER_WINDOW = 120;

@Injectable()
export class AttemptsService {
  constructor(private readonly prisma: PrismaService) {}

  async saveTelemetry(attemptId: string, batch: TelemetryBatchDto) {
    this.assertAttemptId(attemptId);

    if (batch.events.length > MAX_EVENTS_PER_BATCH) {
      throw new BadRequestException(`Paczka może zawierać maksymalnie ${MAX_EVENTS_PER_BATCH} zdarzeń.`);
    }

    const existingSeqStart = await this.prisma.telemetryEvent.findUnique({
      where: { attemptId_seqNo: { attemptId, seqNo: batch.seqStart } },
      select: { id: true }
    });

    if (existingSeqStart) {
      return {
        attemptId,
        accepted: 0,
        duplicated: true,
        nextSequence: await this.getNextSequence(attemptId)
      };
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const attempt = await tx.attempt.findUnique({
          where: { id: attemptId },
          select: { id: true, status: true }
        });

        if (!attempt) {
          throw new NotFoundException("Nie znaleziono próby do zapisu telemetrii.");
        }

        if (attempt.status === AttemptStatus.FINISHED) {
          throw new ConflictException("Nie można dopisać telemetrii do zakończonej próby.");
        }

        const currentEventCount = await tx.telemetryEvent.count({ where: { attemptId } });
        if (currentEventCount + batch.events.length > MAX_EVENTS_PER_ATTEMPT) {
          throw new ConflictException(`Próba może zawierać maksymalnie ${MAX_EVENTS_PER_ATTEMPT} zdarzeń telemetrii.`);
        }

        const nextSequence = await this.getNextSequenceForTransaction(tx, attemptId);
        if (batch.seqStart < nextSequence) {
          return {
            attemptId,
            accepted: 0,
            duplicated: true,
            nextSequence
          };
        }

        if (batch.seqStart !== nextSequence) {
          throw new ConflictException(`Nieprawidłowy numer sekwencji. Oczekiwano ${nextSequence}.`);
        }

        await this.assertRateLimit(tx, attemptId);

        const sanitizedEvents = batch.events.map((event, index) => ({
          attemptId,
          seqNo: batch.seqStart + index,
          timestamp: new Date(event.timestamp),
          eventType: event.type,
          questionId: event.questionId,
          payload: this.sanitizePayload(event) as Prisma.InputJsonValue
        }));

        if (sanitizedEvents.length > 0) {
          await tx.telemetryEvent.createMany({ data: sanitizedEvents });
        }

        await tx.attempt.update({
          where: { id: attemptId },
          data: {
            status: attempt.status === AttemptStatus.CREATED ? AttemptStatus.IN_PROGRESS : attempt.status,
            startedAt: attempt.status === AttemptStatus.CREATED ? new Date() : undefined
          }
        });

        return {
          attemptId,
          accepted: sanitizedEvents.length,
          duplicated: false,
          nextSequence: nextSequence + sanitizedEvents.length
        };
      });
    } catch (error) {
      return await this.handlePrismaTelemetryError(error, attemptId, batch.seqStart);
    }
  }

  async finish(attemptId: string) {
    this.assertAttemptId(attemptId);

    try {
      const attempt = await this.prisma.attempt.update({
        where: { id: attemptId },
        data: {
          status: AttemptStatus.FINISHED,
          finishedAt: new Date()
        },
        select: {
          id: true,
          status: true,
          finishedAt: true,
          _count: { select: { telemetry: true } }
        }
      });

      return {
        attemptId: attempt.id,
        status: attempt.status,
        score: null,
        telemetryEvents: attempt._count.telemetry,
        finishedAt: attempt.finishedAt?.toISOString()
      };
    } catch (error) {
      if (this.isPrismaError(error, "P2025")) {
        throw new NotFoundException("Nie znaleziono próby do zakończenia.");
      }
      throw this.mapPrismaError(error);
    }
  }

  private async getNextSequence(attemptId: string): Promise<number> {
    return this.getNextSequenceForTransaction(this.prisma, attemptId);
  }

  private async getNextSequenceForTransaction(
    tx: Prisma.TransactionClient | PrismaService,
    attemptId: string
  ): Promise<number> {
    const lastEvent = await tx.telemetryEvent.findFirst({
      where: { attemptId },
      orderBy: { seqNo: "desc" },
      select: { seqNo: true }
    });

    return lastEvent ? lastEvent.seqNo + 1 : 0;
  }

  private async assertRateLimit(tx: Prisma.TransactionClient, attemptId: string): Promise<void> {
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
    const recentEvents = await tx.telemetryEvent.count({
      where: {
        attemptId,
        timestamp: { gte: windowStart }
      }
    });

    if (recentEvents >= MAX_BATCHES_PER_WINDOW * MAX_EVENTS_PER_BATCH) {
      throw new HttpException("Przekroczono limit zapisu telemetrii dla próby.", HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  private async handlePrismaTelemetryError(error: unknown, attemptId: string, seqStart: number) {
    if (this.isPrismaError(error, "P2002")) {
      const existingSeqStart = await this.prisma.telemetryEvent.findUnique({
        where: { attemptId_seqNo: { attemptId, seqNo: seqStart } },
        select: { id: true }
      });

      if (existingSeqStart) {
        return {
          attemptId,
          accepted: 0,
          duplicated: true,
          nextSequence: await this.getNextSequence(attemptId)
        };
      }

      throw new ConflictException("Konflikt unikalności podczas zapisu telemetrii.");
    }

    throw this.mapPrismaError(error);
  }

  private mapPrismaError(error: unknown): Error {
    if (error instanceof HttpException) return error;
    if (this.isPrismaError(error, "P2002")) {
      return new ConflictException("Konflikt unikalności danych.");
    }
    if (this.isPrismaError(error, "P2025")) {
      return new NotFoundException("Nie znaleziono rekordu.");
    }
    return error instanceof Error ? error : new Error("Nieznany błąd bazy danych.");
  }

  private isPrismaError(error: unknown, code: string): error is Prisma.PrismaClientKnownRequestError {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
  }

  private assertAttemptId(attemptId: string): void {
    if (typeof attemptId !== "string" || !/^[a-zA-Z0-9_-]{3,80}$/.test(attemptId)) {
      throw new BadRequestException("Identyfikator próby ma nieprawidłowy format.");
    }
  }

  private sanitizePayload(event: TelemetryEventDto): SanitizedPayload {
    if (!event.payload || typeof event.payload !== "object") {
      throw new BadRequestException("Brak danych payload lub nieprawidłowy format.");
    }

    if (event.type === "pointer_sample") {
      const x = this.requireFiniteNumber(event.payload.x, "payload.x");
      const y = this.requireFiniteNumber(event.payload.y, "payload.y");
      const buttons = this.requireInteger(event.payload.buttons, "payload.buttons");

      if (x < 0 || x > 1 || y < 0 || y > 1 || buttons < 0 || buttons > 31) {
        throw new BadRequestException("Dane zdarzenia wskaźnika są poza dozwolonym zakresem.");
      }

      return { x, y, buttons };
    }

    if (event.type === "key_meta") {
      const category = this.requireString(event.payload.category, "payload.category", 20);
      const code = this.requireString(event.payload.code, "payload.code", 40);
      const repeat = this.requireBoolean(event.payload.repeat, "payload.repeat");

      if (!["navigation", "editing", "system"].includes(category)) {
        throw new BadRequestException("Nieprawidłowa kategoria zdarzenia klawiatury.");
      }

      return { category, code, repeat };
    }

    const state = this.requireString(event.payload.state, "payload.state", 20);
    if (!["visible", "hidden", "prerender", "unloaded"].includes(state)) {
      throw new BadRequestException("Nieprawidłowy stan widoczności strony.");
    }

    return { state };
  }

  private requireFiniteNumber(value: unknown, fieldName: string): number {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new BadRequestException(`Pole ${fieldName} musi być liczbą.`);
    }
    return value;
  }

  private requireInteger(value: unknown, fieldName: string): number {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      throw new BadRequestException(`Pole ${fieldName} musi być liczbą całkowitą.`);
    }
    return value;
  }

  private requireString(value: unknown, fieldName: string, maxLength: number): string {
    if (typeof value !== "string" || value.length > maxLength) {
      throw new BadRequestException(`Pole ${fieldName} musi być tekstem o długości do ${maxLength} znaków.`);
    }
    return value;
  }

  private requireBoolean(value: unknown, fieldName: string): boolean {
    if (typeof value !== "boolean") {
      throw new BadRequestException(`Pole ${fieldName} musi być wartością logiczną.`);
    }
    return value;
  }
}
