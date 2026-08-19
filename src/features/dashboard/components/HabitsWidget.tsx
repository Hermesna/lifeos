import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { CheckCircle2, Circle, ArrowRight, Flame, Clock, Sparkles, Calendar } from "lucide-react"
import { useHabitsStore } from "@/features/habits/stores/useHabitsStore"

export function HabitsWidget() {
    const { t } = useTranslation()
    const habits = useHabitsStore((state) => state.habits)
    const toggleHabit = useHabitsStore((state) => state.toggleHabit)

    const todayStr = new Date().toISOString().split("T")[0]

    const todayHabits = habits.filter((h) => h.date === todayStr)

    const hasTodayHabits = todayHabits.length > 0
    const displayedHabits = hasTodayHabits
        ? todayHabits
        : habits
            .filter((h) => h.date && h.date > todayStr)
            .sort((a, b) => a.date.localeCompare(b.date))

    const completedCount = displayedHabits.filter((h) => h.completed).length
    const totalCount = displayedHabits.length
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    const formatDay = (dateStr: string) => {
        try {
            const date = new Date(dateStr)
            return date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })
        } catch {
            return dateStr
        }
    }

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col justify-between h-full hover:border-border/85 transition-colors shadow-xs">
            <div className="bg-orange-500/10 dark:bg-orange-500/5 px-4 py-3 border-b border-orange-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-xl bg-orange-500 text-white shadow-xs shrink-0">
                        <Flame className="h-3.5 w-3.5" />
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                            {hasTodayHabits
                                ? t("habitsWidget.routine", { defaultValue: "Rutina Diaria" })
                                : t("habitsWidget.upcoming", { defaultValue: "Próximos Días" })}
                        </span>
                        <h3 className="text-xs font-semibold">
                            {hasTodayHabits
                                ? t("habitsWidget.title", { defaultValue: "Hábitos de Hoy" })
                                : t("habitsWidget.upcomingTitle", { defaultValue: "Próximos Hábitos" })}
                        </h3>
                    </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500 text-white shadow-xs shrink-0">
                    {completedCount}/{totalCount} ({progressPercentage}%)
                </span>
            </div>

            <div className="p-4 space-y-2 min-h-[170px] flex flex-col justify-start flex-1">
                {displayedHabits.length === 0 ? (
                    <div className="text-center py-6 my-auto">
                        <Sparkles className="h-5 w-5 mx-auto text-muted-foreground/50 mb-1" />
                        <p className="text-xs text-muted-foreground">
                            {t("habitsWidget.empty", { defaultValue: "No hay hábitos próximos registrados." })}
                        </p>
                    </div>
                ) : (
                    displayedHabits.slice(0, 3).map((habit) => (
                        <button
                            key={habit.id}
                            type="button"
                            onClick={() => toggleHabit(habit.id)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer text-left group border ${habit.completed
                                    ? "bg-accent/30 border-border/40 opacity-75"
                                    : "bg-accent/60 border-border/60 hover:bg-accent"
                                }`}
                        >
                            <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                                {habit.completed ? (
                                    <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0 transition-transform scale-110" />
                                ) : (
                                    <Circle className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                                )}
                                <span
                                    className={`text-xs truncate ${habit.completed
                                            ? "line-through text-muted-foreground font-normal"
                                            : "font-semibold text-foreground"
                                        }`}
                                >
                                    {habit.name}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                                {!hasTodayHabits && habit.date && (
                                    <span className="flex items-center gap-1 text-[10px] text-orange-600 dark:text-orange-400 font-medium bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20">
                                        <Calendar className="h-3 w-3 shrink-0" />
                                        <span>{formatDay(habit.date)}</span>
                                    </span>
                                )}

                                {habit.time && (
                                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground px-2 py-0.5 rounded-lg border border-border/30 bg-background/50">
                                        <Clock className="h-3 w-3 shrink-0" />
                                        <span>{habit.time}</span>
                                    </span>
                                )}
                            </div>
                        </button>
                    ))
                )}
            </div>

            <Link
                to="/calendar"
                className="px-4 py-2.5 bg-accent/20 flex items-center justify-between text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors border-t border-border/40"
            >
                <span>{t("habitsWidget.manage", { defaultValue: "Gestionar rutina completa" })}</span>
                <ArrowRight className="h-3 w-3 shrink-0" />
            </Link>
        </div>
    )
}