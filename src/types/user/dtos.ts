import { Expose } from "class-transformer";
import { UserEntity } from "../../databases/mysql/user.entity";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  Min,
} from "class-validator";
import { UserCredentialsEntity } from "../../databases/mysql/userCredentials.entity";
import { UserLoginPresenter, UserPresenter } from "./presenters";
import { RentalEntity } from "../../databases/mysql/rental.entity";

export class UserToCreateDTO {
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
  @Min(18, { message: "Age must be at least 18" })
  @IsNotEmpty()
  age: UserEntity["age"];

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: UserCredentialsEntity["password"];
}

export class UserToLoginDTO {
  @Expose()
  @IsEmail()
  email: UserEntity["email"];

  @Expose()
  @IsString()
  @IsNotEmpty()
  password: UserCredentialsEntity["password"];
}

export class UserToDeleteDTO {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  id: UserEntity["id"];
}

export class UserToRefreshAccessTokenDTO {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  userId: UserEntity["id"];

  @Expose()
  @IsString()
  @IsNotEmpty()
  refreshToken: UserLoginPresenter["refreshToken"];
}

export class UserToGetRentalsDTO {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  id: UserEntity["id"];
}
