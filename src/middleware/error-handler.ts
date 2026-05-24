import { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../errors/app-error";

export const errorHandler = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message });
  }

  if (error.name === "ZodError") {
    return reply.status(400).send({ message: "Datos inválidos", details: error.message });
  }

  request.log.error(error);
  return reply.status(500).send({ message: "Error interno del servidor" });
};
