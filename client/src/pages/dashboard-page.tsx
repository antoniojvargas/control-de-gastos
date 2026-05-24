import { useState, useEffect } from "react";
import { useReporte, Resumen } from "../hooks/use-reporte";
import { api } from "../api/axios-instance";
import { LoadingSpinner } from "../components/ui/loading-spinner";
import { ErrorMessage } from "../components/ui/error-message";
import { IngresosGastosBar } from "../components/charts/ingresos-gastos-bar";
import { DistribucionPie } from "../components/charts/distribucion-pie";
import { TendenciaLine } from "../components/charts/tendencia-line";
import { PresupuestoCard } from "../components/presupuestos/presupuesto-card";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const hoy = new Date();

export const DashboardPage = () => {
  const { resumen, loading, error } = useReporte(hoy.getMonth() + 1, hoy.getFullYear());
  const [datosHistoricos, setDatosHistoricos] = useState<{ mes: string; ingresos: number; gastos: number; balance: number }[]>([]);

  useEffect(() => {
    const fetchHistorico = async () => {
      const promesas = [];
      for (let i = 5; i >= 0; i--) {
        const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
        promesas.push(
          api
            .get<Resumen>("/reportes/resumen", {
              params: { mes: fecha.getMonth() + 1, anio: fecha.getFullYear() },
            })
            .then((res) => ({
              mes: `${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`,
              ingresos: res.data.totalIngresos,
              gastos: res.data.totalGastos,
              balance: res.data.balance,
            }))
            .catch(() => ({
              mes: `${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`,
              ingresos: 0,
              gastos: 0,
              balance: 0,
            }))
        );
      }
      const resultados = await Promise.all(promesas);
      setDatosHistoricos(resultados);
    };

    fetchHistorico();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!resumen) return null;

  const { totalIngresos, totalGastos, balance, presupuestos } = resumen;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Dashboard — {MESES[hoy.getMonth()]} {hoy.getFullYear()}
      </h2>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <p className="text-sm text-green-600 font-medium">Ingresos</p>
          <p className="text-2xl font-bold text-green-700 mt-1">${totalIngresos.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="text-sm text-red-600 font-medium">Gastos</p>
          <p className="text-2xl font-bold text-red-700 mt-1">${totalGastos.toLocaleString()}</p>
        </div>
        <div className={`border rounded-xl p-5 ${balance >= 0 ? "bg-indigo-50 border-indigo-200" : "bg-orange-50 border-orange-200"}`}>
          <p className={`text-sm font-medium ${balance >= 0 ? "text-indigo-600" : "text-orange-600"}`}>Balance</p>
          <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? "text-indigo-700" : "text-orange-700"}`}>
            ${balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Ingresos vs Gastos (últimos 6 meses)</h3>
          <IngresosGastosBar datos={datosHistoricos} />
        </div>
        <div className="bg-white border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Distribución de gastos</h3>
          <DistribucionPie presupuestos={presupuestos} />
        </div>
      </div>

      <div className="bg-white border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Tendencia del balance</h3>
        <TendenciaLine datos={datosHistoricos} />
      </div>

      {/* Presupuestos */}
      {presupuestos.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Presupuestos del mes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {presupuestos.map((p) => (
              <PresupuestoCard key={p.id} presupuesto={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
