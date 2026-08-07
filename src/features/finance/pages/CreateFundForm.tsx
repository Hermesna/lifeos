import { useForm } from "react-hook-form"
import { useFinanceStore } from "../stores/useFinanceStore"
import { Target } from "lucide-react"
import { useTranslation } from "react-i18next"

interface FundFormData {
    name: string
    target: number
}

export function CreateFundForm() {
    const { t } = useTranslation()
    const addFund = useFinanceStore((state) => state.createFund)

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<FundFormData>({
        defaultValues: {
            name: "",
            target: 0,
        },
    })

    const onSubmit = (data: FundFormData) => {
        addFund({
            name: data.name,
            target: Number(data.target),
        })
        reset()
    }

    return (
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-primary shrink-0" />
                {t("finance.fundForm.title", "Crear Nuevo Objetivo")}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t("finance.fundForm.nameLabel", "Nombre del Objetivo")}
                    </label>
                    <input
                        type="text"
                        {...register("name", { required: true })}
                        placeholder={t("finance.fundForm.namePlaceholder", "Ej. Viaje a Japón, Coche...")}
                        className="h-9 w-full rounded-xl border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shadow-xs"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t("finance.fundForm.targetLabel", "Cantidad Meta (€)")}
                    </label>
                    <input
                        type="number"
                        step="any"
                        {...register("target", { required: true, min: 1 })}
                        placeholder={t("finance.fundForm.targetPlaceholder", "Ej. 1500")}
                        className="h-9 w-full rounded-xl border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shadow-xs"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full h-9 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shadow-xs cursor-pointer mt-1"
                >
                    {t("finance.fundForm.submitButton", "Crear Objetivo")}
                </button>
            </form>
        </div>
    )
}