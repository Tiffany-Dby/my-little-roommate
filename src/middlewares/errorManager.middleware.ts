import { NextFunction, Request, Response } from "express";
import { CustomError } from "../services/customError.service";

export const errorManager = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      errorCode: err.errorCode,
      message: err.message,
      details: err.details,
    });
  }

  res.status(500).json({
    message: "Internal server error",
    details: err.stack,
  });
};
