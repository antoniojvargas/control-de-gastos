import { z } from "zod";

export const crearCategoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  tipo: z.enum(["ingreso", "gasto"]),
  color: z.string().optional(),
  icono: z.string().optional(),
});

export const actualizarCategoriaSchema = crearCategoriaSchema.partial();
