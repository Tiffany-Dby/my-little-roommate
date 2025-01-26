import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";
import { UserEntity } from "../../databases/mysql/user.entity";
import { RentalEntity } from "../../databases/mysql/rental.entity";

export class UserToRentalDTO {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  userId: UserEntity["id"];

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  rentalId: RentalEntity["id"];
}
