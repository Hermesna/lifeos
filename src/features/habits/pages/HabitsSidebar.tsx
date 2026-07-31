import { useEffect } from "react"
import { useForm } from "react-hook-form"
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
        name: z.string().min(3, t("habits.validation.nameMin", "Min. 3 caracteres")),
        category: z.string().min(1),
        date: z.string().min(1),
        time: z.string().min(1),
    })

type HabitFormValues = z.infer<ReturnType<typeof getHabitSchema>>

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
        setValue,
        setFocus,
        formState: { errors },
    } = useForm<HabitFormValues>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            name: "",
            category: "lifestyle",
            date: selectedDate,
            time: "09:00",
        },
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
                time: editingHabit.time,
            })
        } else {
            setValue("date", selectedDate)
        }
    }, [selectedDate, editingHabit, reset, setValue])

    const onSubmit = (data: HabitFormValues) => {
        if (editingHabit) {
            editHabit(editingHabit.id, data)
            onClearEditing()
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

    const dayEvents = habits
        .filter((h) => h.date === selectedDate)
        .sort((a, b) => a.time.localeCompare(b.time))

    return (
        <div className="space-y-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-xl border bg-card p-4 shadow-sm space-y-3"
            >
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">
                        {editingHabit
                            ? t("habits.sidebar.editTask", "Editar Tarea")
                            : t("habits.sidebar.addToSchedule", "Añadir a la Agenda")}
                    </h3>
                    {editingHabit && (
                        <button
                            type="button"
                            onClick={onClearEditing}
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                        >
                            <X className="h-3 w-3" /> {t("habits.sidebar.cancel", "Cancelar")}
                        </button>
                    )}
                </div>

                <input
                    type="text"
                    placeholder={t(
                        "habits.sidebar.namePlaceholder",
                        "Ej. Gimnasio, Estudiar..."
                    )}
                    {...register("name")}
                    className="h-8 w-full rounded-md border border-input bg-transparent px-2.5 text-xs focus:ring-1 focus:ring-ring focus:outline-none transition-all"
                />
                {errors.name && (
                    <p className="text-[10px] text-destructive">{errors.name.message}</p>
                )}

                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="date"
                        {...register("date")}
                        className="h-8 rounded-md border border-input bg-transparent px-2 text-xs focus:ring-1 focus:ring-ring"
                    />
                    <input
                        type="time"
                        {...register("time")}
                        className="h-8 rounded-md border border-input bg-transparent px-2 text-xs focus:ring-1 focus:ring-ring"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full h-8 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    {editingHabit ? (
                        <Check className="h-3.5 w-3.5" />
                    ) : (
                        <Plus className="h-3.5 w-3.5" />
                    )}
                    {editingHabit
                        ? t("habits.sidebar.save", "Guardar")
                        : t("habits.sidebar.addTask", "Añadir Tarea")}
                </button>
            </form>

            <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
                <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />{" "}
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
                                className="flex items-center justify-between p-2 rounded-lg border bg-background text-xs"
                            >
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleHabit(item.id)}
                                        className="cursor-pointer"
                                    >
                                        {item.completed ? (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <Circle className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </button>
                                    <span className="font-bold text-primary">{item.time}</span>
                                    <span
                                        className={
                                            item.completed ? "line-through text-muted-foreground" : ""
                                        }
                                    >
                                        {item.name}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onEditHabit(item)}
                                        className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                                        title={t("habits.sidebar.edit", "Editar")}
                                    >
                                        <Pencil className="h-3 w-3" />
                                    </button>
                                    <button
                                        onClick={() => deleteHabit(item.id)}
                                        className="p-1 text-muted-foreground hover:text-destructive cursor-pointer"
                                        title={t("habits.sidebar.delete", "Eliminar")}
                                    >
                                        <Trash2 className="h-3 w-3" />
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