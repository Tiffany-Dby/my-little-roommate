import { NextFunction, Request, Response } from "express";
import { jwtVerify } from "../utils/jwt.utils";
import { CustomError } from "../services/customError.service";
import { TokenType } from "../types/Jwt";

const jwtMddlwr =
  (tokenType: TokenType) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.headers.authorization?.split(" ")[
        req.headers.authorization?.split(" ").length - 1
      ];

    if (!token)
      throw new CustomError("Unauthorized: no token provided", 401, "00006");

    const user = jwtVerify(tokenType, token);

    if (!user)
      throw new CustomError("Unauthorized: invalid token", 401, "00006");

    req.body.userId =
      typeof user === "string" || typeof user === "number" ? user : user.id;

    next();
  };

export default jwtMddlwr;
