import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { AttemptsService } from "./attempts.service";
import { SaveAnswerDto } from "./dto/save-answer.dto";
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

  @Get(":attemptId")
  findOne(@Param("attemptId") attemptId: string) {
    return this.attemptsService.findOne(attemptId);
  }

  @Put(":attemptId/answers/:questionId")
  saveAnswer(
    @Param("attemptId") attemptId: string,
    @Param("questionId") questionId: string,
    @Body() body: SaveAnswerDto
  ) {
    return this.attemptsService.saveAnswer(attemptId, questionId, body);
  }
}
