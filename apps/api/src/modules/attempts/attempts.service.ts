import { BadRequestException, Injectable } from "@nestjs/common";
import { TelemetryBatchDto } from "./dto/telemetry.dto";

@Injectable()
export class AttemptsService {
  saveTelemetry(attemptId: string, batch: TelemetryBatchDto) {
    if (batch.events.length > 500) {
      throw new BadRequestException("Paczka może zawierać maksymalnie 500 zdarzeń.");
    }

    // TODO:
    // - sprawdzić właściciela próby,
    // - zweryfikować status próby,
    // - odrzucić niedozwolone pola,
    // - zapisać transakcyjnie z unikalnym attemptId + seqNo,
    // - zastosować rate limiting.
    return {
      attemptId,
      accepted: batch.events.length,
      nextSequence: batch.seqStart + batch.events.length
    };
  }

  finish(attemptId: string) {
    // TODO: zakończenie próby i obliczenie wyniku po stronie serwera.
    return {
      attemptId,
      status: "finished",
      score: null
    };
  }
}
