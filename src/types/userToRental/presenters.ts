import { Expose, Type } from "class-transformer";
import { UserEntity } from "../../databases/mysql/user.entity";
import { UserStatus } from "../user/UserStatus";
import { IsEnum, IsNumber } from "class-validator";
import { UserToRentalEntity } from "../../databases/mysql/userToRental.entity";
import { UserPresenter } from "../user/presenters";
import { RentalPresenter } from "../rental/presenters";

export class UserToRentalPresenter {
  @Expose()
  @IsNumber()
  id: UserToRentalEntity["id"];

  @Expose()
  @Type(() => UserPresenter)
  user: UserPresenter;

  @Expose()
  @Type(() => RentalPresenter)
  rental: RentalPresenter;

  @Expose()
  @IsEnum(UserStatus)
  status: UserToRentalEntity["status"];
}
