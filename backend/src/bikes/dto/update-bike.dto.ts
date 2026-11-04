import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  ValidateIf,
} from "class-validator";

const supplied = (_object: unknown, value: unknown) => value !== undefined;

const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

export class UpdateBikeDto {
  @ValidateIf(supplied)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  brand?: string;

  @ValidateIf(supplied)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  model?: string;

  @ValidateIf(supplied)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ValidateIf(supplied)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  category?: string;

  @ValidateIf(supplied)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  frameMaterial?: string;

  @ValidateIf(supplied)
  @IsNumber()
  @IsPositive()
  frameSizeCm?: number;

  @ValidateIf(supplied)
  @IsNumber()
  @IsPositive()
  wheelSizeInches?: number;

  @ValidateIf(supplied)
  @IsInt()
  @Min(1)
  gearCount?: number;

  @ValidateIf(supplied)
  @IsNumber()
  @IsPositive()
  weightKg?: number;

  @ValidateIf(supplied)
  @IsBoolean()
  electric?: boolean;

  @ValidateIf(supplied)
  @IsInt()
  @Min(0)
  priceCents?: number;
}
