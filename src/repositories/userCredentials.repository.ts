import { Repository } from "typeorm";
import { UserCredentialsEntity } from "../databases/mysql/userCredentials.entity";
import { connectMySQLDB } from "../configs/databases/mysql.config";
import { UserEntity } from "../databases/mysql/user.entity";

export class UserCredentialsRepository {
  private userCredentialsDB: Repository<UserCredentialsEntity>;

  constructor() {
    this.userCredentialsDB = connectMySQLDB.getRepository(
      UserCredentialsEntity
    );
  }

  create(passwordHash: string): UserCredentialsEntity {
    const newUserCredentials = new UserCredentialsEntity();
    newUserCredentials.password = passwordHash;

    return newUserCredentials;
  }

  async getUserCredentials(
    email: UserEntity["email"]
  ): Promise<UserCredentialsEntity | null> {
    return await this.userCredentialsDB.findOne({
      where: { user: { email } },
      relations: ["user"],
    });
  }
}
