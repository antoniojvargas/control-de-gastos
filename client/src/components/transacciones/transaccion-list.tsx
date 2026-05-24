import { Transaccion } from "../../hooks/use-transacciones";
import { api } from "../../api/axios-instance";

interface Props {
  transacciones: Transaccion[];
  onDelete: () => void;
}

export const TransaccionList = ({ transacciones, onDelete }: Props) => {
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta transacción?")) return;
    await api.delete(`/transacciones/${id}`);
    onDelete();
  };

  if (transacciones.length === 0) {
    return <p className="text-center text-gray-400 py-8">No hay transacciones registradas</p>;
  }

  return (
    <div className="space-y-2">
      {transacciones.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between bg-white border rounded-lg px-4 py-3 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-2 h-8 rounded-full ${t.tipo === "ingreso" ? "bg-green-500" : "bg-red-400"}`}
            />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {t.descripcion || t.categoria?.nombre || "—"}
              </p>
              <p className="text-xs text-gray-400">
                {t.categoria?.nombre} · {t.fecha}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`font-semibold ${t.tipo === "ingreso" ? "text-green-600" : "text-red-500"}`}
            >
              {t.tipo === "ingreso" ? "+" : "-"}${Number(t.monto).toLocaleString()}
            </span>
            <button
              onClick={() => handleDelete(t.id)}
              className="text-gray-300 hover:text-red-400 transition-colors text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
