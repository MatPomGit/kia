import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { AttemptsModule } from "./modules/attempts/attempts.module";
import { CoursesModule } from "./modules/courses/courses.module";

@Module({
  imports: [AuthModule, CoursesModule, AttemptsModule],
  controllers: [HealthController]
})
export class AppModule {}
