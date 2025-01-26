import { Expose } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class PaginationPresenter<T> {
  @Expose()
  @IsArray()
  data: T[];

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  page: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  count: number;
}
