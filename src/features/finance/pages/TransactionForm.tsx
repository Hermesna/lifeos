import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFinanceStore } from "../stores/useFinanceStore";
import { PlusCircle } from "lucide-react";

const transactionSchema = z.object({
  description: z
    .string()
    .min(3, "La descripción debe tener al menos 3 caracteres."),
  amount: z.coerce
    .number({ message: "Introduce un número válido." })
    .min(0.01, "El importe debe ser mayor que cero."),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Selecciona una categoría."),
});

type TransactionInput = z.input<typeof transactionSchema>;
type TransactionOutput = z.output<typeof transactionSchema>;

export function TransactionForm() {
  const addTransaction = useFinanceStore((state) => state.addTransaction);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TransactionInput, object, TransactionOutput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "expense",
      category: "Ocio",
    },
  });

  const currentType = watch("type");

  const onSubmit = (data: TransactionOutput) => {
    addTransaction(data);
    reset({
      description: "",
      amount: 0,
      type: currentType,
      category: data.category,
    });
  };

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <h3 className="font-semibold text-base flex items-center gap-2">
        <PlusCircle className="h-4 w-4 text-primary" /> Registrar Movimiento
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-2 p-1 bg-secondary/50 rounded-lg border">
          <label
            className={`flex justify-center py-1.5 text-xs font-medium rounded-md cursor-pointer transition-all ${currentType === "expense" ? "bg-card text-destructive font-bold shadow-sm" : "text-muted-foreground"}`}
          >
            <input
              type="radio"
              value="expense"
              {...register("type")}
              className="sr-only"
            />
            Gasto
          </label>
          <label
            className={`flex justify-center py-1.5 text-xs font-medium rounded-md cursor-pointer transition-all ${currentType === "income" ? "bg-card text-emerald-500 font-bold shadow-sm" : "text-muted-foreground"}`}
          >
            <input
              type="radio"
              value="income"
              {...register("type")}
              className="sr-only"
            />
            Ingreso
          </label>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Descripción
          </label>
          <input
            type="text"
            {...register("description")}
            placeholder="Ej. Supermercado, Nómina..."
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {errors.description && (
            <p className="text-xs text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Importe (€)
          </label>
          <input
            type="number"
            step="any"
            placeholder="e.g. 500"
            {...register("amount")}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {errors.amount && (
            <p className="text-xs text-destructive">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Categoría
          </label>
          <select
            {...register("category")}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {currentType === "expense" ? (
              <>
                <option value="Ocio">Ocio & Restauración</option>
                <option value="Transporte">Transporte / Viajes</option>
                <option value="Hogar">Hogar & Suministros</option>
                <option value="Otros">Otros Gastos</option>
              </>
            ) : (
              <>
                <option value="Nómina">Nómina / Salario</option>
                <option value="Inversiones">Inversiones</option>
                <option value="Otros">Otros Ingresos</option>
              </>
            )}
          </select>
        </div>

        <button
          type="submit"
          className="w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          Guardar Transacción
        </button>
      </form>
    </div>
  );
}
