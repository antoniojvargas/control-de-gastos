import { useState, useEffect } from "react";
import { api } from "../api/axios-instance";

export interface Transaccion {
  id: number;
  monto: number;
  descripcion: string;
  fecha: string;
  tipo: "ingreso" | "gasto";
  categoriaId: number;
  categoria: { id: number; nombre: string; color: string };
}

interface Filtros {
  mes?: number;
  anio?: number;
  tipo?: "ingreso" | "gasto";
  categoriaId?: number;
}

export const useTransacciones = (filtros?: Filtros) => {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransacciones = () => {
    setLoading(true);
    api
      .get<Transaccion[]>("/transacciones", { params: filtros })
      .then((res) => setTransacciones(res.data))
      .catch(() => setError("Error al cargar transacciones"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransacciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filtros)]);

  return { transacciones, loading, error, refetch: fetchTransacciones };
};
