import { AppDataSource } from "../data-source";
import { Presupuesto } from "../entities/presupuesto";
import { AppError } from "../errors/app-error";

const repo = () => AppDataSource.getRepository(Presupuesto);

export const listarPresupuestos = async (usuarioId: number, mes?: number, anio?: number) => {
  const where: Record<string, unknown> = { usuarioId };
  if (mes) where.mes = mes;
  if (anio) where.anio = anio;
  return repo().find({ where, relations: ["categoria"] });
};

export const crearPresupuesto = async (
  data: { monto: number; mes: number; anio: number; categoriaId: number },
  usuarioId: number
) => {
  const presupuesto = repo().create({ ...data, usuarioId });
  return repo().save(presupuesto);
};

export const obtenerPresupuesto = async (id: number, usuarioId: number) => {
  const presupuesto = await repo().findOne({ where: { id, usuarioId }, relations: ["categoria"] });
  if (!presupuesto) throw new AppError("Presupuesto no encontrado", 404);
  return presupuesto;
};

export const actualizarPresupuesto = async (
  id: number,
  data: Partial<{ monto: number; mes: number; anio: number; categoriaId: number }>,
  usuarioId: number
) => {
  const presupuesto = await obtenerPresupuesto(id, usuarioId);
  Object.assign(presupuesto, data);
  return repo().save(presupuesto);
};

export const eliminarPresupuesto = async (id: number, usuarioId: number) => {
  const presupuesto = await obtenerPresupuesto(id, usuarioId);
  return repo().remove(presupuesto);
};
