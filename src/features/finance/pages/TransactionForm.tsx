import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useFinanceStore } from "../stores/useFinanceStore"
import { PlusCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { TFunction } from "i18next"

const getTransactionSchema = (t: TFunction) =>
    z.object({
        description: z
            .string()
            .min(
                3,
                t(
                    "finance.validation.descriptionMin",
                    "La descripción debe tener al menos 3 caracteres."
                )
            ),
        amount: z.coerce
            .number({
                message: t(
                    "finance.validation.validNumber",
                    "Introduce un número válido."
                ),
            })
            .min(
                0.01,
                t(
                    "finance.validation.amountPositive",
                    "El importe debe ser mayor que cero."
                )
            ),
        type: z.enum(["income", "expense"]),
        category: z
            .string()
            .min(1, t("finance.validation.selectCategory", "Selecciona una categoría.")),
    })

type TransactionSchemaType = ReturnType<typeof getTransactionSchema>
type TransactionInput = z.input<TransactionSchemaType>
type TransactionOutput = z.output<TransactionSchemaType>

export function TransactionForm() {
    const { t } = useTranslation()
    const addTransaction = useFinanceStore((state) => state.addTransaction)

    const transactionSchema = getTransactionSchema(t)

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<TransactionInput, object, TransactionOutput>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            description: "",
            amount: 0,
            type: "expense",
            category: "Ocio",
        },
    })

    const currentType = useWatch({
        control,
        name: "type",
        defaultValue: "expense",
    })

    const onSubmit = (data: TransactionOutput) => {
        addTransaction(data)
        reset({
            description: "",
            amount: 0,
            type: currentType,
            category: data.category,
        })
    }

    return (
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-base flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-primary" />
                {t("finance.form.title", "Registrar Movimiento")}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-2 p-1 bg-secondary/50 rounded-lg border">
                    <label
                        className={`flex justify-center py-1.5 text-xs font-medium rounded-md cursor-pointer transition-all ${currentType === "expense"
                            ? "bg-card text-destructive font-bold shadow-sm"
                            : "text-muted-foreground"
                            }`}
                    >
                        <input
                            type="radio"
                            value="expense"
                            {...register("type")}
                            className="sr-only"
                        />
                        {t("finance.form.expense", "Gasto")}
                    </label>
                    <label
                        className={`flex justify-center py-1.5 text-xs font-medium rounded-md cursor-pointer transition-all ${currentType === "income"
                            ? "bg-card text-emerald-500 font-bold shadow-sm"
                            : "text-muted-foreground"
                            }`}
                    >
                        <input
                            type="radio"
                            value="income"
                            {...register("type")}
                            className="sr-only"
                        />
                        {t("finance.form.income", "Ingreso")}
                    </label>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t("finance.form.descriptionLabel", "Descripción")}
                    </label>
                    <input
                        type="text"
                        {...register("description")}
                        placeholder={t(
                            "finance.form.descriptionPlaceholder",
                            "Ej. Supermercado, Nómina..."
                        )}
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
                        {t("finance.form.amountLabel", "Importe (€)")}
                    </label>
                    <input
                        type="number"
                        step="any"
                        placeholder={t("finance.form.amountPlaceholder", "Ej. 500")}
                        {...register("amount")}
                        className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    {errors.amount && (
                        <p className="text-xs text-destructive">{errors.amount.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t("finance.form.categoryLabel", "Categoría")}
                    </label>
                    <select
                        {...register("category")}
                        className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        {currentType === "expense" ? (
                            <>
                                <option value="Ocio">
                                    {t("finance.categories.leisure", "Ocio & Restauración")}
                                </option>
                                <option value="Transporte">
                                    {t("finance.categories.transport", "Transporte / Viajes")}
                                </option>
                                <option value="Hogar">
                                    {t("finance.categories.housing", "Hogar & Suministros")}
                                </option>
                                <option value="Otros">
                                    {t("finance.categories.otherExpenses", "Otros Gastos")}
                                </option>
                            </>
                        ) : (
                            <>
                                <option value="Nómina">
                                    {t("finance.categories.salary", "Nómina / Salario")}
                                </option>
                                <option value="Inversiones">
                                    {t("finance.categories.investments", "Inversiones")}
                                </option>
                                <option value="Otros">
                                    {t("finance.categories.otherIncome", "Otros Ingresos")}
                                </option>
                            </>
                        )}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                    {t("finance.form.submitButton", "Guardar Transacción")}
                </button>
            </form>
        </div>
    )
}