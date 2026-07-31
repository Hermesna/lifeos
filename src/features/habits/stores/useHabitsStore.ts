import { create } from "zustand"

export interface HabitEvent {
    id: string
    name: string
    category: string
    date: string // Formato "YYYY-MM-DD"
    time: string // Formato "HH:mm"
    completed: boolean
}

interface HabitsState {
    habits: HabitEvent[]
    addHabit: (event: Omit<HabitEvent, "id" | "completed">) => void
    editHabit: (id: string, updated: Partial<Omit<HabitEvent, "id">>) => void
    deleteHabit: (id: string) => void
    toggleHabit: (id: string) => void
}

export const useHabitsStore = create<HabitsState>((set) => ({
    habits: [
        {
            id: "1",
            name: "Estudiar Francés",
            category: "languages",
            date: new Date().toISOString().split("T")[0],
            time: "09:00",
            completed: false,
        },
        {
            id: "2",
            name: "Gimnasio / Rutina",
            category: "health",
            date: new Date().toISOString().split("T")[0],
            time: "18:00",
            completed: true,
        },
    ],

    addHabit: (data) =>
        set((state) => ({
            habits: [
                ...state.habits,
                {
                    ...data,
                    id: crypto.randomUUID(),
                    completed: false,
                },
            ],
        })),

    editHabit: (id, updated) =>
        set((state) => ({
            habits: state.habits.map((habit) =>
                habit.id === id ? { ...habit, ...updated } : habit
            ),
        })),

    deleteHabit: (id) =>
        set((state) => ({
            habits: state.habits.filter((habit) => habit.id !== id),
        })),

    toggleHabit: (id) =>
        set((state) => ({
            habits: state.habits.map((habit) =>
                habit.id === id ? { ...habit, completed: !habit.completed } : habit
            ),
        })),
}))