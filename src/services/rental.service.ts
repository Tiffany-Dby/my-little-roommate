import { RentalEntity } from "../databases/mysql/rental.entity";
import { RentalRepository } from "../repositories/rental.repository";
import { UserRepository } from "../repositories/user.repository";
import { UserToRentalRepository } from "../repositories/userToRental.repository";
import { PaginationDTO } from "../types/pagination/dtos";
import { PaginationPresenter } from "../types/pagination/presenters";
import {
  RentalToCreateDTO,
  RentalToFindDTO,
  RentalToGetOneDTO,
} from "../types/rental/dtos";
import { RentalToGetOneInput } from "../types/rental/inputs";
import { RentalPresenter } from "../types/rental/presenters";
import { UserStatus } from "../types/user/UserStatus";
import { CustomError } from "./customError.service";

export class RentalService {
  private rentalRepository = new RentalRepository();
  private userRepositoty = new UserRepository();
  private userToRentalRepository = new UserToRentalRepository();

  async createRental(rentalToCreate: RentalToCreateDTO): Promise<RentalEntity> {
    const user = await this.userRepositoty.getOneByCriterias({
      where: { id: rentalToCreate.userId },
    });
    if (!user) throw new CustomError("User not found", 404, "00001");

    const userToRental = this.userToRentalRepository.create({
      user,
      status: UserStatus.admin,
    });
    await this.userToRentalRepository.save(userToRental);

    const createdRental = this.rentalRepository.create({
      ...rentalToCreate,
      users: [userToRental],
    });

    return await this.rentalRepository.save(createdRental);
  }

  async getRentalsByCriterias(
    criterias: PaginationDTO<RentalToFindDTO>
  ): Promise<PaginationPresenter<RentalPresenter>> {
    const { data, count } = await this.rentalRepository.getRentalsByCriterias(
      criterias
    );

    return { data, page: criterias.page, limit: criterias.limit, count };
  }

  async getOneById(
    rentalToGet: RentalToGetOneDTO
  ): Promise<RentalPresenter | null> {
    const rentalToGetOneInput: RentalToGetOneInput = {
      id: Number(rentalToGet.id),
    };
    return await this.rentalRepository.getOneById(rentalToGetOneInput);
  }
}
