import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useAuthStore } from "@/shared/stores/useAuthStore"
import { db } from "@/shared/lib/firebase"
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    query,
    writeBatch
} from "firebase/firestore"

export interface HabitEvent {
    id: string
    name: string
    category: string
    date: string
    time: string
    timeEnd?: string
    completed: boolean
    recurrence?: "none" | "daily" | "weekly"
    daysOfWeek?: number[]
}

interface HabitsState {
    habits: HabitEvent[]
    subscribeToHabits: () => () => void
    addHabit: (event: Omit<HabitEvent, "id" | "completed"> & { id?: string }) => Promise<void>
    editHabit: (id: string, updated: Partial<Omit<HabitEvent, "id">>) => Promise<void>
    deleteHabit: (id: string) => Promise<void>
    toggleHabit: (id: string) => Promise<void>
}

export const useHabitsStore = create<HabitsState>()(
    persist(
        (set, get) => ({
            habits: [],

            subscribeToHabits: () => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return () => { }

                const habitsRef = collection(db, "users", userId, "habits")
                const q = query(habitsRef)

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const habitsData = snapshot.docs.map((docSnap) => ({
                        ...(docSnap.data() as HabitEvent),
                        id: docSnap.id,
                    }))

                    set({ habits: habitsData })
                })

                return unsubscribe
            },

            addHabit: async (data) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const recurrence = data.recurrence || "none"

                if (recurrence === "none") {
                    const id = data.id || crypto.randomUUID()
                    const habitRef = doc(db, "users", userId, "habits", id)

                    const habitData: HabitEvent = {
                        ...data,
                        timeEnd: data.timeEnd || "",
                        id,
                        completed: false,
                    }

                    await setDoc(habitRef, habitData)
                } else {
                    const batch = writeBatch(db)
                    const startDate = new Date(data.date + "T00:00:00")
                    const iterations = recurrence === "daily" ? 14 : 28

                    for (let i = 0; i < iterations; i++) {
                        const currentDate = new Date(startDate)
                        currentDate.setDate(startDate.getDate() + i)

                        if (recurrence === "weekly") {
                            const dayIndex = currentDate.getDay()
                            const selectedDays = data.daysOfWeek || []
                            if (!selectedDays.includes(dayIndex)) continue
                        }

                        const year = currentDate.getFullYear()
                        const month = String(currentDate.getMonth() + 1).padStart(2, "0")
                        const day = String(currentDate.getDate()).padStart(2, "0")
                        const formattedDate = `${year}-${month}-${day}`

                        const id = crypto.randomUUID()
                        const habitRef = doc(db, "users", userId, "habits", id)

                        const habitData: HabitEvent = {
                            ...data,
                            date: formattedDate,
                            timeEnd: data.timeEnd || "",
                            id,
                            completed: false,
                        }

                        batch.set(habitRef, habitData)
                    }

                    await batch.commit()
                }
            },

            editHabit: async (id, updated) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const habitRef = doc(db, "users", userId, "habits", id)
                await setDoc(habitRef, updated, { merge: true })
            },

            deleteHabit: async (id) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const habitRef = doc(db, "users", userId, "habits", id)
                await deleteDoc(habitRef)
            },

            toggleHabit: async (id) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const habit = get().habits.find((h) => h.id === id)
                if (!habit) return

                const habitRef = doc(db, "users", userId, "habits", id)
                await setDoc(habitRef, { completed: !habit.completed }, { merge: true })
            },
        }),
        {
            name: "lifeos-habits-storage",
        }
    )
)