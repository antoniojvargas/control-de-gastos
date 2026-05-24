import { useState } from "react";
import { useTransacciones } from "../hooks/use-transacciones";
import { useCategorias } from "../hooks/use-categorias";
import { TransaccionList } from "../components/transacciones/transaccion-list";
import { TransaccionForm } from "../components/transacciones/transaccion-form";
import { LoadingSpinner } from "../components/ui/loading-spinner";
import { ErrorMessage } from "../components/ui/error-message";

const hoy = new Date();

export const TransaccionesPage = () => {
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [tipo, setTipo] = useState<"" | "ingreso" | "gasto">("");
  const [mostrarForm, setMostrarForm] = useState(false);

  const { transacciones, loading, error, refetch } = useTransacciones({
    mes,
    anio,
    tipo: tipo || undefined,
  });
  const { categorias } = useCategorias();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Transacciones</h2>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + Nueva
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-white border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Nueva transacción</h3>
          <TransaccionForm
            categorias={categorias}
            onSuccess={() => { setMostrarForm(false); refetch(); }}
            onCancel={() => setMostrarForm(false)}
          />
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white border rounded-xl p-4 flex flex-wrap gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Mes</label>
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="border rounded-lg px-3 py-1.5 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2000, i).toLocaleString("es", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Año</label>
          <select
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            className="border rounded-lg px-3 py-1.5 text-sm"
          >
            {[2024, 2025, 2026].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "" | "ingreso" | "gasto")}
            className="border rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="">Todos</option>
            <option value="ingreso">Ingresos</option>
            <option value="gasto">Gastos</option>
          </select>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        <TransaccionList transacciones={transacciones} onDelete={refetch} />
      )}
    </div>
  );
};
