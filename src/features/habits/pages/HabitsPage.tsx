import { useState } from "react"
import { useTranslation } from "react-i18next"
import { HabitsCalendar } from "./HabitsCalendar"
import { HabitsSidebar } from "./HabitsSidebar"
import type { HabitEvent } from "../stores/useHabitsStore"

export default function HabitsPage() {
    const { t } = useTranslation()

    const todayStr = new Date().toISOString().split("T")[0]
    const [selectedDate, setSelectedDate] = useState<string>(todayStr)
    const [editingHabit, setEditingHabit] = useState<HabitEvent | null>(null)
    const [shouldFocusName, setShouldFocusName] = useState(false)

    const handleAddNewForDate = (dateStr: string) => {
        setSelectedDate(dateStr)
        setEditingHabit(null)
        setShouldFocusName(true)
    }

    return (
        <div className="w-full h-full max-h-screen p-4 flex flex-col overflow-hidden box-border">
            <div className="mb-3 shrink-0 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight leading-none">
                        {t("habits.page.title", "Agenda & Hábitos")}
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        {t(
                            "habits.page.subtitle",
                            "Visualiza tu mes y gestiona tus actividades del día."
                        )}
                    </p>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-12 items-stretch flex-1 min-h-0 overflow-hidden">
                <div className="lg:col-span-9 h-full min-h-0">
                    <HabitsCalendar
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                        onSelectHabitToEdit={(habit) => setEditingHabit(habit)}
                        onOpenNewForm={handleAddNewForDate}
                    />
                </div>

                <div className="lg:col-span-3 h-full min-h-0 overflow-y-auto pr-1">
                    <HabitsSidebar
                        selectedDate={selectedDate}
                        editingHabit={editingHabit}
                        onClearEditing={() => setEditingHabit(null)}
                        onEditHabit={(habit) => setEditingHabit(habit)}
                        shouldFocusName={shouldFocusName}
                        onFocused={() => setShouldFocusName(false)}
                    />
                </div>
            </div>
        </div>
    )
}