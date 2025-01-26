import { NextFunction, Request, Response } from "express";
import { RentalService } from "../services/rental.service";
import { plainToInstance } from "class-transformer";
import {
  RentalToCreateDTO,
  RentalToFindDTO,
  RentalToGetOneDTO,
} from "../types/rental/dtos";
import { validate } from "class-validator";
import { formatErrorDetails } from "../utils/formatError.utils";
import { CustomError } from "../services/customError.service";
import { RentalPresenter } from "../types/rental/presenters";
import { RentalEntity } from "../databases/mysql/rental.entity";
import { PaginationDTO } from "../types/pagination/dtos";
import { PaginationPresenter } from "../types/pagination/presenters";

const rentalService = new RentalService();

const createRental = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rentalToCreateDTO = plainToInstance(RentalToCreateDTO, req.body, {
      excludeExtraneousValues: true,
    });

    const dtoErrors = await validate(rentalToCreateDTO);
    if (!!dtoErrors.length) {
      const errorDetails = formatErrorDetails(dtoErrors);
      throw new CustomError("Invalid fields", 400, "00003", errorDetails);
    }

    const rental = await rentalService.createRental(req.body);

    const newRental = plainToInstance(RentalPresenter, rental, {
      excludeExtraneousValues: true,
    });

    res
      .status(201)
      .json({ message: "Rental created successfully", rental: newRental });
  } catch (error) {
    next(error);
  }
};

const getRentalsByCriterias = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = {
      filters:
        typeof req.query.filters === "string"
          ? JSON.parse(req.query.filters)
          : req.query.filters,
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
    };

    const rentalToFindDTO = plainToInstance(
      PaginationDTO<RentalToFindDTO>,
      query,
      {
        excludeExtraneousValues: true,
      }
    );

    const dtoErrors = await validate(rentalToFindDTO);
    if (!!dtoErrors.length) {
      const errorDetails = formatErrorDetails(dtoErrors);
      throw new CustomError(
        "Invalid query parameters",
        400,
        "00012",
        errorDetails
      );
    }

    const rentals = await rentalService.getRentalsByCriterias(rentalToFindDTO);

    const rentalsList = plainToInstance(
      PaginationPresenter<RentalPresenter>,
      {
        ...rentals,
        data: rentals.data.map((rental) =>
          plainToInstance(RentalPresenter, rental)
        ),
      },
      {
        excludeExtraneousValues: true,
      }
    );

    res
      .status(200)
      .json({ message: "Rentals found successfully", rentals: rentalsList });
  } catch (error) {
    next(error);
  }
};

const getOneById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const rentalToGetDTO = plainToInstance(
      RentalToGetOneDTO,
      { id },
      { excludeExtraneousValues: true }
    );

    const dtoErrors = await validate(rentalToGetDTO);
    if (!!dtoErrors.length) {
      const errorDetails = formatErrorDetails(dtoErrors);
      throw new CustomError(
        "Invalid query parameters",
        400,
        "00012",
        errorDetails
      );
    }

    const rentalToGet = await rentalService.getOneById({ id });

    const rental = plainToInstance(RentalPresenter, rentalToGet, {
      excludeExtraneousValues: true,
    });

    res.status(200).json({ message: "Rental retrieved successfully", rental });
  } catch (error) {
    next(error);
  }
};

export const RentalController = {
  createRental,
  getRentalsByCriterias,
  getOneById,
};
