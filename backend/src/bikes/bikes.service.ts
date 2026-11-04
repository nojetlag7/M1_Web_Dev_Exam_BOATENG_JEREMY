import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { BikesRepository } from "./bikes.repository";
import type {
  BikeModel,
  CreateBikeModel,
  UpdateBikeModel,
} from "./models/bike.model";
import {
  BikeHasSalesError,
  BikeNotFoundError,
} from "./models/persistence-error.model";

@Injectable()
export class BikesService {
  constructor(
    @Inject(BikesRepository) private readonly repository: BikesRepository,
  ) {}

  findAll(page: number, limit: number): Promise<[BikeModel[], number]> {
    return this.repository.findAll(page, limit);
  }

  async findById(id: string): Promise<BikeModel> {
    const bike = await this.repository.findById(id);
    if (!bike) throw new NotFoundException("Bike not found");
    return bike;
  }

  async create(input: CreateBikeModel): Promise<BikeModel> {
    try {
      return await this.repository.create(input);
    } catch (error) {
      this.translateError(error);
    }
  }

  async update(id: string, input: UpdateBikeModel): Promise<BikeModel> {
    if (!Object.values(input).some((value) => value !== undefined))
      throw new BadRequestException("At least one field must be supplied");
    try {
      return await this.repository.update(id, input);
    } catch (error) {
      this.translateError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      if (!(await this.repository.delete(id)))
        throw new NotFoundException("Bike not found");
    } catch (error) {
      this.translateError(error);
    }
  }

  private translateError(error: unknown): never {
    if (error instanceof BikeNotFoundError)
      throw new NotFoundException("Bike not found");
    if (error instanceof BikeHasSalesError)
      throw new ConflictException("Bike is associated with a sale");
    throw error;
  }
}
