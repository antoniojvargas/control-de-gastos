import { z } from "zod";

export const crearTransaccionSchema = z.object({
  monto: z.number().positive("El monto debe ser positivo"),
  descripcion: z.string().optional(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  tipo: z.enum(["ingreso", "gasto"]),
  categoriaId: z.number().int().positive(),
});

export const actualizarTransaccionSchema = crearTransaccionSchema.partial();

export const filtrosTransaccionSchema = z.object({
  mes: z.coerce.number().min(1).max(12).optional(),
  anio: z.coerce.number().min(2000).optional(),
  tipo: z.enum(["ingreso", "gasto"]).optional(),
  categoriaId: z.coerce.number().optional(),
});
