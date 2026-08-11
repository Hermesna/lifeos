import { useEffect } from "react"
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
        recurrence: z.enum(["none", "daily", "weekly"]),
        daysOfWeek: z.array(z.number()).optional(),
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

    const habitSchema = getHabitSchema(t)

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
            recurrence: "none",
            daysOfWeek: [],
        },
    })

    const recurrence = useWatch({
        control,
        name: "recurrence",
    })

    const watchedDaysOfWeek = useWatch({
        control,
        name: "daysOfWeek",
    }) || []

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
                recurrence: "none",
                daysOfWeek: [],
            })
        }
    }, [editingHabit, reset])

    const onSubmit = (data: HabitOutput) => {
        if (editingHabit) {
            editHabit(editingHabit.id, data)
            if (onCancelEdit) onCancelEdit()
        } else {
            if (data.recurrence === "none") {
                addHabit(data)
            } else {
                const startDate = new Date(data.date + "T00:00:00")
                const iterations = data.recurrence === "daily" ? 14 : 28

                for (let i = 0; i < iterations; i++) {
                    const currentDate = new Date(startDate)
                    currentDate.setDate(startDate.getDate() + i)

                    if (data.recurrence === "weekly") {
                        const dayIndex = currentDate.getDay()
                        const selectedDays = data.daysOfWeek || []
                        if (!selectedDays.includes(dayIndex)) continue
                    }

                    const year = currentDate.getFullYear()
                    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
                    const day = String(currentDate.getDate()).padStart(2, "0")
                    const formattedDate = `${year}-${month}-${day}`

                    addHabit({
                        ...data,
                        date: formattedDate,
                    })
                }
            }
        }

        reset({
            name: "",
            category: data.category,
            date: selectedDate,
            time: "09:00",
            timeEnd: "",
            recurrence: "none",
            daysOfWeek: [],
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

                {!editingHabit && (
                    <div className="space-y-2 pt-1 border-t border-border/50">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                {t("habits.form.recurrence", "Repetición")}
                            </label>
                            <select
                                {...register("recurrence")}
                                className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="none">{t("habits.recurrence.none", "No repetir")}</option>
                                <option value="daily">{t("habits.recurrence.daily", "Diariamente")}</option>
                                <option value="weekly">{t("habits.recurrence.weekly", "Semanalmente")}</option>
                            </select>
                        </div>

                        {recurrence === "weekly" && (
                            <div className="space-y-1.5 pt-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    {t("habits.form.daysOfWeek", "Días de la semana")}
                                </label>
                                <div className="grid grid-cols-7 gap-1">
                                    {[
                                        { label: "D", val: 0 },
                                        { label: "L", val: 1 },
                                        { label: "M", val: 2 },
                                        { label: "X", val: 3 },
                                        { label: "J", val: 4 },
                                        { label: "V", val: 5 },
                                        { label: "S", val: 6 },
                                    ].map((day) => {
                                        const isChecked = watchedDaysOfWeek.includes(day.val)

                                        return (
                                            <label
                                                key={day.val}
                                                className={`flex flex-col items-center justify-center h-8 rounded-lg border text-[10px] font-medium cursor-pointer select-none transition-colors ${isChecked
                                                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                                                        : "border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={day.val}
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        const current = watchedDaysOfWeek
                                                        if (e.target.checked) {
                                                            setValue("daysOfWeek", [...current, day.val], { shouldValidate: true })
                                                        } else {
                                                            setValue(
                                                                "daysOfWeek",
                                                                current.filter((v) => v !== day.val),
                                                                { shouldValidate: true }
                                                            )
                                                        }
                                                    }}
                                                    className="sr-only"
                                                />
                                                {day.label}
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
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