import { DeleteResult, UpdateResult } from "typeorm";
import { UserEntity } from "../databases/mysql/user.entity";
import { UserCredentialsEntity } from "../databases/mysql/userCredentials.entity";
import { UserRepository } from "../repositories/user.repository";
import { UserCredentialsRepository } from "../repositories/userCredentials.repository";
import {
  UserToCreateDTO,
  UserToGetRentalsDTO,
  UserToLoginDTO,
  UserToRefreshAccessTokenDTO,
} from "../types/user/dtos";
import {
  UserLoginPresenter,
  UserToRefreshAccessTokenPresenter,
} from "../types/user/presenters";
import { compareHash, hashPass } from "../utils/bcrypt.utils";
import { jwtSign } from "../utils/jwt.utils";
import { CustomError } from "./customError.service";
import { UserToRentalRepository } from "../repositories/userToRental.repository";
import { UserToRentalDTO } from "../types/userToRental/dtos";
import { RentalRepository } from "../repositories/rental.repository";
import { plainToInstance } from "class-transformer";
import { UserToRentalAddMemberInput } from "../types/userToRental/inputs";
import { UserToRentalEntity } from "../databases/mysql/userToRental.entity";
import { UserStatus } from "../types/user/UserStatus";

export class UserService {
  private userRepository = new UserRepository();
  private userCredentialsRepository = new UserCredentialsRepository();
  private userToRentalRepository = new UserToRentalRepository();
  private rentalRepository = new RentalRepository();

  async registerUser(userToCreate: UserToCreateDTO): Promise<UserEntity> {
    const isUser = await this.userRepository.getOneByCriterias({
      where: { email: userToCreate.email },
    });

    if (!!isUser) throw new CustomError("User already exists", 409, "00001");

    const passHashed = await hashPass(userToCreate.password);

    const newCredentials: UserCredentialsEntity =
      this.userCredentialsRepository.create(passHashed);

    const createdUser = this.userRepository.create({
      ...userToCreate,
      credentials: newCredentials,
    });

    const newUser = await this.userRepository.save(createdUser);

    // APPELER LE EMAIL SERVICE POUR ENVOYER UNE NOTIFICATION DE CREATION DE COMPTE A L'UTILISATEUR NOUVELLEMENT CRÉÉ

    return newUser;
  }

  async loginUser(userToLogin: UserToLoginDTO): Promise<UserLoginPresenter> {
    const { email, password } = userToLogin;

    const user = await this.userCredentialsRepository.getUserCredentials(email);
    if (!user) throw new CustomError("Wrong email or password", 401, "00004");

    const isSame = await compareHash(password, user.password);
    if (!isSame) throw new CustomError("Wrong email or password", 401, "00005");

    const token = jwtSign(user.user, process.env.JWT_SECRET ?? "", {
      expiresIn: process.env.JWT_DURATION ?? "",
    });
    const refreshToken = jwtSign(
      user.user.id,
      process.env.JWT_REFRESH_SECRET ?? "",
      {
        expiresIn: process.env.JWT_REFRESH_DURATION ?? "",
      }
    );

    if (!token || !refreshToken)
      throw new CustomError(
        "An error occured while granting access",
        500,
        "00006"
      );

    const userLoggedIn = {
      firstName: user.user.firstName,
      lastName: user.user.lastName,
      email: user.user.email,
      token,
      refreshToken,
    };

    return userLoggedIn;
  }

  async addMemberToRental(
    userToRental: UserToRentalDTO
  ): Promise<UserToRentalEntity> {
    const user = await this.userRepository.getOneByCriterias({
      where: { id: userToRental.userId },
    });
    if (!user) throw new CustomError("User not found", 404, "00001");

    const rental = await this.rentalRepository.getOneById({
      id: userToRental.rentalId,
    });
    if (!rental) throw new CustomError("Rental not found", 404, "00001");

    const existingUserToRental =
      await this.userToRentalRepository.getOneUserToRentalByCriterias({
        userId: userToRental.userId,
        rentalId: userToRental.rentalId,
      });

    if (existingUserToRental)
      throw new CustomError(
        "User is already a member of this rental",
        400,
        "000016"
      );

    const userToRentalInput = plainToInstance(
      UserToRentalAddMemberInput,
      { user: { id: user.id }, rental: { id: rental.id } },
      { excludeExtraneousValues: true }
    );

    const newUserToRental = await this.userToRentalRepository.addMemberToRental(
      userToRentalInput
    );

    await this.userToRentalRepository.save(newUserToRental);

    return newUserToRental;
  }

