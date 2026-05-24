import { useState, useEffect } from "react";
import { api } from "../api/axios-instance";

export interface PresupuestoResumen {
  id: number;
  categoriaId: number;
  nombre: string;
  color: string;
  monto: number;
  gastado: number;
  porcentaje: number;
}

export interface Resumen {
  totalIngresos: number;
  totalGastos: number;
  balance: number;
  presupuestos: PresupuestoResumen[];
}

export const useReporte = (mes: number, anio: number) => {
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get<Resumen>("/reportes/resumen", { params: { mes, anio } })
      .then((res) => setResumen(res.data))
      .catch(() => setError("Error al cargar el reporte"))
      .finally(() => setLoading(false));
  }, [mes, anio]);

  return { resumen, loading, error };
};
