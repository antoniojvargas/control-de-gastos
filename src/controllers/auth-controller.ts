import { FastifyRequest, FastifyReply } from "fastify";
import { registrarUsuario, loginUsuario } from "../services/auth-service";

export const registro = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password, nombre } = request.body as { email: string; password: string; nombre: string };
    const usuario = await registrarUsuario(email, password, nombre);
    reply.status(201).send({ id: usuario.id, email: usuario.email, nombre: usuario.nombre });
  } catch (error) {
    throw error;
  }
};

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password } = request.body as { email: string; password: string };
    const usuario = await loginUsuario(email, password);
    const token = await reply.jwtSign({ id: usuario.id, email: usuario.email });
    reply.send({ token, usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre } });
  } catch (error) {
    throw error;
  }
};
