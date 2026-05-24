import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePresupuestos } from "../hooks/use-presupuestos";
import { useCategorias } from "../hooks/use-categorias";
import { useReporte } from "../hooks/use-reporte";
import { PresupuestoCard } from "../components/presupuestos/presupuesto-card";
import { LoadingSpinner } from "../components/ui/loading-spinner";
import { ErrorMessage } from "../components/ui/error-message";
import { api } from "../api/axios-instance";

interface FormData {
  monto: number;
  categoriaId: number;
}

const hoy = new Date();

export const PresupuestosPage = () => {
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [mostrarForm, setMostrarForm] = useState(false);

  const { presupuestos, loading, error, refetch } = usePresupuestos(mes, anio);
  const { categorias } = useCategorias();
  const { resumen } = useReporte(mes, anio);

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<FormData>();

  const categoriasGasto = categorias.filter((c) => c.tipo === "gasto");

  const onSubmit = async (data: FormData) => {
    await api.post("/presupuestos", {
      monto: Number(data.monto),
      categoriaId: Number(data.categoriaId),
      mes,
      anio,
    });
    reset();
    setMostrarForm(false);
    refetch();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este presupuesto?")) return;
    await api.delete(`/presupuestos/${id}`);
    refetch();
  };

  const presupuestosConGasto = presupuestos.map((p) => {
    const resumenPres = resumen?.presupuestos.find((r) => r.id === p.id);
    return {
      id: p.id,
      categoriaId: p.categoriaId,
      nombre: p.categoria?.nombre ?? "",
      color: p.categoria?.color ?? "",
      monto: Number(p.monto),
      gastado: resumenPres?.gastado ?? 0,
      porcentaje: resumenPres?.porcentaje ?? 0,
    };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Presupuestos</h2>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + Nuevo
        </button>
      </div>

      {/* Selector de período */}
      <div className="bg-white border rounded-xl p-4 flex gap-3">
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
      </div>

      {mostrarForm && (
        <div className="bg-white border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Nuevo presupuesto</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría (gasto)</label>
                <select
                  {...register("categoriaId", { required: "Requerido" })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Seleccionar...</option>
                  {categoriasGasto.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
                {errors.categoriaId && <p className="text-red-500 text-xs mt-1">{errors.categoriaId.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto límite</label>
                <input
                  {...register("monto", { required: "Requerido", min: { value: 1, message: "Debe ser mayor a 0" } })}
                  type="number"
                  step="0.01"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="0.00"
                />
                {errors.monto && <p className="text-red-500 text-xs mt-1">{errors.monto.message}</p>}
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={isSubmitting} className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                {isSubmitting ? "Guardando..." : "Guardar"}
              </button>
              <button type="button" onClick={() => setMostrarForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        presupuestosConGasto.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No hay presupuestos para este período</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {presupuestosConGasto.map((p) => (
              <div key={p.id} className="relative group">
                <PresupuestoCard presupuesto={p} />
                <button
                  onClick={() => handleDelete(p.id)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
