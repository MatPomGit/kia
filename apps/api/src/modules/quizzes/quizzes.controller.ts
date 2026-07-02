import { Controller, Headers, Param, Post } from "@nestjs/common";
import { QuizzesService } from "./quizzes.service";

@Controller("quizzes")
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post(":id/attempts")
  createAttempt(@Param("id") quizId: string, @Headers("authorization") authorization?: string) {
    return this.quizzesService.createAttempt(quizId, authorization);
  }
}
