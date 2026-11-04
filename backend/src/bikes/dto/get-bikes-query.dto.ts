import { Transform, Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

// Query values arrive as strings because implicit conversion is off.
const defaultNumber = (fallback: number) => {
  return ({ value }: { value: unknown }) =>
    value === undefined ? fallback : value;
};

export class GetBikesQueryDto {
  @Transform(defaultNumber(1))
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Transform(defaultNumber(10))
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;
}
