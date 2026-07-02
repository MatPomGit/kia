import { Module } from "@nestjs/common";
import { AttemptsController } from "./attempts.controller";
import { DatabaseModule } from "../database/database.module";
import { AttemptsService } from "./attempts.service";

@Module({
  imports: [DatabaseModule],
  controllers: [AttemptsController],
  providers: [AttemptsService]
})
export class AttemptsModule {}
