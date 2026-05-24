import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/auth-middleware";
import { crearCategoriaSchema, actualizarCategoriaSchema } from "../schemas/categoria-schemas";
import * as ctrl from "../controllers/categoria-controller";

export const categoriaRoutes = async (app: FastifyInstance) => {
  app.get("/", { preHandler: authMiddleware }, ctrl.listar);

  app.post("/", { preHandler: authMiddleware }, async (req, reply) => {
    crearCategoriaSchema.parse(req.body);
    return ctrl.crear(req, reply);
  });

  app.get("/:id", { preHandler: authMiddleware }, ctrl.obtener);

  app.put("/:id", { preHandler: authMiddleware }, async (req, reply) => {
    actualizarCategoriaSchema.parse(req.body);
    return ctrl.actualizar(req, reply);
  });

  app.delete("/:id", { preHandler: authMiddleware }, ctrl.eliminar);
};
