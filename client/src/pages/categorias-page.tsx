import { useState } from "react";
import { useCategorias } from "../hooks/use-categorias";
import { CategoriaForm } from "../components/categorias/categoria-form";
import { LoadingSpinner } from "../components/ui/loading-spinner";
import { ErrorMessage } from "../components/ui/error-message";
import { api } from "../api/axios-instance";

export const CategoriasPage = () => {
  const { categorias, loading, error, refetch } = useCategorias();
  const [mostrarForm, setMostrarForm] = useState(false);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try {
      await api.delete(`/categorias/${id}`);
      refetch();
    } catch {
      alert("No se puede eliminar: la categoría tiene transacciones asociadas");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Categorías</h2>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + Nueva
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-white border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Nueva categoría</h3>
          <CategoriaForm
            onSuccess={() => { setMostrarForm(false); refetch(); }}
            onCancel={() => setMostrarForm(false)}
          />
        </div>
      )}

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div>
          {["ingreso", "gasto"].map((tipo) => {
            const lista = categorias.filter((c) => c.tipo === tipo);
            return (
              <div key={tipo} className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {tipo === "ingreso" ? "Ingresos" : "Gastos"}
                </h3>
                {lista.length === 0 ? (
                  <p className="text-gray-400 text-sm">Sin categorías de {tipo}</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lista.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between bg-white border rounded-lg px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: c.color || "#6366f1" }}
                          />
                          <span className="text-sm">
                            {c.icono && <span className="mr-1">{c.icono}</span>}
                            {c.nombre}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