  async getUser(id: UserEntity["id"]): Promise<UserEntity> {
    const user = await this.userRepository.getOneByCriterias({ where: { id } });

    if (!user) throw new CustomError("User not found", 404, "00001");

    return user;
  }

  async refreshUserAccessToken(
    userToGet: UserToRefreshAccessTokenDTO
  ): Promise<UserToRefreshAccessTokenPresenter> {
    const newToken = jwtSign(userToGet.userId, process.env.JWT_SECRET ?? "", {
      expiresIn: process.env.JWT_DURATION ?? "",
    });

    const user = await this.getUser(userToGet.userId);

    return { ...user, token: newToken, refreshToken: userToGet.refreshToken };
  }

  async getUserRentalsById(id: UserToGetRentalsDTO): Promise<UserEntity> {
    const user = await this.userRepository.getUserRentalsById(id);

    if (!user) throw new CustomError("User not found", 404, "00001");

    return user;
  }

  async transferRentalAdmin(
    userToRental: UserToRentalDTO,
    currentAdminId: UserEntity["id"]
  ): Promise<UserToRentalEntity> {
    const userToRentalEntity =
      await this.userToRentalRepository.getOneUserToRentalByCriterias({
        userId: currentAdminId,
        rentalId: userToRental.rentalId,
      });
    if (!userToRentalEntity)
      throw new CustomError("Rental not found", 404, "00001");

    const memberToAdmin = await this.userRepository.getOneByCriterias({
      where: { id: userToRental.userId },
    });
    if (!memberToAdmin)
      throw new CustomError("New admin not found", 404, "00001");
    const newAdminToRentalEntity =
      await this.userToRentalRepository.getOneUserToRentalByCriterias({
        userId: memberToAdmin.id,
        rentalId: userToRental.rentalId,
      });
    if (!newAdminToRentalEntity)
      throw new CustomError(
        "New admin must already be a member of the rental",
        400,
        "00003"
      );

    userToRentalEntity.status = UserStatus.member;
    await this.userToRentalRepository.save(userToRentalEntity);

    newAdminToRentalEntity.status = UserStatus.admin;
    return await this.userToRentalRepository.save(newAdminToRentalEntity);
  }

  async deleteUser(id: UserEntity["id"]): Promise<DeleteResult> {
    const isUser = await this.userRepository.getOneByCriterias({
      where: { id },
    });

    if (!isUser) throw new CustomError("User not found", 404, "00001");

    const deletedUser = await this.userRepository.deleteUser(id);

    if (!deletedUser.affected)
      throw new CustomError(
        "An error occured while deleting user",
        500,
        "00007"
      );

    return deletedUser;
  }

  async deleteUserRental(
    userRentalToDelete: UserToRentalDTO
  ): Promise<UpdateResult> {
    const isUser = await this.userRepository.getOneByCriterias({
      where: { id: userRentalToDelete.userId },
    });
    if (!isUser) throw new CustomError("User not found", 404, "00001");

    const deletedUserRental =
      await this.userToRentalRepository.deleteUserRental(
        userRentalToDelete.rentalId
      );

    if (!deletedUserRental.affected)
      throw new CustomError(
        "An error occured while deleting user's rental",
        500,
        "00007"
      );

    return deletedUserRental;
  }

  async removeMemberToRental(
    memberRentalToDelete: UserToRentalDTO
  ): Promise<UpdateResult> {
    const isUser = await this.userRepository.getOneByCriterias({
      where: { id: memberRentalToDelete.userId },
    });
    if (!isUser) throw new CustomError("User not found", 404, "00001");

    const removedMemberRental =
      await this.userToRentalRepository.removeMemberToRental(
        memberRentalToDelete.userId,
        memberRentalToDelete.rentalId
      );

    if (!removedMemberRental.affected)
      throw new CustomError(
        "An error occured while removing member from rental",
        500,
        "000015"
      );

    return removedMemberRental;
  }
}
