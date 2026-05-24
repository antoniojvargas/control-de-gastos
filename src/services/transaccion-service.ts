import { Between, FindOptionsWhere } from "typeorm";
import { AppDataSource } from "../data-source";
import { Transaccion } from "../entities/transaccion";
import { AppError } from "../errors/app-error";

const repo = () => AppDataSource.getRepository(Transaccion);

interface FiltrosTransaccion {
  mes?: number;
  anio?: number;
  tipo?: "ingreso" | "gasto";
  categoriaId?: number;
}

export const listarTransacciones = async (usuarioId: number, filtros: FiltrosTransaccion) => {
  const where: FindOptionsWhere<Transaccion> = { usuarioId };

  if (filtros.tipo) where.tipo = filtros.tipo;
  if (filtros.categoriaId) where.categoriaId = filtros.categoriaId;
  if (filtros.mes && filtros.anio) {
    const mes = String(filtros.mes).padStart(2, "0");
    const inicio = `${filtros.anio}-${mes}-01`;
    const fin = `${filtros.anio}-${mes}-31`;
    where.fecha = Between(inicio, fin);
  }

  return repo().find({ where, relations: ["categoria"], order: { fecha: "DESC" } });
};

export const crearTransaccion = async (
  data: { monto: number; descripcion?: string; fecha: string; tipo: "ingreso" | "gasto"; categoriaId: number },
  usuarioId: number
) => {
  const transaccion = repo().create({ ...data, usuarioId });
  return repo().save(transaccion);
};

export const obtenerTransaccion = async (id: number, usuarioId: number) => {
  const transaccion = await repo().findOne({ where: { id, usuarioId }, relations: ["categoria"] });
  if (!transaccion) throw new AppError("Transacción no encontrada", 404);
  return transaccion;
};

export const actualizarTransaccion = async (
  id: number,
  data: Partial<{ monto: number; descripcion: string; fecha: string; tipo: "ingreso" | "gasto"; categoriaId: number }>,
  usuarioId: number
) => {
  const transaccion = await obtenerTransaccion(id, usuarioId);
  Object.assign(transaccion, data);
  return repo().save(transaccion);
};

export const eliminarTransaccion = async (id: number, usuarioId: number) => {
  const transaccion = await obtenerTransaccion(id, usuarioId);
  return repo().remove(transaccion);
};
