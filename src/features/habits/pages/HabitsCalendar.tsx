import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useHabitsStore, type HabitEvent } from "../stores/useHabitsStore"
import { useTranslation } from "react-i18next"

const NO_TIME_PLACEHOLDER = "--:--"

interface HabitsCalendarProps {
    selectedDate: string
    onSelectDate: (date: string) => void
    onSelectHabitToEdit: (habit: HabitEvent) => void
    onOpenNewForm: (dateStr: string) => void
}

export function HabitsCalendar({
    selectedDate,
    onSelectDate,
    onSelectHabitToEdit,
    onOpenNewForm,
}: HabitsCalendarProps) {
    const { t, i18n } = useTranslation()
    const { habits } = useHabitsStore()

    const [currentMonth, setCurrentMonth] = useState(new Date())

    const prevMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        )
    }

    const nextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        )
    }

    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    let startingDayOfWeek = firstDayOfMonth.getDay() - 1
    if (startingDayOfWeek === -1) startingDayOfWeek = 6

    const daysInMonth = lastDayOfMonth.getDate()

    const calendarDays = []
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            i
        ).padStart(2, "0")}`
        calendarDays.push({ dayNumber: i, dateStr: formattedDate })
    }

    const currentMonthName = new Intl.DateTimeFormat(i18n.language, {
        month: "long",
    }).format(currentMonth)

    const weekDays = [1, 2, 3, 4, 5, 6, 0].map((dayIndex) => {
        const refDate = new Date(2024, 0, 1 + ((dayIndex + 6) % 7))
        return new Intl.DateTimeFormat(i18n.language, { weekday: "short" }).format(
            refDate
        )
    })

    return (
        <div className="h-full flex flex-col min-h-0 rounded-2xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 shrink-0">
                <h2 className="text-sm font-bold capitalize">
                    {currentMonthName} {year}
                </h2>
                <div className="flex items-center gap-1">
                    <button
                        onClick={prevMonth}
                        className="p-1.5 rounded-xl border border-border bg-card hover:bg-secondary transition-colors cursor-pointer shadow-xs"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setCurrentMonth(new Date())}
                        className="px-2.5 py-1 text-xs font-medium border border-border bg-card rounded-xl hover:bg-secondary transition-colors cursor-pointer shadow-xs"
                    >
                        {t("habits.calendar.today", "Hoy")}
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-1.5 rounded-xl border border-border bg-card hover:bg-secondary transition-colors cursor-pointer shadow-xs"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-muted-foreground uppercase tracking-wider mb-2 shrink-0">
                {weekDays.map((day) => (
                    <div key={day} className="py-1 capitalize">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-fr gap-1.5 flex-1 min-h-0">
                {calendarDays.map((item, index) => {
                    if (!item) {
                        return (
                            <div
                                key={`empty-${index}`}
                                className="rounded-xl bg-secondary/10 border border-transparent h-full"
                            />
                        )
                    }

                    const isSelected = item.dateStr === selectedDate
                    const isToday =
                        item.dateStr === new Date().toISOString().split("T")[0]

                    const dayEvents = habits
                        .filter((h) => h.date === item.dateStr)
                        .sort((a, b) => {
                            const timeA = a.time || NO_TIME_PLACEHOLDER
                            const timeB = b.time || NO_TIME_PLACEHOLDER

                            if (timeA === NO_TIME_PLACEHOLDER && timeB === NO_TIME_PLACEHOLDER) return 0
                            if (timeA === NO_TIME_PLACEHOLDER) return 1
                            if (timeB === NO_TIME_PLACEHOLDER) return -1
                            return timeA.localeCompare(timeB)
                        })

                    return (
                        <div
                            key={item.dateStr}
                            onClick={() => onSelectDate(item.dateStr)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-full min-h-0 ${isSelected
                                ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs"
                                : "border-border/60 hover:border-border bg-card hover:bg-accent/40 shadow-xs"
                                }`}
                        >
                            <div className="flex items-center justify-between shrink-0">
                                <span
                                    className={`text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full ${isToday
                                        ? "bg-primary text-primary-foreground"
                                        : "text-foreground hover:bg-secondary"
                                        }`}
                                >
                                    {item.dayNumber}
                                </span>

                                {dayEvents.length > 0 && (
                                    <div className="md:hidden h-1.5 w-1.5 rounded-full bg-primary" />
                                )}

                                {isSelected && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onOpenNewForm(item.dateStr)
                                        }}
                                        className="hidden md:flex text-muted-foreground hover:text-primary p-0.5 hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                                        title={t("habits.calendar.add", "Añadir tarea")}
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>

                            <div className="hidden md:flex flex-col space-y-1 mt-1 overflow-y-auto flex-1 scrollbar-none pr-0.5">
                                {dayEvents.map((evt) => {
                                    const hasTime = evt.time && evt.time !== NO_TIME_PLACEHOLDER

                                    return (
                                        <div
                                            key={evt.id}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onSelectHabitToEdit(evt)
                                            }}
                                            className={`text-[10px] px-1.5 py-0.5 rounded-lg truncate flex items-center justify-between gap-1 border transition-all ${evt.completed
                                                ? "bg-secondary/40 text-muted-foreground line-through border-transparent"
                                                : "bg-primary/10 text-primary font-medium border-primary/20 hover:bg-primary/20"
                                                }`}
                                        >
                                            {hasTime && (
                                                <span className="font-semibold shrink-0">
                                                    {evt.time}
                                                    {evt.timeEnd ? ` - ${evt.timeEnd}` : ""}
                                                </span>
                                            )}
                                            <span className="truncate">{evt.name}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}