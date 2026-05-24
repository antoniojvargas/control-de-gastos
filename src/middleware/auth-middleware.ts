import { FastifyRequest, FastifyReply } from "fastify";
import { AppError } from "../errors/app-error";

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch {
    throw new AppError("No autorizado", 401);
  }
};
