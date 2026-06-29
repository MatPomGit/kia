import { Body, Controller, Param, Post } from "@nestjs/common";
import { AttemptsService } from "./attempts.service";
import { TelemetryBatchDto } from "./dto/telemetry.dto";

@Controller("attempts")
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post(":attemptId/events/batch")
  saveTelemetry(
    @Param("attemptId") attemptId: string,
    @Body() body: TelemetryBatchDto
  ) {
    return this.attemptsService.saveTelemetry(attemptId, body);
  }

  @Post(":attemptId/finish")
  finish(@Param("attemptId") attemptId: string) {
    return this.attemptsService.finish(attemptId);
  }
}
