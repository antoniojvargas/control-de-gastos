import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface DatoMes {
  mes: string;
  balance: number;
}

export const TendenciaLine = ({ datos }: { datos: DatoMes[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={datos} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
      <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
      <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
      <Line
        type="monotone"
        dataKey="balance"
        stroke="#6366f1"
        strokeWidth={2}
        dot={{ r: 4 }}
        name="Balance"
      />
    </LineChart>
  </ResponsiveContainer>
);
