import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PresupuestoResumen } from "../../hooks/use-reporte";

const COLORES_DEFAULT = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

export const DistribucionPie = ({ presupuestos }: { presupuestos: PresupuestoResumen[] }) => {
  const datos = presupuestos
    .filter((p) => p.gastado > 0)
    .map((p) => ({ name: p.nombre, value: p.gastado }));

  if (datos.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
        Sin gastos registrados este mes
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={datos}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {datos.map((_, index) => (
            <Cell key={index} fill={COLORES_DEFAULT[index % COLORES_DEFAULT.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
