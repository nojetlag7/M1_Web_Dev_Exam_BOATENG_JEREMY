import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { BikesService } from "./bikes.service";
import { BikeResponseDto } from "./dto/bike-response.dto";
import { BikesPageResponseDto } from "./dto/bikes-page-response.dto";
import { CreateBikeDto } from "./dto/create-bike.dto";
import { GetBikesQueryDto } from "./dto/get-bikes-query.dto";
import { UpdateBikeDto } from "./dto/update-bike.dto";
import type { CreateBikeModel, UpdateBikeModel } from "./models/bike.model";

@Controller("bikes")
export class BikesController {
  constructor(@Inject(BikesService) private readonly service: BikesService) {}

  @Get()
  async findAll(
    @Query() query: GetBikesQueryDto,
  ): Promise<BikesPageResponseDto> {
    const [models, totalCount] = await this.service.findAll(
      query.page,
      query.limit,
    );
    return BikesPageResponseDto.fromModels(models, totalCount);
  }

  @Post()
  async create(@Body() dto: CreateBikeDto): Promise<BikeResponseDto> {
    const input: CreateBikeModel = {
      brand: dto.brand,
      model: dto.model,
      description: dto.description,
      category: dto.category,
      frameMaterial: dto.frameMaterial,
      frameSizeCm: dto.frameSizeCm,
      wheelSizeInches: dto.wheelSizeInches,
      gearCount: dto.gearCount,
      weightKg: dto.weightKg,
      electric: dto.electric,
      priceCents: dto.priceCents,
    };
    return BikeResponseDto.fromModel(await this.service.create(input));
  }

  @Get(":id")
  async findById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<BikeResponseDto> {
    return BikeResponseDto.fromModel(await this.service.findById(id));
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateBikeDto,
  ): Promise<BikeResponseDto> {
    const input: UpdateBikeModel = {
      brand: dto.brand,
      model: dto.model,
      description: dto.description,
      category: dto.category,
      frameMaterial: dto.frameMaterial,
      frameSizeCm: dto.frameSizeCm,
      wheelSizeInches: dto.wheelSizeInches,
      gearCount: dto.gearCount,
      weightKg: dto.weightKg,
      electric: dto.electric,
      priceCents: dto.priceCents,
    };
    return BikeResponseDto.fromModel(await this.service.update(id, input));
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    await this.service.delete(id);
  }
}
