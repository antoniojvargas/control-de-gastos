import { useForm } from "react-hook-form";
import { api } from "../../api/axios-instance";

interface FormData {
  nombre: string;
  tipo: "ingreso" | "gasto";
  color: string;
  icono: string;
}

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CategoriaForm = ({ onSuccess, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { tipo: "gasto", color: "#6366f1" } });

  const onSubmit = async (data: FormData) => {
    await api.post("/categorias", data);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          {...register("nombre", { required: "El nombre es requerido" })}
          type="text"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Ej: Alimentación"
        />
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select {...register("tipo")} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="gasto">Gasto</option>
            <option value="ingreso">Ingreso</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <input {...register("color")} type="color" className="w-full h-10 border rounded-lg px-1 py-1 cursor-pointer" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ícono (emoji)</label>
        <input
          {...register("icono")}
          type="text"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Ej: 🛒"
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
