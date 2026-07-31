import { useHabitsStore, type HabitEvent } from "../stores/useHabitsStore"
import {
    Clock,
    CheckCircle2,
    Circle,
    Pencil,
    Trash2,
    Calendar as CalendarIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"

interface HabitsWidgetProps {
    selectedDate: string
    onSelectDate: (date: string) => void
    onEditHabit: (habit: HabitEvent) => void
}

export function HabitsWidget({
    selectedDate,
    onSelectDate,
    onEditHabit,
}: HabitsWidgetProps) {
    const { t } = useTranslation()
    const { habits, toggleHabit, deleteHabit } = useHabitsStore()

    const dayHabits = habits
        .filter((h) => h.date === selectedDate)
        .sort((a, b) => a.time.localeCompare(b.time))

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-sm">
                        {t("habits.widget.selectedDay", "Día seleccionado:")}
                    </span>
                </div>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => onSelectDate(e.target.value)}
                    className="h-9 px-3 rounded-md border border-input bg-transparent text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                />
            </div>

            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        {t("habits.widget.scheduleTitle", "Horario del Día")}
                    </h3>
                    <span className="text-xs text-muted-foreground font-medium">
                        {dayHabits.length}{" "}
                        {t("habits.widget.taskCount", "actividades programadas")}
                    </span>
                </div>

                {dayHabits.length === 0 ? (
                    <div className="text-center py-10 border border-dashed rounded-xl bg-background/20">
                        <p className="text-xs text-muted-foreground">
                            {t(
                                "habits.widget.noTasks",
                                "No tienes ninguna actividad programada para este día."
                            )}
                        </p>
                    </div>
                ) : (
                    <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                        {dayHabits.map((item) => (
                            <div
                                key={item.id}
                                className={`relative flex items-center justify-between p-3 border rounded-lg transition-all ${item.completed
                                        ? "bg-secondary/20 border-border/40 opacity-70"
                                        : "bg-background hover:border-primary/40"
                                    }`}
                            >
                                <div
                                    className={`absolute -left-[21px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 bg-background ${item.completed ? "border-emerald-500 bg-emerald-500" : "border-primary"
                                        }`}
                                />

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => toggleHabit(item.id)}
                                        className="text-muted-foreground hover:text-emerald-500 transition-colors"
                                    >
                                        {item.completed ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        ) : (
                                            <Circle className="h-5 w-5" />
                                        )}
                                    </button>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                {item.time}
                                            </span>
                                            <p
                                                className={`text-sm font-medium ${item.completed ? "line-through text-muted-foreground" : ""
                                                    }`}
                                            >
                                                {item.name}
                                            </p>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground capitalize">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onEditHabit(item)}
                                        className="p-1.5 text-muted-foreground hover:text-foreground rounded-md transition-colors"
                                        title={t("habits.widget.edit", "Editar")}
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        onClick={() => deleteHabit(item.id)}
                                        className="p-1.5 text-muted-foreground hover:text-destructive rounded-md transition-colors"
                                        title={t("habits.widget.delete", "Eliminar")}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
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