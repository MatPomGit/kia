import { Module } from "@nestjs/common";
import { AttemptsController } from "./attempts.controller";
import { DatabaseModule } from "../database/database.module";
import { AuthModule } from "../auth/auth.module";
import { AttemptsService } from "./attempts.service";

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AttemptsController],
  providers: [AttemptsService]
})
export class AttemptsModule {}
