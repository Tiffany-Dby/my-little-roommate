import { Expose, Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { RentalEntity } from "../../databases/mysql/rental.entity";
import { UserToRentalEntity } from "../../databases/mysql/userToRental.entity";

export class RentalToCreateInput {
  @Expose()
  @IsNumber()
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
  @IsNotEmpty()
  zipcode: RentalEntity["zipcode"];

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  roomsCount: RentalEntity["roomsCount"];

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  surface: RentalEntity["surface"];

  @Expose()
  @IsString()
  @IsNotEmpty()
  agency: RentalEntity["agency"];

  @Expose()
  @Type(() => UserToRentalEntity)
  users: UserToRentalEntity[];
}

export class RentalsToFindInput {
  @Expose()
  @IsArray()
  data: RentalEntity[];

  @Expose()
  @IsNumber()
  count: number;
}

export class RentalToGetOneInput {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  id: RentalEntity["id"];
}
