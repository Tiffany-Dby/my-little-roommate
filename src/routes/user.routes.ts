import { Router, Express } from "express";
import { UserController } from "../controllers/user.controller";
import jwtMddlwr from "../middlewares/jwtMddlwr.middleware";
import { TokenType } from "../types/Jwt";
import isRentalAdmin from "../middlewares/isRentalAdmin.middleware";

const initUserRoutes = (app: Express) => {
  const userRouter = Router();

  userRouter.post("/register", UserController.registerUser);
  userRouter.post("/login", UserController.loginUser);
  userRouter.post(
    "/:memberId/rental/:rentalId",
    jwtMddlwr(TokenType.access),
    isRentalAdmin,
    UserController.addMemberToRental
  );
  userRouter.patch(
    "/:memberId/rental/:rentalId",
    jwtMddlwr(TokenType.access),
    isRentalAdmin,
    UserController.transferRentalAdmin
  );

  userRouter.get(
    "/refresh-token",
    jwtMddlwr(TokenType.refresh),
    UserController.refreshUserAccessToken
  );
  userRouter.get(
    "/get-me",
    jwtMddlwr(TokenType.access),
    UserController.getUser
  );
  userRouter.get(
    "/:id/rentals",
    jwtMddlwr(TokenType.access),
    UserController.getUserRentalsById
  );

  userRouter.delete(
    "/",
    jwtMddlwr(TokenType.access),
    UserController.deleteUser
  );
  userRouter.delete(
    "/rental/:rentalId",
    jwtMddlwr(TokenType.access),
    isRentalAdmin,
    UserController.deleteUserRental
  );
  userRouter.delete(
    "/:memberId/rental/:rentalId",
    jwtMddlwr(TokenType.access),
    isRentalAdmin,
    UserController.removeMemberToRental
  );

  app.use("/api/users", userRouter);
};

export default initUserRoutes;
