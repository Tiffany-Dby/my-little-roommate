import { Repository, UpdateResult } from "typeorm";
import { UserToRentalEntity } from "../databases/mysql/userToRental.entity";
import { connectMySQLDB } from "../configs/databases/mysql.config";
import {
  UserToRentalAddMemberInput,
  UserToRentalToCreateInput,
} from "../types/userToRental/inputs";
import { UserToRentalDTO } from "../types/userToRental/dtos";
import { RentalEntity } from "../databases/mysql/rental.entity";
import { UserStatus } from "../types/user/UserStatus";
import { UserEntity } from "../databases/mysql/user.entity";

export class UserToRentalRepository {
  private userToRentalDB: Repository<UserToRentalEntity>;

  constructor() {
    this.userToRentalDB = connectMySQLDB.getRepository(UserToRentalEntity);
  }

  create(user: UserToRentalToCreateInput) {
    const newUserToRental = new UserToRentalEntity();
    newUserToRental.user = user.user;
    newUserToRental.status = user.status;

    return newUserToRental;
  }

  async save(userToRental: UserToRentalEntity) {
    return this.userToRentalDB.save(userToRental);
  }

  async addMemberToRental(
    userToRental: UserToRentalAddMemberInput
  ): Promise<UserToRentalEntity> {
    const newUserToRental = new UserToRentalEntity();
    newUserToRental.user = userToRental.user;
    newUserToRental.rental = userToRental.rental;
    newUserToRental.status = UserStatus.member;

    return newUserToRental;
  }

  async getOneUserToRentalByCriterias(
    criterias: UserToRentalDTO
  ): Promise<UserToRentalEntity | null> {
    return this.userToRentalDB.findOne({
      where: {
        user: { id: criterias.userId },
        rental: { id: criterias.rentalId },
      },
    });
  }

  async deleteUserRental(rentalId: RentalEntity["id"]): Promise<UpdateResult> {
    return await this.userToRentalDB.softDelete({
      rental: { id: rentalId },
    });
  }

  async removeMemberToRental(
    userId: UserEntity["id"],
    rentalId: RentalEntity["id"]
  ): Promise<UpdateResult> {
    return await this.userToRentalDB.softDelete({
      user: { id: userId },
      rental: { id: rentalId },
    });
  }
}
