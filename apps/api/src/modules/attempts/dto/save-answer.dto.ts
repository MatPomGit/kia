import { IsDefined } from "class-validator";

export class SaveAnswerDto {
  @IsDefined()
  answer!: unknown;
}
