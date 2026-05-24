import "reflect-metadata";
import Fastify from "fastify";
import fjwt from "@fastify/jwt";
import cors from "@fastify/cors";
import { AppDataSource } from "./data-source";
import { errorHandler } from "./middleware/error-handler";
import { authRoutes } from "./routes/auth-routes";
import { categoriaRoutes } from "./routes/categoria-routes";
import { transaccionRoutes } from "./routes/transaccion-routes";
import { presupuestoRoutes } from "./routes/presupuesto-routes";
import { reporteRoutes } from "./routes/reporte-routes";

const app = Fastify({ logger: true });

const start = async () => {
  await app.register(cors, { origin: "http://localhost:5173" });
  await app.register(fjwt, { secret: process.env.JWT_SECRET! });

  app.setErrorHandler(errorHandler);

  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(categoriaRoutes, { prefix: "/api/categorias" });
  await app.register(transaccionRoutes, { prefix: "/api/transacciones" });
  await app.register(presupuestoRoutes, { prefix: "/api/presupuestos" });
  await app.register(reporteRoutes, { prefix: "/api/reportes" });

  await AppDataSource.initialize();
  await app.listen({ port: Number(process.env.PORT ?? 3000), host: "0.0.0.0" });
};

start();
