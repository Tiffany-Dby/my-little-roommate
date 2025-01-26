import { Expose } from "class-transformer";
import { IsEnum, IsNotEmptyObject } from "class-validator";
import { UserToRentalEntity } from "../../databases/mysql/userToRental.entity";
import { UserStatus } from "../user/UserStatus";

export class UserToRentalToCreateInput {
  @Expose()
  @IsNotEmptyObject()
  user: UserToRentalEntity["user"];

  @Expose()
  @IsEnum(UserStatus)
  status: UserToRentalEntity["status"];
}

export class UserToRentalAddMemberInput {
  @Expose()
  @IsNotEmptyObject()
  user: UserToRentalEntity["user"];

  @Expose()
  @IsNotEmptyObject()
  rental: UserToRentalEntity["rental"];
}
