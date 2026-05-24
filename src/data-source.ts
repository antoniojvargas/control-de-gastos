import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "./entities/usuario";
import { Categoria } from "./entities/categoria";
import { Transaccion } from "./entities/transaccion";
import { Presupuesto } from "./entities/presupuesto";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.NODE_ENV === "development",
  logging: false,
  entities: [Usuario, Categoria, Transaccion, Presupuesto],
});
