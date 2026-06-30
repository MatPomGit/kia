import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { TelemetryBatchDto, TelemetryEventDto } from "./dto/telemetry.dto";

type AttemptStatus = "in_progress" | "finished";
type SanitizedPayload = TelemetryEventDto["payload"];

interface StoredAttempt {
  attemptId: string;
  events: TelemetryEventDto[];
  nextSequence: number;
  status: AttemptStatus;
  receivedBatches: number;
  recentBatchTimestamps: number[];
  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
}

const MAX_EVENTS_PER_BATCH = 500;
const MAX_EVENTS_PER_ATTEMPT = 10_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_BATCHES_PER_WINDOW = 120;

@Injectable()
export class AttemptsService {
  private readonly attempts = new Map<string, StoredAttempt>();

  saveTelemetry(attemptId: string, batch: TelemetryBatchDto) {
    this.assertAttemptId(attemptId);

    if (batch.events.length > MAX_EVENTS_PER_BATCH) {
      throw new BadRequestException(`Paczka może zawierać maksymalnie ${MAX_EVENTS_PER_BATCH} zdarzeń.`);
    }

    const attempt = this.getOrCreateAttempt(attemptId, batch.seqStart);

    if (attempt.status === "finished") {
      throw new ConflictException("Nie można dopisać telemetrii do zakończonej próby.");
    }

    if (batch.seqStart < attempt.nextSequence) {
      return {
        attemptId,
        accepted: 0,
        duplicated: true,
        nextSequence: attempt.nextSequence
      };
    }

    if (batch.seqStart !== attempt.nextSequence) {
      throw new ConflictException(`Nieprawidłowy numer sekwencji. Oczekiwano ${attempt.nextSequence}.`);
    }

    this.assertRateLimit(attempt);

    if (attempt.events.length + batch.events.length > MAX_EVENTS_PER_ATTEMPT) {
      throw new ConflictException(`Próba może zawierać maksymalnie ${MAX_EVENTS_PER_ATTEMPT} zdarzeń telemetrii.`);
    }

    const sanitizedEvents = batch.events.map((event) => this.sanitizeEvent(event));
    attempt.events.push(...sanitizedEvents);
    attempt.nextSequence += sanitizedEvents.length;
    attempt.receivedBatches += 1;
    attempt.updatedAt = new Date().toISOString();

    return {
      attemptId,
      accepted: sanitizedEvents.length,
      duplicated: false,
      nextSequence: attempt.nextSequence
    };
  }

  finish(attemptId: string) {
    this.assertAttemptId(attemptId);

    const attempt = this.attempts.get(attemptId);
    if (!attempt) {
      throw new NotFoundException("Nie znaleziono próby do zakończenia.");
    }

    if (attempt.status === "in_progress") {
      attempt.status = "finished";
      attempt.finishedAt = new Date().toISOString();
      attempt.updatedAt = attempt.finishedAt;
    }

    return {
      attemptId,
      status: attempt.status,
      score: null,
      telemetryEvents: attempt.events.length,
      telemetryBatches: attempt.receivedBatches,
      finishedAt: attempt.finishedAt
    };
  }

  private getOrCreateAttempt(attemptId: string, seqStart: number): StoredAttempt {
    const existingAttempt = this.attempts.get(attemptId);
    if (existingAttempt) return existingAttempt;

    if (seqStart !== 0) {
      throw new ConflictException("Pierwsza paczka telemetrii musi zaczynać się od sekwencji 0.");
    }

    const now = new Date().toISOString();
    const attempt: StoredAttempt = {
      attemptId,
      events: [],
      nextSequence: 0,
      status: "in_progress",
      receivedBatches: 0,
      recentBatchTimestamps: [],
      createdAt: now,
      updatedAt: now
    };
    this.attempts.set(attemptId, attempt);
    return attempt;
  }

  private assertAttemptId(attemptId: string): void {
    if (!/^[a-zA-Z0-9_-]{3,80}$/.test(attemptId)) {
      throw new BadRequestException("Identyfikator próby ma nieprawidłowy format.");
    }
  }

  private assertRateLimit(attempt: StoredAttempt): void {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    attempt.recentBatchTimestamps = attempt.recentBatchTimestamps.filter((timestamp) => timestamp >= windowStart);

    if (attempt.recentBatchTimestamps.length >= MAX_BATCHES_PER_WINDOW) {
      throw new HttpException("Przekroczono limit zapisu telemetrii dla próby.", HttpStatus.TOO_MANY_REQUESTS);
    }

    attempt.recentBatchTimestamps.push(now);
  }

  private sanitizeEvent(event: TelemetryEventDto): TelemetryEventDto {
    return {
      timestamp: event.timestamp,
      type: event.type,
      questionId: event.questionId,
      payload: this.sanitizePayload(event)
    };
  }

  private sanitizePayload(event: TelemetryEventDto): SanitizedPayload {
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
