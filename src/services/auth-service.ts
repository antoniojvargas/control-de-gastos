import bcrypt from "bcryptjs";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/usuario";
import { AppError } from "../errors/app-error";

const repo = () => AppDataSource.getRepository(Usuario);

export const registrarUsuario = async (email: string, password: string, nombre: string) => {
  const existe = await repo().findOneBy({ email });
  if (existe) throw new AppError("Email ya registrado", 409);

  const hash = await bcrypt.hash(password, 10);
  const usuario = repo().create({ email, password: hash, nombre });
  return repo().save(usuario);
};

export const loginUsuario = async (email: string, password: string) => {
  const usuario = await repo().findOneBy({ email });
  if (!usuario) throw new AppError("Credenciales inválidas", 401);

  const valido = await bcrypt.compare(password, usuario.password);
  if (!valido) throw new AppError("Credenciales inválidas", 401);

  return usuario;
};
