import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useHabitsStore, type HabitEvent } from "../stores/useHabitsStore"
import {
    Plus,
    Check,
    X,
    Pencil,
    Trash2,
    CheckCircle2,
    Circle,
    Clock,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import type { TFunction } from "i18next"

const getHabitSchema = (t: TFunction) =>
    z.object({
        name: z.string().min(3, t("habits.validation.nameMin", "Mínimo 3 caracteres.")),
        category: z.string().min(1, t("habits.validation.category", "Selecciona categoría.")),
        date: z.string().min(1, t("habits.validation.date", "Selecciona una fecha.")),
        time: z.string().optional(),
        timeEnd: z.string().optional(),
        recurrence: z.enum(["none", "daily", "weekly"]),
        daysOfWeek: z.array(z.number()).optional(),
    })

type HabitFormValues = z.infer<ReturnType<typeof getHabitSchema>>

const NO_TIME_PLACEHOLDER = "--:--"

interface HabitsSidebarProps {
    selectedDate: string
    editingHabit: HabitEvent | null
    onClearEditing: () => void
    onEditHabit: (habit: HabitEvent) => void
    shouldFocusName?: boolean
    onFocused?: () => void
}

export function HabitsSidebar({
    selectedDate,
    editingHabit,
    onClearEditing,
    onEditHabit,
    shouldFocusName,
    onFocused,
}: HabitsSidebarProps) {
    const { t } = useTranslation()
    const { habits, addHabit, editHabit, deleteHabit, toggleHabit } =
        useHabitsStore()

    const habitSchema = getHabitSchema(t)

    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        control,
        formState: { errors },
    } = useForm<HabitFormValues>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            name: "",
            category: "lifestyle",
            date: selectedDate,
            time: "",
            timeEnd: "",
            recurrence: "none",
            daysOfWeek: [],
        },
    })

    const recurrence = useWatch({
        control,
        name: "recurrence",
    })

    useEffect(() => {
        if (shouldFocusName) {
            setFocus("name")
            if (onFocused) onFocused()
        }
    }, [shouldFocusName, setFocus, onFocused])

    useEffect(() => {
        if (editingHabit) {
            reset({
                name: editingHabit.name,
                category: editingHabit.category,
                date: editingHabit.date,
                time:
                    editingHabit.time === NO_TIME_PLACEHOLDER || !editingHabit.time
                        ? ""
                        : editingHabit.time,
                timeEnd:
                    editingHabit.timeEnd === NO_TIME_PLACEHOLDER || !editingHabit.timeEnd
                        ? ""
                        : editingHabit.timeEnd,
                recurrence: "none",
                daysOfWeek: [],
            })
        } else {
            reset({
                name: "",
                category: "lifestyle",
                date: selectedDate,
                time: "",
                timeEnd: "",
                recurrence: "none",
                daysOfWeek: [],
            })
        }
    }, [selectedDate, editingHabit, reset])

    const onSubmit = (data: HabitFormValues) => {
        const baseEventData = {
            ...data,
            time: data.time || NO_TIME_PLACEHOLDER,
            timeEnd: data.timeEnd || "",
        }

        if (editingHabit) {
            editHabit(editingHabit.id, baseEventData)
            onClearEditing()
        } else {
            addHabit(baseEventData)

            reset({
                name: "",
                category: data.category,
                date: selectedDate,
                time: "",
                timeEnd: "",
                recurrence: "none",
                daysOfWeek: [],
            })
        }
    }

    const dayEvents = habits
        .filter((h) => h.date === selectedDate)
        .sort((a, b) => {
            const timeA = a.time || NO_TIME_PLACEHOLDER
            const timeB = b.time || NO_TIME_PLACEHOLDER

            if (timeA === NO_TIME_PLACEHOLDER && timeB === NO_TIME_PLACEHOLDER) return 0
            if (timeA === NO_TIME_PLACEHOLDER) return 1
            if (timeB === NO_TIME_PLACEHOLDER) return -1
            return timeA.localeCompare(timeB)
        })

    return (
        <div className="space-y-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3.5"
            >
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm tracking-tight">
                        {editingHabit
                            ? t("habits.sidebar.editTask", "Editar Tarea")
                            : t("habits.sidebar.addToSchedule", "Añadir a la Agenda")}
                    </h3>
                    {editingHabit && (
                        <button
                            type="button"
                            onClick={() => {
                                onClearEditing()
                                reset({
                                    name: "",
                                    category: "lifestyle",
                                    date: selectedDate,
                                    time: "",
                                    timeEnd: "",
                                    recurrence: "none",
                                    daysOfWeek: [],
                                })
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
                        >
                            <X className="h-3.5 w-3.5 shrink-0" /> {t("habits.sidebar.cancel", "Cancelar")}
                        </button>
                    )}
                </div>

                <div className="space-y-1.5">
                    <input
                        type="text"
                        placeholder={t(
                            "habits.sidebar.namePlaceholder",
                            "Ej. Gimnasio, Estudiar..."
                        )}
                        {...register("name")}
                        className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all"
                    />
                    {errors.name && (
                        <p className="text-[10px] font-medium text-destructive">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <input
                        type="date"
                        {...register("date")}
                        className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="time"
                        {...register("time")}
                        title={t("habits.sidebar.timeStart", "Hora inicio")}
                        className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <input
                        type="time"
                        {...register("timeEnd")}
                        title={t("habits.sidebar.timeEnd", "Hora fin")}
                        className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
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
                                    ].map((day) => (
                                        <label
                                            key={day.val}
                                            className="flex flex-col items-center justify-center h-8 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground text-[10px] font-medium cursor-pointer select-none transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                value={day.val}
                                                {...register("daysOfWeek", {
                                                    setValueAs: (v) => (Array.isArray(v) ? v.map(Number) : []),
                                                })}
                                                className="sr-only"
                                            />
                                            {day.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary h-9 text-xs font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 cursor-pointer"
                >
                    {editingHabit ? (
                        <Check className="h-4 w-4 shrink-0" />
                    ) : (
                        <Plus className="h-4 w-4 shrink-0" />
                    )}
                    {editingHabit
                        ? t("habits.sidebar.save", "Guardar")
                        : t("habits.sidebar.addTask", "Añadir Tarea")}
                </button>
            </form>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
                <h4 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 shrink-0" />{" "}
                    {t("habits.sidebar.eventsForDate", "Eventos para {{date}}", {
                        date: selectedDate,
                    })}
                </h4>

                {dayEvents.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                        {t("habits.sidebar.noPlans", "Sin planes para este día.")}
                    </p>
                ) : (
                    <div className="space-y-2">
                        {dayEvents.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-background text-xs shadow-xs"
                            >
                                <div className="flex items-center gap-2.5 truncate min-w-0">
                                    <button
                                        onClick={() => toggleHabit(item.id)}
                                        className="cursor-pointer shrink-0"
                                    >
                                        {item.completed ? (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        ) : (
                                            <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                                        )}
                                    </button>
                                    {item.time && item.time !== NO_TIME_PLACEHOLDER && (
                                        <span className="font-bold text-primary shrink-0">
                                            {item.time}
                                            {item.timeEnd ? ` - ${item.timeEnd}` : ""}
                                        </span>
                                    )}
                                    <span
                                        className={`truncate ${item.completed ? "line-through text-muted-foreground" : ""
                                            }`}
                                    >
                                        {item.name}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 shrink-0 pl-2">
                                    <button
                                        onClick={() => onEditHabit(item)}
                                        className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-colors"
                                        title={t("habits.sidebar.edit", "Editar")}
                                    >
                                        <Pencil className="h-3.5 w-3.5 shrink-0" />
                                    </button>
                                    <button
                                        onClick={() => deleteHabit(item.id)}
                                        className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
                                        title={t("habits.sidebar.delete", "Eliminar")}
                                    >
                                        <Trash2 className="h-3.5 w-3.5 shrink-0" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}