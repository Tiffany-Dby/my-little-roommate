import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, ValidateNested } from "class-validator";

export class PaginationDTO<T> {
  @Expose()
  @ValidateNested()
  filters: T;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  page: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  limit: number;
}
