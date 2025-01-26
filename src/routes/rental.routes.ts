import { Router, Express } from "express";
import { RentalController } from "../controllers/rental.controller";
import jwtMddlwr from "../middlewares/jwtMddlwr.middleware";
import { TokenType } from "../types/Jwt";

const initRentalRoutes = (app: Express) => {
  const rentalRouter = Router();

  rentalRouter.post(
    "/",
    jwtMddlwr(TokenType.access),
    RentalController.createRental
  );

  rentalRouter.get("/search", RentalController.getRentalsByCriterias);
  rentalRouter.get(
    "/:id",
    jwtMddlwr(TokenType.access),
    RentalController.getOneById
  );

  app.use("/api/rentals", rentalRouter);
};

export default initRentalRoutes;
