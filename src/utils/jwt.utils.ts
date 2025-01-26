import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenType } from "../types/Jwt";

const JWT_OPTIONS = { expiresIn: process.env.JWT_DURATION ?? "7d" };
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_SECRET = process.env.JWT_SECRET;

const jwtVerify = (
  tokenType: TokenType,
  token: string
): string | JwtPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      (tokenType === TokenType.access
        ? JWT_ACCESS_SECRET
        : JWT_REFRESH_SECRET) ?? ""
    );

    return typeof decoded !== "string" ? decoded.data : decoded;
  } catch (err) {
    console.error(
      `jwt.utils.js - jwtVerify - error => `,
      err instanceof Error ? err.message : "Error while verifying token"
    );
    return null;
  }
};

const jwtSign = (
  data: unknown,
  secret: string,
  opts: Record<string, string> = JWT_OPTIONS
) => jwt.sign({ data }, secret, opts);

export { jwtVerify, jwtSign };
