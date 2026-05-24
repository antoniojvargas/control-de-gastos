import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DatoMes {
  mes: string;
  ingresos: number;
  gastos: number;
}

export const IngresosGastosBar = ({ datos }: { datos: DatoMes[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={datos} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
      <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
      <Legend />
      <Bar dataKey="ingresos" fill="#22c55e" name="Ingresos" radius={[4, 4, 0, 0]} />
      <Bar dataKey="gastos" fill="#ef4444" name="Gastos" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);
