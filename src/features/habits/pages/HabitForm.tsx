import { useEffect } from "react"
import { useForm } from "react-hook-form"
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
        time: z.string().min(1, t("habits.validation.time", "Selecciona una hora.")),
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
        formState: { errors, isSubmitting },
    } = useForm<HabitInput, object, HabitOutput>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            name: "",
            category: "lifestyle",
            date: selectedDate,
            time: "09:00",
        },
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
                time: editingHabit.time,
            })
        }
    }, [editingHabit, reset])

    const onSubmit = (data: HabitOutput) => {
        if (editingHabit) {
            editHabit(editingHabit.id, data)
            if (onCancelEdit) onCancelEdit()
        } else {
            addHabit(data)
        }
        reset({
            name: "",
            category: data.category,
            date: selectedDate,
            time: "09:00",
        })
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 rounded-xl border bg-card p-5 shadow-sm"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold tracking-tight">
                    {editingHabit
                        ? t("habits.form.editTitle", "Editar Actividad")
                        : t("habits.form.newTitle", "Nueva Actividad / Hábito")}
                </h3>
                {editingHabit && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                        <X className="h-3.5 w-3.5" />
                        {t("habits.form.cancel", "Cancelar")}
                    </button>
                )}
            </div>

            <div className="space-y-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase">
                        {t("habits.form.name", "Nombre")}
                    </label>
                    <input
                        type="text"
                        placeholder={t("habits.form.namePlaceholder", "Ej. Entrenar pierna, Estudiar...")}
                        {...register("name")}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    {errors.name && (
                        <p className="text-xs font-medium text-destructive">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground uppercase">
                            {t("habits.form.date", "Fecha")}
                        </label>
                        <input
                            type="date"
                            {...register("date")}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground uppercase">
                            {t("habits.form.time", "Hora")}
                        </label>
                        <input
                            type="time"
                            {...register("time")}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase">
                        {t("habits.form.category", "Categoría")}
                    </label>
                    <select
                        {...register("category")}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        <option value="lifestyle">
                            {t("habits.categories.lifestyle", "Estilo de vida")}
                        </option>
                        <option value="work">
                            {t("habits.categories.work", "Trabajo / Enfoque")}
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary h-9 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
            >
                {editingHabit ? (
                    <>
                        <Check className="h-4 w-4" />
                        {t("habits.form.updateButton", "Guardar Cambios")}
                    </>
                ) : (
                    <>
                        <Plus className="h-4 w-4" />
                        {t("habits.form.createButton", "Añadir a la Agenda")}
                    </>
                )}
            </button>
        </form>
    )
}