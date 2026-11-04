import type { BikeModel } from "../models/bike.model";
import { BikeResponseDto } from "./bike-response.dto";

export class BikesPageResponseDto {
  totalCount: number;
  bikes: BikeResponseDto[];

  static fromModels(
    models: BikeModel[],
    totalCount: number,
  ): BikesPageResponseDto {
    const dto = new BikesPageResponseDto();
    dto.totalCount = totalCount;
    dto.bikes = models.map((model) => BikeResponseDto.fromModel(model));
    return dto;
  }
}
