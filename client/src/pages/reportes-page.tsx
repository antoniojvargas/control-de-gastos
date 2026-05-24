import { useState } from "react";
import { useTransacciones } from "../hooks/use-transacciones";
import { useReporte } from "../hooks/use-reporte";
import { LoadingSpinner } from "../components/ui/loading-spinner";
import { ErrorMessage } from "../components/ui/error-message";
import { api } from "../api/axios-instance";

const hoy = new Date();

export const ReportesPage = () => {
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [tipo, setTipo] = useState<"" | "ingreso" | "gasto">("");

  const { transacciones, loading, error } = useTransacciones({ mes, anio, tipo: tipo || undefined });
  const { resumen } = useReporte(mes, anio);

  const handleExportar = async () => {
    const params = new URLSearchParams({ mes: String(mes), anio: String(anio) });
    if (tipo) params.append("tipo", tipo);

    const token = localStorage.getItem("token");
    const res = await fetch(`/api/reportes/exportar?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-${mes}-${anio}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Reportes</h2>

      {/* Filtros */}
      <div className="bg-white border rounded-xl p-4 flex flex-wrap items-end gap-3">
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
        <button
          onClick={handleExportar}
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Exportar CSV
        </button>
      </div>

      {/* Resumen del período */}
      {resumen && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs text-green-600 font-medium">Total ingresos</p>
            <p className="text-xl font-bold text-green-700 mt-1">${resumen.totalIngresos.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-xs text-red-600 font-medium">Total gastos</p>
            <p className="text-xl font-bold text-red-700 mt-1">${resumen.totalGastos.toLocaleString()}</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <p className="text-xs text-indigo-600 font-medium">Balance</p>
            <p className="text-xl font-bold text-indigo-700 mt-1">${resumen.balance.toLocaleString()}</p>
          </div>
        </div>
      )}

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Fecha</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Tipo</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Categoría</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Descripción</th>
                <th className="text-right px-4 py-3 text-gray-600 font-medium">Monto</th>
              </tr>
            </thead>
            <tbody>
              {transacciones.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-8">
                    No hay transacciones para este período
                  </td>
                </tr>
              ) : (
                transacciones.map((t) => (
                  <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{t.fecha}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          t.tipo === "ingreso"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {t.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{t.categoria?.nombre}</td>
                    <td className="px-4 py-3 text-gray-500">{t.descripcion || "—"}</td>
                    <td className={`px-4 py-3 text-right font-medium ${t.tipo === "ingreso" ? "text-green-600" : "text-red-500"}`}>
                      {t.tipo === "ingreso" ? "+" : "-"}${Number(t.monto).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
