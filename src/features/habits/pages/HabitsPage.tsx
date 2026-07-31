import { useState } from "react"
import { HabitsWidget } from "./HabitsWidget"
import { HabitForm } from "./HabitForm"
import { useTranslation } from "react-i18next"
import type { HabitEvent } from "../stores/useHabitsStore"

export default function HabitsPage() {
    const { t } = useTranslation()
    const todayStr = new Date().toISOString().split("T")[0]
    const [selectedDate, setSelectedDate] = useState<string>(todayStr)
    const [editingHabit, setEditingHabit] = useState<HabitEvent | null>(null)

    return (
        <div className="space-y-6 p-6 max-w-5xl mx-auto">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight">
                    {t("habits.page.title", "Agenda & Hábitos")}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {t(
                        "habits.page.subtitle",
                        "Organiza tus rutinas y tareas diarias asignando horarios claros."
                    )}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-5 items-start">
                <div className="md:col-span-3">
                    <HabitsWidget
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                        onEditHabit={(habit) => setEditingHabit(habit)}
                    />
                </div>

                <div className="md:col-span-2">
                    <HabitForm
                        selectedDate={selectedDate}
                        editingHabit={editingHabit}
                        onCancelEdit={() => setEditingHabit(null)}
                    />
                </div>
            </div>
        </div>
    )
}