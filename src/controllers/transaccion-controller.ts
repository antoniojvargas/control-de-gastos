import { FastifyRequest, FastifyReply } from "fastify";
import * as transaccionService from "../services/transaccion-service";

type JwtUser = { id: number; email: string };
const userId = (req: FastifyRequest) => (req.user as JwtUser).id;

export const listar = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const filtros = req.query as { mes?: string; anio?: string; tipo?: string; categoriaId?: string };
    const transacciones = await transaccionService.listarTransacciones(userId(req), {
      mes: filtros.mes ? Number(filtros.mes) : undefined,
      anio: filtros.anio ? Number(filtros.anio) : undefined,
      tipo: filtros.tipo as "ingreso" | "gasto" | undefined,
      categoriaId: filtros.categoriaId ? Number(filtros.categoriaId) : undefined,
    });
    reply.send(transacciones);
  } catch (error) {
    throw error;
  }
};

export const crear = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = req.body as { monto: number; descripcion?: string; fecha: string; tipo: "ingreso" | "gasto"; categoriaId: number };
    const transaccion = await transaccionService.crearTransaccion(data, userId(req));
    reply.status(201).send(transaccion);
  } catch (error) {
    throw error;
  }
};

export const obtener = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const transaccion = await transaccionService.obtenerTransaccion(Number(id), userId(req));
    reply.send(transaccion);
  } catch (error) {
    throw error;
  }
};

export const actualizar = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const data = req.body as Partial<{ monto: number; descripcion: string; fecha: string; tipo: "ingreso" | "gasto"; categoriaId: number }>;
    const transaccion = await transaccionService.actualizarTransaccion(Number(id), data, userId(req));
    reply.send(transaccion);
  } catch (error) {
    throw error;
  }
};

export const eliminar = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    await transaccionService.eliminarTransaccion(Number(id), userId(req));
    reply.status(204).send();
  } catch (error) {
    throw error;
  }
};
