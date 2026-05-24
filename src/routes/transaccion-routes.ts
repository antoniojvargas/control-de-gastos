import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/auth-middleware";
import { crearTransaccionSchema, actualizarTransaccionSchema } from "../schemas/transaccion-schemas";
import * as ctrl from "../controllers/transaccion-controller";

export const transaccionRoutes = async (app: FastifyInstance) => {
  app.get("/", { preHandler: authMiddleware }, ctrl.listar);

  app.post("/", { preHandler: authMiddleware }, async (req, reply) => {
    crearTransaccionSchema.parse(req.body);
    return ctrl.crear(req, reply);
  });

  app.get("/:id", { preHandler: authMiddleware }, ctrl.obtener);

  app.put("/:id", { preHandler: authMiddleware }, async (req, reply) => {
    actualizarTransaccionSchema.parse(req.body);
    return ctrl.actualizar(req, reply);
  });

  app.delete("/:id", { preHandler: authMiddleware }, ctrl.eliminar);
};
