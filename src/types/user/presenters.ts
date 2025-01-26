import { Expose, Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { UserEntity } from "../../databases/mysql/user.entity";
import { RentalPresenter } from "../rental/presenters";
import { UserToRentalPresenter } from "../userToRental/presenters";

export class UserPresenter {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  id: UserEntity["id"];

  @Expose()
  @IsString()
  @IsNotEmpty()
  firstName: UserEntity["firstName"];

  @Expose()
  @IsString()
  @IsNotEmpty()
  lastName: UserEntity["lastName"];

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: UserEntity["email"];

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  age: UserEntity["age"];
}

export class UserLoginPresenter {
  @Expose()
  @IsString()
  @IsNotEmpty()
  firstName: UserEntity["firstName"];

  @Expose()
  @IsString()
  @IsNotEmpty()
  lastName: UserEntity["lastName"];

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: UserEntity["email"];

  @Expose()
  @IsString()
  @IsNotEmpty()
  token: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class UserToRefreshAccessTokenPresenter {
  @Expose()
  @IsString()
  @IsNotEmpty()
  firstName: UserEntity["firstName"];

  @Expose()
  @IsString()
  @IsNotEmpty()
  lastName: UserEntity["lastName"];

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: UserEntity["email"];

  @Expose()
  @IsString()
  @IsNotEmpty()
  token: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class UserToGetRentalsPresenter extends UserPresenter {
  @Expose()
  @Type(() => UserToRentalPresenter)
  rentals: UserToRentalPresenter[];
}
