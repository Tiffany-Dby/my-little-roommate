import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { RentalEntity } from "../../databases/mysql/rental.entity";
import { UserToRentalEntity } from "../../databases/mysql/userToRental.entity";
import { UserToRentalPresenter } from "../userToRental/presenters";

export class RentalPresenter {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  id: RentalEntity["id"];

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
  @Type(() => UserToRentalPresenter)
  users: UserToRentalPresenter[];
}
