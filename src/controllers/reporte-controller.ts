import { FastifyRequest, FastifyReply } from "fastify";
import { resumenMensual, exportarCSV } from "../services/reporte-service";
import { AppError } from "../errors/app-error";

type JwtUser = { id: number; email: string };
const userId = (req: FastifyRequest) => (req.user as JwtUser).id;

export const resumen = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { mes, anio } = req.query as { mes?: string; anio?: string };
    if (!mes || !anio) throw new AppError("Los parámetros mes y anio son requeridos", 400);

    const data = await resumenMensual(userId(req), Number(mes), Number(anio));
    reply.send(data);
  } catch (error) {
    throw error;
  }
};

export const exportar = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { mes, anio, tipo } = req.query as { mes?: string; anio?: string; tipo?: string };
    if (!mes || !anio) throw new AppError("Los parámetros mes y anio son requeridos", 400);

    const csv = await exportarCSV(
      userId(req),
      Number(mes),
      Number(anio),
      tipo as "ingreso" | "gasto" | undefined
    );

    reply
      .header("Content-Type", "text/csv")
      .header("Content-Disposition", `attachment; filename="reporte-${mes}-${anio}.csv"`)
      .send(csv);
  } catch (error) {
    throw error;
  }
};
