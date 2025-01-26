import { Express } from "express";
import initUserRoutes from "./user.routes";
import initRentalRoutes from "./rental.routes";

const initRoutes = (app: Express) => {
  initUserRoutes(app);
  initRentalRoutes(app);
};

export default initRoutes;
