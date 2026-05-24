import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/auth-middleware";
import { crearPresupuestoSchema, actualizarPresupuestoSchema } from "../schemas/presupuesto-schemas";
import * as ctrl from "../controllers/presupuesto-controller";

export const presupuestoRoutes = async (app: FastifyInstance) => {
  app.get("/", { preHandler: authMiddleware }, ctrl.listar);

  app.post("/", { preHandler: authMiddleware }, async (req, reply) => {
    crearPresupuestoSchema.parse(req.body);
    return ctrl.crear(req, reply);
  });

  app.get("/:id", { preHandler: authMiddleware }, ctrl.obtener);

  app.put("/:id", { preHandler: authMiddleware }, async (req, reply) => {
    actualizarPresupuestoSchema.parse(req.body);
    return ctrl.actualizar(req, reply);
  });

  app.delete("/:id", { preHandler: authMiddleware }, ctrl.eliminar);
};
