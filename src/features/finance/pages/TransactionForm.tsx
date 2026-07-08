import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  financeSchema,
  type FinanceFormValues,
} from "../schemas/financeSchema";
import { useFinanceStore } from "../stores/useFinanceStore";
import { PlusCircle } from "lucide-react";

export function TransactionForm() {
  const addSavings = useFinanceStore((state) => state.addSavings);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FinanceFormValues>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      description: "",
      type: "income",
    },
  });

  const onSubmit = async (data: FinanceFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const finalAmount = data.type === "income" ? data.amount : -data.amount;
    addSavings(finalAmount);

    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border bg-card p-6 shadow-sm"
    >
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-tight">
          Log Transaction
        </h3>
        <p className="text-sm text-muted-foreground">
          Adjust your current financial runway.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Amount (€)
          </label>
          <input
            type="number"
            step="any"
            placeholder="e.g. 500"
            {...register("amount", { valueAsNumber: true })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {errors.amount && (
            <p className="text-xs font-medium text-destructive">
              {errors.amount.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Type
          </label>
          <select
            {...register("type")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="income">Income / Deposit</option>
            <option value="expense">Expense / Withdrawal</option>
          </select>
          {errors.type && (
            <p className="text-xs font-medium text-destructive">
              {errors.type.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Description
        </label>
        <input
          type="text"
          placeholder="e.g. Monthly net salary"
          {...register("description")}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {errors.description && (
          <p className="text-xs font-medium text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary h-9 px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
      >
        <PlusCircle className="h-4 w-4" />
        {isSubmitting ? "Processing..." : "Execute Transaction"}
      </button>
    </form>
  );
}
