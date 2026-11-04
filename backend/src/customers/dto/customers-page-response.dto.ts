import type { CustomerModel } from "../models/customer.model";
import { CustomerResponseDto } from "./customer-response.dto";

//customers page response dto
export class CustomersPageResponseDto {
  totalCount: number;
  customers: CustomerResponseDto[];

  static fromModels(
    models: CustomerModel[],
    totalCount: number,
  ): CustomersPageResponseDto {
    const dto = new CustomersPageResponseDto();
    dto.totalCount = totalCount;
    dto.customers = models.map((model) => CustomerResponseDto.fromModel(model));
    return dto;
  }
}
