import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { AttemptsModule } from "./modules/attempts/attempts.module";
import { CoursesModule } from "./modules/courses/courses.module";
import { QuizzesModule } from "./modules/quizzes/quizzes.module";
import { ResultsModule } from "./modules/results/results.module";

@Module({
  imports: [AuthModule, CoursesModule, AttemptsModule, QuizzesModule, ResultsModule],
  controllers: [HealthController]
})
export class AppModule {}
