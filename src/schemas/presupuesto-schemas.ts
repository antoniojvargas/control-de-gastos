import { z } from "zod";

export const crearPresupuestoSchema = z.object({
  monto: z.number().positive("El monto debe ser positivo"),
  mes: z.number().int().min(1).max(12),
  anio: z.number().int().min(2000),
  categoriaId: z.number().int().positive(),
});

export const actualizarPresupuestoSchema = crearPresupuestoSchema.partial();

export const filtrosPresupuestoSchema = z.object({
  mes: z.coerce.number().min(1).max(12).optional(),
  anio: z.coerce.number().min(2000).optional(),
});
