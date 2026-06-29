import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { AttemptsModule } from "./modules/attempts/attempts.module";
import { CoursesModule } from "./modules/courses/courses.module";

@Module({
  imports: [CoursesModule, AttemptsModule],
  controllers: [HealthController]
})
export class AppModule {}
