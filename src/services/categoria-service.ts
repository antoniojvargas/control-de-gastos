import { AppDataSource } from "../data-source";
import { Categoria } from "../entities/categoria";
import { AppError } from "../errors/app-error";

const repo = () => AppDataSource.getRepository(Categoria);

export const listarCategorias = async (usuarioId: number) => {
  return repo().findBy({ usuarioId });
};

export const crearCategoria = async (
  data: { nombre: string; tipo: "ingreso" | "gasto"; color?: string; icono?: string },
  usuarioId: number
) => {
  const categoria = repo().create({ ...data, usuarioId });
  return repo().save(categoria);
};

export const obtenerCategoria = async (id: number, usuarioId: number) => {
  const categoria = await repo().findOneBy({ id, usuarioId });
  if (!categoria) throw new AppError("Categoría no encontrada", 404);
  return categoria;
};

export const actualizarCategoria = async (
  id: number,
  data: Partial<{ nombre: string; tipo: "ingreso" | "gasto"; color: string; icono: string }>,
  usuarioId: number
) => {
  const categoria = await obtenerCategoria(id, usuarioId);
  Object.assign(categoria, data);
  return repo().save(categoria);
};

export const eliminarCategoria = async (id: number, usuarioId: number) => {
  const categoria = await obtenerCategoria(id, usuarioId);
  return repo().remove(categoria);
};
