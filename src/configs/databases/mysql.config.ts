import { DataSource } from "typeorm";

export const connectMySQLDB = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "8889"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Attention : activez uniquement en développement
  logging: ["query", "error"],
  entities: ["src/databases/mysql/*.ts"], // Entités de votre projet
  migrations: ["src/migrations/**/*.ts"], // Scripts de migration
});
