import { hash, compare } from "bcrypt";

const saltRounds = 10;

const hashPass = async (password: string) => await hash(password, saltRounds);

const compareHash = async (password: string, passHashed: string) =>
  await compare(password, passHashed);

export { hashPass, compareHash };
