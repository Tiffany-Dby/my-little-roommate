import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";

const initMiddlewares = (app: Express) => {
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
};

export default initMiddlewares;
