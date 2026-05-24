import { PresupuestoResumen } from "../../hooks/use-reporte";

export const PresupuestoCard = ({ presupuesto }: { presupuesto: PresupuestoResumen }) => {
  const { nombre, monto, gastado, porcentaje, color } = presupuesto;
  const excedido = porcentaje > 100;

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{nombre}</span>
        <span className={`text-xs font-semibold ${excedido ? "text-red-500" : "text-gray-500"}`}>
          {porcentaje}%
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{
            width: `${Math.min(porcentaje, 100)}%`,
            backgroundColor: excedido ? "#ef4444" : (color || "#6366f1"),
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Gastado: ${gastado.toLocaleString()}</span>
        <span>Límite: ${monto.toLocaleString()}</span>
      </div>
    </div>
  );
};
