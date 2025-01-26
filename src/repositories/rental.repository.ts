import { Repository } from "typeorm";
import { RentalEntity } from "../databases/mysql/rental.entity";
import { connectMySQLDB } from "../configs/databases/mysql.config";
import {
  RentalsToFindInput,
  RentalToCreateInput,
  RentalToGetOneInput,
} from "../types/rental/inputs";
import { RentalToFindDTO, RentalToGetOneDTO } from "../types/rental/dtos";
import { PaginationDTO } from "../types/pagination/dtos";

export class RentalRepository {
  private rentalDB: Repository<RentalEntity>;

  constructor() {
    this.rentalDB = connectMySQLDB.getRepository(RentalEntity);
  }

  create(rental: RentalToCreateInput): RentalEntity {
    const newRental = new RentalEntity();
    newRental.street = rental.street;
    newRental.number = rental.number;
    newRental.city = rental.city;
    newRental.zipcode = rental.zipcode;
    newRental.roomsCount = rental.roomsCount;
    newRental.surface = rental.surface;
    newRental.agency = rental.agency;
    newRental.users = rental.users;

    return newRental;
  }

  async save(rental: RentalEntity): Promise<RentalEntity> {
    return await this.rentalDB.save(rental);
  }

  async getRentalsByCriterias(
    criterias: PaginationDTO<RentalToFindDTO>
  ): Promise<RentalsToFindInput> {
    const [data, count] = await this.rentalDB.findAndCount({
      where: criterias.filters,
      skip: ((criterias.page ?? 1) - 1) * (criterias.limit ?? 10),
      take: criterias.limit,
    });

    return { data, count };
  }

  async getOneById(id: RentalToGetOneInput) {
    return await this.rentalDB.findOne({
      where: id,
      relations: ["users", "users.user"],
    });
  }
}
