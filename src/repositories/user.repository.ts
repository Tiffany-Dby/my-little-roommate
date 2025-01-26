import { DeleteResult, FindOptionsWhere, Repository } from "typeorm";
import { UserEntity } from "../databases/mysql/user.entity";
import { connectMySQLDB } from "../configs/databases/mysql.config";
import { userToCreateInput } from "../types/user/Inputs";
import { UserToGetRentalsDTO } from "../types/user/dtos";
import { UserToRentalEntity } from "../databases/mysql/userToRental.entity";

export class UserRepository {
  private userDB: Repository<UserEntity>;

  constructor() {
    this.userDB = connectMySQLDB.getRepository(UserEntity);
  }

  create(user: userToCreateInput): UserEntity {
    const newUser = new UserEntity();
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    newUser.age = user.age;
    newUser.email = user.email;
    newUser.credentials = user.credentials;

    return newUser;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return await this.userDB.save(user);
  }

  async getOneByCriterias(criterias: {
    where: FindOptionsWhere<UserEntity>;
    relations?: string[];
  }): Promise<UserEntity | null> {
    return await this.userDB.findOne({
      ...criterias,
      where: {
        ...criterias.where,
        rentals: { deletedAt: null },
      } as FindOptionsWhere<UserToRentalEntity>,
    });
  }

  async getUserRentalsById(
    id: UserToGetRentalsDTO
  ): Promise<UserEntity | null> {
    return await this.getOneByCriterias({
      where: id,
      relations: ["rentals", "rentals.rental"],
    });
  }

  async deleteUser(id: UserEntity["id"]): Promise<DeleteResult> {
    return await this.userDB.delete(id);
  }
}
