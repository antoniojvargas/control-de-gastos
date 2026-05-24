import { useState, useEffect } from "react";
import { api } from "../api/axios-instance";

export interface Categoria {
  id: number;
  nombre: string;
  tipo: "ingreso" | "gasto";
  color: string;
  icono: string;
}

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = () => {
    setLoading(true);
    api
      .get<Categoria[]>("/categorias")
      .then((res) => setCategorias(res.data))
      .catch(() => setError("Error al cargar categorías"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return { categorias, loading, error, refetch: fetchCategorias };
};
