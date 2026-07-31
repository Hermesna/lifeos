import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { CheckCircle2, Circle, ArrowRight, Flame, Clock, Sparkles } from "lucide-react"
import { useHabitsStore } from "@/features/habits/stores/useHabitsStore"

export function HabitsWidget() {
    const { t } = useTranslation()
    const habits = useHabitsStore((state) => state.habits)
    const toggleHabit = useHabitsStore((state) => state.toggleHabit)

    const completedCount = habits.filter((h) => h.completed).length
    const totalCount = habits.length
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col justify-between h-full hover:border-border/80 transition-colors shadow-xs">
            <div className="bg-orange-500/10 dark:bg-orange-500/5 px-4 py-3 border-b border-orange-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-orange-500 text-white shadow-xs">
                        <Flame className="h-3.5 w-3.5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                            {t("habitsWidget.routine", { defaultValue: "Rutina Diaria" })}
                        </span>
                        <h3 className="text-xs font-semibold">
                            {t("habitsWidget.title", { defaultValue: "Hábitos de Hoy" })}
                        </h3>
                    </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white shadow-xs">
                    {completedCount}/{totalCount} ({progressPercentage}%)
                </span>
            </div>

            <div className="p-4 space-y-2 min-h-[120px] flex flex-col justify-center flex-1">
                {habits.length === 0 ? (
                    <div className="text-center py-2">
                        <Sparkles className="h-5 w-5 mx-auto text-muted-foreground/50 mb-1" />
                        <p className="text-xs text-muted-foreground">
                            {t("habitsWidget.empty", { defaultValue: "No hay hábitos registrados para hoy." })}
                        </p>
                    </div>
                ) : (
                    habits.slice(0, 3).map((habit) => (
                        <button
                            key={habit.id}
                            type="button"
                            onClick={() => toggleHabit(habit.id)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer text-left group border ${
                                habit.completed
                                    ? "bg-accent/30 border-border/40 opacity-75"
                                    : "bg-accent/60 border-border/60 hover:bg-accent"
                            }`}
                        >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                                {habit.completed ? (
                                    <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0 transition-transform scale-110" />
                                ) : (
                                    <Circle className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                                )}
                                <span
                                    className={`text-xs truncate ${
                                        habit.completed
                                            ? "line-through text-muted-foreground font-normal"
                                            : "font-semibold text-foreground"
                                    }`}
                                >
                                    {habit.name}
                                </span>
                            </div>

                            {habit.time && (
                                <span className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0 pl-2 bg-background/50 px-1.5 py-0.5 rounded-md border border-border/30">
                                    <Clock className="h-3 w-3" />
                                    {habit.time}
                                </span>
                            )}
                        </button>
                    ))
                )}
            </div>

            <Link
                to="/calendar"
                className="px-4 py-2.5 bg-accent/20 flex items-center justify-between text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors border-t border-border/40"
            >
                <span>{t("habitsWidget.manage", { defaultValue: "Gestionar rutina completa" })}</span>
                <ArrowRight className="h-3 w-3" />
            </Link>
        </div>
    )
}