import { useForm } from "react-hook-form";
import { api } from "../../api/axios-instance";
import { Categoria } from "../../hooks/use-categorias";

interface FormData {
  monto: number;
  descripcion: string;
  fecha: string;
  tipo: "ingreso" | "gasto";
  categoriaId: number;
}

interface Props {
  categorias: Categoria[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const TransaccionForm = ({ categorias, onSuccess, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { fecha: new Date().toISOString().split("T")[0], tipo: "gasto" },
  });

  const tipo = watch("tipo");
  const categoriasFiltradas = categorias.filter((c) => c.tipo === tipo);

  const onSubmit = async (data: FormData) => {
    await api.post("/transacciones", { ...data, monto: Number(data.monto), categoriaId: Number(data.categoriaId) });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select {...register("tipo")} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="gasto">Gasto</option>
            <option value="ingreso">Ingreso</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
          <input
            {...register("monto", { required: "El monto es requerido", min: { value: 0.01, message: "Debe ser mayor a 0" } })}
            type="number"
            step="0.01"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="0.00"
          />
          {errors.monto && <p className="text-red-500 text-xs mt-1">{errors.monto.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <select
          {...register("categoriaId", { required: "La categoría es requerida" })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Seleccionar categoría...</option>
          {categoriasFiltradas.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        {errors.categoriaId && <p className="text-red-500 text-xs mt-1">{errors.categoriaId.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
        <input
          {...register("fecha", { required: "La fecha es requerida" })}
          type="date"
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
        {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
        <input
          {...register("descripcion")}
          type="text"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Ej: Supermercado"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
