import { Expose } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { RentalEntity } from "../../databases/mysql/rental.entity";
import { UserEntity } from "../../databases/mysql/user.entity";

export class RentalToCreateDTO {
  @Expose()
  @IsNumber()
  @Min(1, { message: "Number must be atleast 1" })
  @IsNotEmpty()
  number: RentalEntity["number"];

  @Expose()
  @IsString()
  @IsNotEmpty()
  street: RentalEntity["street"];

  @Expose()
  @IsString()
  @IsNotEmpty()
  city: RentalEntity["city"];

  @Expose()
  @IsNumber()
  @Min(1, { message: "Zipcode must be atleast 1" })
  @IsNotEmpty()
  zipcode: RentalEntity["zipcode"];

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  roomsCount: RentalEntity["roomsCount"];

  @Expose()
  @IsNumber()
  @Min(1, { message: "Surface must be atleast 1" })
  @IsNotEmpty()
  surface: RentalEntity["surface"];

  @Expose()
  @IsString()
  @IsNotEmpty()
  agency: RentalEntity["agency"];

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  userId: UserEntity["id"];
}

export class RentalToFindDTO {
  @Expose()
  @IsOptional()
  @IsString()
  street?: RentalEntity["street"];

  @Expose()
  @IsOptional()
  @IsNumber()
  surface?: RentalEntity["surface"];

  @Expose()
  @IsOptional()
  @IsString()
  agency?: RentalEntity["agency"];

  @Expose()
  @IsOptional()
  @IsNumber()
  roomsCount?: RentalEntity["roomsCount"];

  @Expose()
  @IsOptional()
  @IsString()
  city?: RentalEntity["city"];

  @Expose()
  @IsOptional()
  @IsNumber()
  zipcode?: RentalEntity["zipcode"];
}

export class RentalToGetOneDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string;
}
