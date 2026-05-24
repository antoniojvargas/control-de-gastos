import { FastifyInstance } from "fastify";
import { registro, login } from "../controllers/auth-controller";
import { registroSchema, loginSchema } from "../schemas/auth-schemas";

export const authRoutes = async (app: FastifyInstance) => {
  app.post("/registro", async (req, reply) => {
    registroSchema.parse(req.body);
    return registro(req, reply);
  });

  app.post("/login", async (req, reply) => {
    loginSchema.parse(req.body);
    return login(req, reply);
  });
};
