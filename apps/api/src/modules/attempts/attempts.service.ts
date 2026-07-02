import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, OnModuleDestroy } from "@nestjs/common";
import { AttemptStatus, Prisma } from "@prisma/client";
import { AuthService } from "../auth/auth.service";
import { PrismaService } from "../database/prisma.service";
import { SaveAnswerDto } from "./dto/save-answer.dto";
import { TelemetryBatchDto, TelemetryEventDto } from "./dto/telemetry.dto";

type SanitizedPayload = TelemetryEventDto["payload"];

const MAX_EVENTS_PER_BATCH = 500;
const MAX_EVENTS_PER_ATTEMPT = 10_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_BATCHES_PER_WINDOW = 120;
const TERMINAL_ATTEMPT_STATUSES = new Set<AttemptStatus>([
  AttemptStatus.FINISHED,
  AttemptStatus.EXPIRED,
  AttemptStatus.CANCELLED
]);

type RateLimitBucket = {
  batchTimestamps: number[];
  lastSeenAt: number;
};

@Injectable()
export class AttemptsService implements OnModuleDestroy {
  private readonly rateLimitBuckets = new Map<string, RateLimitBucket>();
  private readonly rateLimitCleanupInterval: NodeJS.Timeout;

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) {
    this.rateLimitCleanupInterval = setInterval(() => this.cleanupRateLimitBuckets(), RATE_LIMIT_WINDOW_MS);
    this.rateLimitCleanupInterval.unref?.();
  }

  onModuleDestroy() {
    clearInterval(this.rateLimitCleanupInterval);
    this.rateLimitBuckets.clear();
  }

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

        if (TERMINAL_ATTEMPT_STATUSES.has(attempt.status)) {
          this.clearRateLimitBucket(attemptId);
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

        this.assertRateLimit(attemptId);

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
      const existingAttempt = await this.prisma.attempt.findUnique({
        where: { id: attemptId },
        select: {
          id: true,
          status: true,
          finishedAt: true,
          _count: { select: { telemetry: true } }
        }
      });

      if (!existingAttempt) {
        throw new NotFoundException("Nie znaleziono próby do zakończenia.");
      }

      if (existingAttempt.status === AttemptStatus.FINISHED) {
        this.clearRateLimitBucket(attemptId);
        return this.formatFinishedAttempt(existingAttempt);
      }

      if (existingAttempt.status === AttemptStatus.EXPIRED || existingAttempt.status === AttemptStatus.CANCELLED) {
        this.clearRateLimitBucket(attemptId);
        throw new ConflictException("Nie można zakończyć próby w statusie terminalnym.");
      }

      await this.prisma.attempt.updateMany({
        where: {
          id: attemptId,
          status: { in: [AttemptStatus.CREATED, AttemptStatus.IN_PROGRESS] }
        },
        data: {
          status: AttemptStatus.FINISHED,
          finishedAt: new Date()
        }
      });

      const finishedAttempt = await this.prisma.attempt.findUnique({
        where: { id: attemptId },
        select: {
          id: true,
          status: true,
          finishedAt: true,
          _count: { select: { telemetry: true } }
        }
      });

      if (!finishedAttempt) {
        throw new NotFoundException("Nie znaleziono próby do zakończenia.");
      }

      if (finishedAttempt.status === AttemptStatus.EXPIRED || finishedAttempt.status === AttemptStatus.CANCELLED) {
        this.clearRateLimitBucket(attemptId);
        throw new ConflictException("Nie można zakończyć próby w statusie terminalnym.");
      }

      this.clearRateLimitBucket(attemptId);
      return this.formatFinishedAttempt(finishedAttempt);
    } catch (error) {
      if (this.isPrismaError(error, "P2025")) {
        throw new NotFoundException("Nie znaleziono próby do zakończenia.");
      }
      throw this.mapPrismaError(error);
    }
  }

  async findOne(attemptId: string, authorization?: string) {
    this.assertAttemptId(attemptId);
    const user = await this.getAuthenticatedUser(authorization);

    const attempt = await this.prisma.attempt.findUnique({
      where: { id: attemptId },
      select: {
        id: true,
        quizId: true,
        studentId: true,
        attemptNo: true,
        startedAt: true,
        finishedAt: true,
        status: true,
        scoreTotal: true,
        resultJson: true,
        quiz: {
          select: {
            id: true,
            title: true,
            durationSec: true,
            questions: {
              orderBy: { ordinal: "asc" },
              select: { id: true, ordinal: true, type: true, promptMd: true, optionsJson: true, points: true }
            }
          }
        },
        answers: {
          select: { questionId: true, answerJson: true, savedAt: true, finalizedAt: true, score: true }
        }
      }
    });

    if (!attempt || attempt.studentId !== user.id) throw new NotFoundException("Nie znaleziono próby.");

    return {
      ...attempt,
      scoreTotal: attempt.scoreTotal?.toString() ?? null,
      quiz: {
        ...attempt.quiz,
        questions: attempt.quiz.questions.map((question) => ({
          ...question,
          points: question.points.toString()
        }))
      },
      answers: attempt.answers.map((answer) => ({
        ...answer,
        score: answer.score?.toString() ?? null
      }))
    };
  }

  async saveAnswer(attemptId: string, questionId: string, body: SaveAnswerDto, authorization?: string) {
    this.assertAttemptId(attemptId);
    this.assertQuestionId(questionId);

    const user = await this.getAuthenticatedUser(authorization);

    if (!this.isJsonCompatible(body.answer)) {
      throw new BadRequestException("Odpowiedź musi być poprawną wartością JSON.");
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const attempt = await tx.attempt.findUnique({
          where: { id: attemptId },
          select: {
            id: true,
            quizId: true,
            studentId: true,
            status: true,
            startedAt: true,
            quiz: { select: { durationSec: true } }
          }
        });
        if (!attempt || attempt.studentId !== user.id) throw new NotFoundException("Nie znaleziono próby.");
        if (TERMINAL_ATTEMPT_STATUSES.has(attempt.status)) {
          throw new ConflictException("Nie można zapisać odpowiedzi do zakończonej próby.");
        }

        const now = new Date();
        const effectiveStartedAt = attempt.startedAt ?? now;
        this.assertAttemptTimeRemaining(effectiveStartedAt, attempt.quiz.durationSec, now);

        const question = await tx.question.findUnique({
          where: { id: questionId },
          select: { id: true, quizId: true }
        });
        if (!question || question.quizId !== attempt.quizId) {
          throw new NotFoundException("Nie znaleziono pytania w quizie tej próby.");
        }

        const answer = await tx.answer.upsert({
          where: { attemptId_questionId: { attemptId, questionId } },
          create: {
            attemptId,
            questionId,
            answerJson: body.answer as Prisma.InputJsonValue
          },
          update: {
            answerJson: body.answer as Prisma.InputJsonValue,
            finalizedAt: null
          },
          select: { attemptId: true, questionId: true, answerJson: true, savedAt: true, finalizedAt: true, score: true }
        });

        await tx.attempt.update({
          where: { id: attemptId },
          data: {
            status: attempt.status === AttemptStatus.CREATED ? AttemptStatus.IN_PROGRESS : attempt.status,
            startedAt: attempt.status === AttemptStatus.CREATED ? effectiveStartedAt : undefined
          }
        });

        return { ...answer, score: answer.score?.toString() ?? null };
      });
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  private async getAuthenticatedUser(authorization?: string): Promise<{ id: string; email: string }> {
    const session = this.authService.getSessionFromAuthorization(authorization);
    const user = await this.prisma.user.findUnique({
      where: { email: session.sub },
      select: { id: true, email: true }
    });

    if (!user) throw new HttpException("Nie znaleziono użytkownika dla podanego tokenu.", HttpStatus.UNAUTHORIZED);
    return user;
  }

  private assertAttemptTimeRemaining(startedAt: Date, durationSec: number, now: Date): void {
    const deadlineMs = startedAt.getTime() + durationSec * 1000;
    if (now.getTime() > deadlineMs) {
      throw new ConflictException("Czas na zapis odpowiedzi w tej próbie minął.");
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

  private assertRateLimit(attemptId: string): void {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    const bucket = this.rateLimitBuckets.get(attemptId) ?? { batchTimestamps: [], lastSeenAt: now };

    bucket.batchTimestamps = bucket.batchTimestamps.filter((timestamp) => timestamp > windowStart);
    bucket.lastSeenAt = now;

    if (bucket.batchTimestamps.length >= MAX_BATCHES_PER_WINDOW) {
      this.rateLimitBuckets.set(attemptId, bucket);
      throw new HttpException("Przekroczono limit zapisu telemetrii dla próby.", HttpStatus.TOO_MANY_REQUESTS);
    }

    bucket.batchTimestamps.push(now);
    this.rateLimitBuckets.set(attemptId, bucket);
    this.cleanupRateLimitBuckets(now);
  }

  private cleanupRateLimitBuckets(now = Date.now()): void {
    const inactiveBefore = now - RATE_LIMIT_WINDOW_MS;

    for (const [attemptId, bucket] of this.rateLimitBuckets) {
      bucket.batchTimestamps = bucket.batchTimestamps.filter((timestamp) => timestamp > inactiveBefore);

      if (bucket.batchTimestamps.length === 0 && bucket.lastSeenAt <= inactiveBefore) {
        this.rateLimitBuckets.delete(attemptId);
      }
    }
  }

  private clearRateLimitBucket(attemptId: string): void {
    this.rateLimitBuckets.delete(attemptId);
  }

  private formatFinishedAttempt(attempt: {
    id: string;
    status: AttemptStatus;
    finishedAt: Date | null;
    _count: { telemetry: number };
  }) {
    return {
      attemptId: attempt.id,
      status: attempt.status,
      score: null,
      telemetryEvents: attempt._count.telemetry,
      finishedAt: attempt.finishedAt?.toISOString()
    };
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

  private assertQuestionId(questionId: string): void {
    if (typeof questionId !== "string" || !/^[a-zA-Z0-9_-]{3,80}$/.test(questionId)) {
      throw new BadRequestException("Identyfikator pytania ma nieprawidłowy format.");
    }
  }

  private isJsonCompatible(value: unknown): boolean {
    if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return typeof value !== "number" || Number.isFinite(value);
    }
    if (Array.isArray(value)) {
      return value.every((item) => this.isJsonCompatible(item));
    }
    if (typeof value === "object") {
      return Object.values(value as Record<string, unknown>).every((item) => this.isJsonCompatible(item));
    }
    return false;
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
