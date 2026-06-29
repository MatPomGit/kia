import { Type } from "class-transformer";
import {
  IsArray,
  IsIn,
  IsInt,
  IsISO8601,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested
} from "class-validator";

export class TelemetryEventDto {
  @IsISO8601()
  timestamp!: string;

  @IsIn(["pointer_sample", "key_meta", "visibility"])
  type!: "pointer_sample" | "key_meta" | "visibility";

  @IsOptional()
  @IsString()
  @MaxLength(100)
  questionId?: string;

  @IsObject()
  payload!: Record<string, unknown>;
}

export class TelemetryBatchDto {
  @IsInt()
  @Min(0)
  seqStart!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TelemetryEventDto)
  events!: TelemetryEventDto[];
}
