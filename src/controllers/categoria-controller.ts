import { FastifyRequest, FastifyReply } from "fastify";
import * as categoriaService from "../services/categoria-service";

type JwtUser = { id: number; email: string };
const userId = (req: FastifyRequest) => (req.user as JwtUser).id;

export const listar = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const categorias = await categoriaService.listarCategorias(userId(req));
    reply.send(categorias);
  } catch (error) {
    throw error;
  }
};

export const crear = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = req.body as { nombre: string; tipo: "ingreso" | "gasto"; color?: string; icono?: string };
    const categoria = await categoriaService.crearCategoria(data, userId(req));
    reply.status(201).send(categoria);
  } catch (error) {
    throw error;
  }
};

export const obtener = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const categoria = await categoriaService.obtenerCategoria(Number(id), userId(req));
    reply.send(categoria);
  } catch (error) {
    throw error;
  }
};

export const actualizar = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const data = req.body as Partial<{ nombre: string; tipo: "ingreso" | "gasto"; color: string; icono: string }>;
    const categoria = await categoriaService.actualizarCategoria(Number(id), data, userId(req));
    reply.send(categoria);
  } catch (error) {
    throw error;
  }
};

export const eliminar = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    await categoriaService.eliminarCategoria(Number(id), userId(req));
    reply.status(204).send();
  } catch (error) {
    throw error;
  }
};
