import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import {
  UserToCreateDTO,
  UserToDeleteDTO,
  UserToGetRentalsDTO,
  UserToLoginDTO,
  UserToRefreshAccessTokenDTO,
} from "../types/user/dtos";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import {
  UserLoginPresenter,
  UserPresenter,
  UserToGetRentalsPresenter,
  UserToRefreshAccessTokenPresenter,
} from "../types/user/presenters";
import { CustomError } from "../services/customError.service";
import { formatErrorDetails } from "../utils/formatError.utils";
import { UserToRentalDTO } from "../types/userToRental/dtos";
import { UserToRentalPresenter } from "../types/userToRental/presenters";

const userService = new UserService();

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userToCreateDTO = plainToInstance(UserToCreateDTO, req.body, {
      excludeExtraneousValues: true,
    });

    const dtoErrors = await validate(userToCreateDTO);
    if (!!dtoErrors.length) {
      const errorDetails = formatErrorDetails(dtoErrors);
      throw new CustomError("Invalid fields", 400, "00003", errorDetails);
    }

    const user = await userService.registerUser(req.body);
    // appeler le logger service pour enregistrer QUI a créer un utilisateur (peut être un admin ou l'utilisateur lui même (?)

    const newUser = plainToInstance(UserPresenter, user, {
      excludeExtraneousValues: true,
    });

    res
      .status(201)
      .json({ message: "New user successfully created", user: newUser });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userToLoginDTO = plainToInstance(UserToLoginDTO, req.body, {
      excludeExtraneousValues: true,
    });

    const dtoErrors = await validate(userToLoginDTO);
    if (!!dtoErrors.length) {
      const errorDetails = formatErrorDetails(dtoErrors);
      throw new CustomError("Invalid fields", 400, "00003", errorDetails);
    }

    const user = await userService.loginUser(req.body);

    const userLoggedIn = plainToInstance(UserLoginPresenter, user, {
      excludeExtraneousValues: true,
    });

    res
      .status(200)
      .json({ message: "User logged in successfully", user: userLoggedIn });
  } catch (error) {
    next(error);
  }
};

const addMemberToRental = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { memberId, rentalId } = req.params;

    const addMemberToRentalDTO = plainToInstance(
      UserToRentalDTO,
      { userId: Number(memberId), rentalId: Number(rentalId) },
      { excludeExtraneousValues: true }
    );

    const dtoErrors = await validate(addMemberToRentalDTO);
    if (!!dtoErrors.length) {
      const errorDetails = formatErrorDetails(dtoErrors);
      throw new CustomError("Invalid fields", 400, "00003", errorDetails);
    }

    const memberToRental = await userService.addMemberToRental(
      addMemberToRentalDTO
    );

    const member = plainToInstance(UserToRentalPresenter, memberToRental, {
      excludeExtraneousValues: true,
    });

    res
      .status(201)
      .json({ message: "Member added to the rental successfully", member });
  } catch (error) {
    next(error);
  }
};

const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.body;
    const userToGet = await userService.getUser(userId);
    const user = plainToInstance(UserPresenter, userToGet, {
      excludeExtraneousValues: true,
    });

    res.status(200).json({ message: "User retrieved successfully", user });
  } catch (error) {
    next(error);
  }
};

const refreshUserAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.body;
    const refreshToken =
      req.headers.authorization?.split(" ")[
        req.headers.authorization?.split(" ").length - 1
      ];

    const userToRefresh = plainToInstance(
      UserToRefreshAccessTokenDTO,
      { userId, refreshToken },
      { excludeExtraneousValues: true }
    );

    const dtoErrors = await validate(userToRefresh);
    if (!!dtoErrors.length) {
      const errorDetails = formatErrorDetails(dtoErrors);
      throw new CustomError("Invalid fields", 400, "00003", errorDetails);
    }

    const userWithNewtoken = await userService.refreshUserAccessToken(
      userToRefresh
    );

    const user = plainToInstance(
      UserToRefreshAccessTokenPresenter,
      userWithNewtoken,
      { excludeExtraneousValues: true }
    );

    res.status(200).json({
      message: "User's token refreshed successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const getUserRentalsById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const userToGetRentalsDTO = plainToInstance(
      UserToGetRentalsDTO,
      { id: Number(id) },
      { excludeExtraneousValues: true }
    );

    const dtoErrors = await validate(userToGetRentalsDTO);
    if (!!dtoErrors.length) {
      const errorDetails = formatErrorDetails(dtoErrors);
      throw new CustomError(
        "Invalid query parameters",
        400,
        "000012",
        errorDetails
      );
    }

    const userToGet = await userService.getUserRentalsById(userToGetRentalsDTO);

    const user = plainToInstance(UserToGetRentalsPresenter, userToGet, {
      excludeExtraneousValues: true,
    });

    res.status(200).json({
      message: "User with associated rentals retrieved successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const transferRentalAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { memberId, rentalId } = req.params;
    const { userId } = req.body;

    const userToTransferRentalDTO = plainToInstance(
      UserToRentalDTO,
      { userId: Number(memberId), rentalId: Number(rentalId) },
      { excludeExtraneousValues: true }
    );

    const dtoErrors = await validate(userToTransferRentalDTO);
    if (!!dtoErrors.length) {
      const errorDetails = formatErrorDetails(dtoErrors);
      throw new CustomError(
        "Invalid query parameters",
        400,
        "000012",
        errorDetails
      );
    }

    const transferedAdmin = await userService.transferRentalAdmin(
      userToTransferRentalDTO,
      userId
    );

    const newAdmin = plainToInstance(UserToRentalPresenter, transferedAdmin, {
      excludeExtraneousValues: true,
    });

    res
      .status(200)
      .json({ message: "Admin transfered successfully", user: newAdmin });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userToDeleteDTO = plainToInstance(UserToDeleteDTO, req.body, {
      excludeExtraneousValues: true,
    });

    const dtoErrors = await validate(userToDeleteDTO);
    if (!!dtoErrors.length) {
      const errorDetails = formatErrorDetails(dtoErrors);
      throw new CustomError("Invalid fields", 400, "00003", errorDetails);
    }

    await userService.deleteUser(req.body.id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteUserRental = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { rentalId } = req.params;
    const { userId } = req.body;

    const userRentalToDeleteDTO = plainToInstance(
      UserToRentalDTO,
      { userId: Number(userId), rentalId: Number(rentalId) },
      { excludeExtraneousValues: true }
    );

    const dtoErrors = await validate(userRentalToDeleteDTO);
    if (!!dtoErrors.length) {
      const errorDetails = formatErrorDetails(dtoErrors);
      throw new CustomError("Invalid fields", 400, "00003", errorDetails);
    }

    await userService.deleteUserRental(userRentalToDeleteDTO);

    res
      .status(200)
      .json({ message: "User's associated rental deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const removeMemberToRental = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { memberId, rentalId } = req.params;

    const memberRentalToDeleteDTO = plainToInstance(
      UserToRentalDTO,
      { userId: Number(memberId), rentalId: Number(rentalId) },
      { excludeExtraneousValues: true }
    );

    const dtoErrors = await validate(memberRentalToDeleteDTO);
    if (!!dtoErrors.length) {
      const errorDetails = formatErrorDetails(dtoErrors);
      throw new CustomError("Invalid fields", 400, "00003", errorDetails);
    }

    await userService.removeMemberToRental(memberRentalToDeleteDTO);

    res
      .status(200)
      .json({ message: "Member removed from rental successfully" });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  registerUser,
  loginUser,
  addMemberToRental,
  transferRentalAdmin,
  getUser,
  refreshUserAccessToken,
  getUserRentalsById,
  deleteUser,
  deleteUserRental,
  removeMemberToRental,
};
