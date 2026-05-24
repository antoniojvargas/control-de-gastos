import { useState, useEffect } from "react";
import { api } from "../api/axios-instance";

export interface Presupuesto {
  id: number;
  monto: number;
  mes: number;
  anio: number;
  categoriaId: number;
  categoria: { id: number; nombre: string; color: string };
}

export const usePresupuestos = (mes?: number, anio?: number) => {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPresupuestos = () => {
    setLoading(true);
    api
      .get<Presupuesto[]>("/presupuestos", { params: { mes, anio } })
      .then((res) => setPresupuestos(res.data))
      .catch(() => setError("Error al cargar presupuestos"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPresupuestos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mes, anio]);

  return { presupuestos, loading, error, refetch: fetchPresupuestos };
};
