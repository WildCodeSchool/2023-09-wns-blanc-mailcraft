import { DataSource } from "typeorm";
import * as entities from "../entities/export";

export const dataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: Object.values(entities), // Convertit les entités du fichier export en valeurs d'un tableau facilitant les imports
  synchronize: true,
  logging: false,
});
