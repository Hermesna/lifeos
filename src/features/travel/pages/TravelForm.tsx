import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useTravelStore } from "../stores/useTravelStore"
import { Loader2, Plane } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import type { TFunction } from "i18next"

const getTravelSchema = (t: TFunction) =>
    z.object({
        destination: z
            .string()
            .min(
                2,
                t(
                    "travel.validation.destinationMin",
                    "El destino debe tener al menos 2 caracteres."
                )
            )
            .max(50),
        startDate: z
            .string()
            .min(
                1,
                t(
                    "travel.validation.startDateRequired",
                    "Selecciona una fecha de inicio."
                )
            ),
        budget: z.coerce
            .number({
                message: t(
                    "travel.validation.budgetInvalid",
                    "Introduce un presupuesto válido."
                ),
            })
            .min(
                1,
                t(
                    "travel.validation.budgetMin",
                    "El presupuesto debe ser mayor a 0."
                )
            ),
    })

type TravelSchemaType = ReturnType<typeof getTravelSchema>
type TravelFormInput = z.input<TravelSchemaType>
type TravelFormOutput = z.output<TravelSchemaType>

export function TravelForm() {
    const { t } = useTranslation()
    const addTrip = useTravelStore((state) => state.addTrip)
    const [isSaving, setIsSaving] = useState(false)
    const currentUserId = "usr_123"

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TravelFormInput, object, TravelFormOutput>({
        resolver: zodResolver(getTravelSchema(t)),
        defaultValues: { destination: "", startDate: "", budget: 1000 },
    })

    const onSubmit = async (data: TravelFormOutput) => {
        setIsSaving(true)
        await new Promise((resolve) => setTimeout(resolve, 300))
        addTrip({
            ...data,
            userId: currentUserId,
        })

        reset()
        setIsSaving(false)
    }

    return (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold text-lg tracking-tight mb-1 flex items-center gap-2">
                <Plane className="h-4 w-4 text-primary" />{" "}
                {t("travel.form.title", "Planear Nuevo Viaje")}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
                {t("travel.form.subtitle", "Añade tu próximo destino al radar.")}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        {t("travel.form.destinationLabel", "Destino / Ciudad")}
                    </label>
                    <input
                        type="text"
                        {...register("destination")}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder={t(
                            "travel.form.destinationPlaceholder",
                            "Ej: Tokio, Japón 🇯🇵"
                        )}
                    />
                    {errors.destination && (
                        <p className="text-xs text-destructive">
                            {errors.destination.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        {t("travel.form.startDateLabel", "Fecha Estimada")}
                    </label>
                    <input
                        type="date"
                        {...register("startDate")}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    {errors.startDate && (
                        <p className="text-xs text-destructive">
                            {errors.startDate.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        {t("travel.form.budgetLabel", "Presupuesto Inicial (€)")}
                    </label>
                    <input
                        type="number"
                        {...register("budget")}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Ej: 2500"
                    />
                    {errors.budget && (
                        <p className="text-xs text-destructive">
                            {errors.budget.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        t("travel.form.submitBtn", "Crear Viaje")
                    )}
                </button>
            </form>
        </div>
    )
}