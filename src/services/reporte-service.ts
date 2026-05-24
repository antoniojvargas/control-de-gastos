import { Between } from "typeorm";
import { stringify } from "csv-stringify/sync";
import { AppDataSource } from "../data-source";
import { Transaccion } from "../entities/transaccion";
import { Presupuesto } from "../entities/presupuesto";

const transaccionRepo = () => AppDataSource.getRepository(Transaccion);
const presupuestoRepo = () => AppDataSource.getRepository(Presupuesto);

const rangoFecha = (mes: number, anio: number) => {
  const m = String(mes).padStart(2, "0");
  return { inicio: `${anio}-${m}-01`, fin: `${anio}-${m}-31` };
};

export const resumenMensual = async (usuarioId: number, mes: number, anio: number) => {
  const { inicio, fin } = rangoFecha(mes, anio);

  const transacciones = await transaccionRepo().find({
    where: { usuarioId, fecha: Between(inicio, fin) },
    relations: ["categoria"],
  });

  const totalIngresos = transacciones
    .filter((t) => t.tipo === "ingreso")
    .reduce((sum, t) => sum + Number(t.monto), 0);

  const totalGastos = transacciones
    .filter((t) => t.tipo === "gasto")
    .reduce((sum, t) => sum + Number(t.monto), 0);

  const presupuestos = await presupuestoRepo().find({
    where: { usuarioId, mes, anio },
    relations: ["categoria"],
  });

  const presupuestosConGasto = presupuestos.map((p) => {
    const gastado = transacciones
      .filter((t) => t.tipo === "gasto" && t.categoriaId === p.categoriaId)
      .reduce((sum, t) => sum + Number(t.monto), 0);
    const porcentaje = p.monto > 0 ? Math.round((gastado / Number(p.monto)) * 100) : 0;
    return {
      id: p.id,
      categoriaId: p.categoriaId,
      nombre: p.categoria?.nombre ?? "",
      color: p.categoria?.color ?? "",
      monto: Number(p.monto),
      gastado,
      porcentaje,
    };
  });

  return {
    totalIngresos,
    totalGastos,
    balance: totalIngresos - totalGastos,
    presupuestos: presupuestosConGasto,
  };
};

export const exportarCSV = async (
  usuarioId: number,
  mes: number,
  anio: number,
  tipo?: "ingreso" | "gasto"
) => {
  const { inicio, fin } = rangoFecha(mes, anio);
  const where: Record<string, unknown> = { usuarioId, fecha: Between(inicio, fin) };
  if (tipo) where.tipo = tipo;

  const transacciones = await transaccionRepo().find({
    where,
    relations: ["categoria"],
    order: { fecha: "ASC" },
  });

  const filas = transacciones.map((t) => ({
    id: t.id,
    fecha: t.fecha,
    tipo: t.tipo,
    categoria: t.categoria?.nombre ?? "",
    descripcion: t.descripcion ?? "",
    monto: Number(t.monto),
  }));

  return stringify(filas, {
    header: true,
    columns: ["id", "fecha", "tipo", "categoria", "descripcion", "monto"],
  });
};
