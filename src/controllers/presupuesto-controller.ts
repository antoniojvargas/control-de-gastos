import { FastifyRequest, FastifyReply } from "fastify";
import * as presupuestoService from "../services/presupuesto-service";

type JwtUser = { id: number; email: string };
const userId = (req: FastifyRequest) => (req.user as JwtUser).id;

export const listar = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { mes, anio } = req.query as { mes?: string; anio?: string };
    const presupuestos = await presupuestoService.listarPresupuestos(
      userId(req),
      mes ? Number(mes) : undefined,
      anio ? Number(anio) : undefined
    );
    reply.send(presupuestos);
  } catch (error) {
    throw error;
  }
};

export const crear = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = req.body as { monto: number; mes: number; anio: number; categoriaId: number };
    const presupuesto = await presupuestoService.crearPresupuesto(data, userId(req));
    reply.status(201).send(presupuesto);
  } catch (error) {
    throw error;
  }
};

export const obtener = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const presupuesto = await presupuestoService.obtenerPresupuesto(Number(id), userId(req));
    reply.send(presupuesto);
  } catch (error) {
    throw error;
  }
};

export const actualizar = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const data = req.body as Partial<{ monto: number; mes: number; anio: number; categoriaId: number }>;
    const presupuesto = await presupuestoService.actualizarPresupuesto(Number(id), data, userId(req));
    reply.send(presupuesto);
  } catch (error) {
    throw error;
  }
};

export const eliminar = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    await presupuestoService.eliminarPresupuesto(Number(id), userId(req));
    reply.status(204).send();
  } catch (error) {
    throw error;
  }
};
