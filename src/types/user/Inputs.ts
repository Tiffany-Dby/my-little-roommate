import { Expose, Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { UserEntity } from "../../databases/mysql/user.entity";
import { UserCredentialsEntity } from "../../databases/mysql/userCredentials.entity";

export class userToCreateInput {
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

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Type(() => UserCredentialsEntity)
  credentials: UserCredentialsEntity;
}
