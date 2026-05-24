import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/auth-middleware";
import { resumen, exportar } from "../controllers/reporte-controller";

export const reporteRoutes = async (app: FastifyInstance) => {
  app.get("/resumen", { preHandler: authMiddleware }, resumen);
  app.get("/exportar", { preHandler: authMiddleware }, exportar);
};
