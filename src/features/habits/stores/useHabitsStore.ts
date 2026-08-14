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
} from "firebase/firestore"

export interface HabitEvent {
    id: string
    name: string
    category: string
    date: string
    time: string
    timeEnd?: string
    completed: boolean
    color?: string
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

                const id = data.id || crypto.randomUUID()
                const habitRef = doc(db, "users", userId, "habits", id)

                const habitData: HabitEvent = {
                    name: data.name,
                    category: data.category,
                    date: data.date,
                    time: data.time,
                    timeEnd: data.timeEnd || "",
                    id,
                    completed: false,
                    color: data.color || "#3b82f6",
                }

                await setDoc(habitRef, habitData)
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