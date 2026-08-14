import { useEffect, useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useHabitsStore, type HabitEvent } from "../stores/useHabitsStore"
import { Plus, Check, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { TFunction } from "i18next"

const getHabitSchema = (t: TFunction) =>
    z.object({
        name: z
            .string()
            .min(3, t("habits.validation.nameMin", "Mínimo 3 caracteres.")),
        category: z.string().min(1, t("habits.validation.category", "Selecciona categoría.")),
        date: z.string().min(1, t("habits.validation.date", "Selecciona una fecha.")),
        time: z.string().min(1, t("habits.validation.time", "Selecciona una hora de inicio.")),
        timeEnd: z.string().optional(),
        repeatWeekly: z.boolean().default(false),
        monthsToExtend: z.coerce.number().min(0).default(0),
    })

type HabitSchemaType = ReturnType<typeof getHabitSchema>
type HabitInput = z.input<HabitSchemaType>
type HabitOutput = z.output<HabitSchemaType>

interface HabitFormProps {
    selectedDate: string
    editingHabit?: HabitEvent | null
    onCancelEdit?: () => void
}

export function HabitForm({
    selectedDate,
    editingHabit,
    onCancelEdit,
}: HabitFormProps) {
    const { t } = useTranslation()
    const { addHabit, editHabit } = useHabitsStore()

    const habitSchema = useMemo(() => getHabitSchema(t), [t])

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm<HabitInput, object, HabitOutput>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            name: "",
            category: "lifestyle",
            date: selectedDate,
            time: "09:00",
            timeEnd: "",
            repeatWeekly: false,
            monthsToExtend: 0,
        },
    })

    const repeatWeekly = useWatch({
        control,
        name: "repeatWeekly",
    })

    useEffect(() => {
        if (!editingHabit) {
            setValue("date", selectedDate)
        }
    }, [selectedDate, editingHabit, setValue])

    useEffect(() => {
        if (editingHabit) {
            reset({
                name: editingHabit.name,
                category: editingHabit.category,
                date: editingHabit.date,
                time: editingHabit.time || "09:00",
                timeEnd: editingHabit.timeEnd || "",
                repeatWeekly: false,
                monthsToExtend: 0,
            })
        }
    }, [editingHabit, reset])

    const onSubmit = async (data: HabitOutput) => {
        const { repeatWeekly, monthsToExtend, ...baseData } = data

        if (editingHabit) {
            await editHabit(editingHabit.id, baseData)
            if (onCancelEdit) onCancelEdit()
        } else {
            if (repeatWeekly) {
                const startDate = new Date(baseData.date + "T00:00:00")
                const targetDay = startDate.getDay()
                const extraMonths = Number(monthsToExtend) || 0
                const totalMonths = extraMonths + 1

                for (let m = 0; m < totalMonths; m++) {
                    const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth() + m, 1)
                    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

                    const d = new Date(currentMonth)
                    while (d <= monthEnd) {
                        if (d.getDay() === targetDay && d >= startDate) {
                            const year = d.getFullYear()
                            const month = String(d.getMonth() + 1).padStart(2, "0")
                            const day = String(d.getDate()).padStart(2, "0")
                            const formattedDate = `${year}-${month}-${day}`

                            await addHabit({
                                ...baseData,
                                date: formattedDate,
                            })
                        }
                        d.setDate(d.getDate() + 1)
                    }
                }
            } else {
                await addHabit(baseData)
            }
        }

        reset({
            name: "",
            category: data.category,
            date: selectedDate,
            time: "09:00",
            timeEnd: "",
            repeatWeekly: false,
            monthsToExtend: 0,
        })
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-xs"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-tight">
                    {editingHabit
                        ? t("habits.form.editTitle", "Editar Actividad")
                        : t("habits.form.newTitle", "Nueva Actividad / Hábito")}
                </h3>
                {editingHabit && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
                    >
                        <X className="h-3.5 w-3.5 shrink-0" />
                        {t("habits.form.cancel", "Cancelar")}
                    </button>
                )}
            </div>

            <div className="space-y-3.5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t("habits.form.name", "Nombre")}
                    </label>
                    <input
                        type="text"
                        placeholder={t("habits.form.namePlaceholder", "Ej. Entrenar, Estudiar...")}
                        {...register("name")}
                        className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    {errors.name && (
                        <p className="text-xs font-medium text-destructive">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t("habits.form.date", "Fecha")}
                    </label>
                    <input
                        type="date"
                        {...register("date")}
                        className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    {errors.date && (
                        <p className="text-xs font-medium text-destructive">
                            {errors.date.message}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            {t("habits.form.timeStart", "Hora inicio")}
                        </label>
                        <input
                            type="time"
                            {...register("time")}
                            className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        {errors.time && (
                            <p className="text-xs font-medium text-destructive">
                                {errors.time.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            {t("habits.form.timeEnd", "Hora fin (opcional)")}
                        </label>
                        <input
                            type="time"
                            {...register("timeEnd", {
                                setValueAs: (v) => (v === "" ? undefined : v),
                            })}
                            className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        {errors.timeEnd && (
                            <p className="text-xs font-medium text-destructive">
                                {errors.timeEnd.message}
                            </p>
                        )}
                    </div>
                </div>

                {!editingHabit && (
                    <div className="space-y-3 pt-2 border-t border-border/50">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="repeatWeekly"
                                {...register("repeatWeekly")}
                                className="h-4 w-4 rounded border-input text-primary focus:ring-ring cursor-pointer"
                            />
                            <label
                                htmlFor="repeatWeekly"
                                className="text-xs font-medium text-foreground cursor-pointer select-none"
                            >
                                {t(
                                    "habits.form.repeatWeekly",
                                    "Repetir este día todas las semanas"
                                )}
                            </label>
                        </div>

                        {repeatWeekly && (
                            <div className="space-y-1.5 pl-6">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    {t("habits.form.monthsToExtend", "Extender (meses adicionales)")}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="12"
                                    {...register("monthsToExtend")}
                                    className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t("habits.form.category", "Categoría")}
                    </label>
                    <select
                        {...register("category")}
                        className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        <option value="lifestyle">
                            {t("habits.categories.lifestyle", "Estilo de vida")}
                        </option>
                        <option value="work">
                            {t("habits.categories.work", "Trabajo")}
                        </option>
                        <option value="health">
                            {t("habits.categories.health", "Salud & Deporte")}
                        </option>
                        <option value="languages">
                            {t("habits.categories.languages", "Idiomas")}
                        </option>
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary h-9 text-xs font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-50 cursor-pointer mt-2"
            >
                {editingHabit ? (
                    <>
                        <Check className="h-4 w-4 shrink-0" />
                        {t("habits.form.updateButton", "Guardar Cambios")}
                    </>
                ) : (
                    <>
                        <Plus className="h-4 w-4 shrink-0" />
                        {t("habits.form.createButton", "Añadir a la Agenda")}
                    </>
                )}
            </button>
        </form>
    )
}