import { NextFunction, Request, Response } from "express";
import { UserToRentalRepository } from "../repositories/userToRental.repository";
import { CustomError } from "../services/customError.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { formatErrorDetails } from "../utils/formatError.utils";
import { UserToRentalDTO } from "../types/userToRental/dtos";

const isRentalAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const { rentalId } = req.params;
    console.log("userId", userId);

    const criterias = { userId: Number(userId), rentalId: Number(rentalId) };
    const userToRentalDTO = plainToInstance(UserToRentalDTO, criterias, {
      excludeExtraneousValues: true,
    });

    const dtoErrors = await validate(userToRentalDTO);
    if (!!dtoErrors.length) {
      const errorDetails = formatErrorDetails(dtoErrors);
      throw new CustomError("Invalid fields", 400, "00003", errorDetails);
    }

    const userToRentalRepository = new UserToRentalRepository();
    const userToRental =
      await userToRentalRepository.getOneUserToRentalByCriterias(
        userToRentalDTO
      );

    if (!userToRental)
      throw new CustomError("User on this rental not found", 404, "00001");

    if (userToRental.status !== "admin")
      throw new CustomError(
        "Forbidden: you must be the admin of the rental to perform this action",
        403,
        "00001"
      );

    next();
  } catch (error) {
    next(error);
  }
};

export default isRentalAdmin;
