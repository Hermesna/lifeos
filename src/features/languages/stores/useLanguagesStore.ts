import { useHabitsStore } from "@/features/habits/stores/useHabitsStore"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import i18n from "@/i18n"

export type StudyCategory = "vocabulary" | "listening" | "grammar" | "speaking"

export interface Session {
    id: string
    language: string
    category: StudyCategory
    duration: number
    date: string
    notes?: string
}

export interface LanguagesState {
    sessions: Session[]
    targetLanguage: string
    userLanguages: string[]
    levelsByLanguage: Record<string, string>

    addSession: (sessionData: Omit<Session, "id">) => void
    deleteSession: (id: string) => void
    setTargetLanguage: (language: string) => void
    addUserLanguage: (language: string) => void
    setCurrentLevel: (language: string, level: string) => void
}

export const useLanguagesStore = create<LanguagesState>()(
    persist(
        (set, get) => ({
            sessions: [],
            targetLanguage: "Inglés",
            userLanguages: ["Inglés", "Francés", "Alemán"],
            levelsByLanguage: {
                Inglés: "B2",
                Francés: "A1",
                Alemán: "A1",
            },

            setTargetLanguage: (language: string) => {
                set({ targetLanguage: language })
            },

            addUserLanguage: (language: string) => {
                const { userLanguages, levelsByLanguage } = get()
                if (!userLanguages.includes(language)) {
                    set({
                        userLanguages: [...userLanguages, language],
                        targetLanguage: language,
                        levelsByLanguage: {
                            ...levelsByLanguage,
                            [language]: "A1",
                        },
                    })
                }
            },

            setCurrentLevel: (language: string, level: string) => {
                set((state) => ({
                    levelsByLanguage: {
                        ...state.levelsByLanguage,
                        [language]: level,
                    },
                }))
            },

            addSession: (sessionData) => {
                const id = crypto.randomUUID()
                const newSession: Session = { ...sessionData, id }

                set((state) => ({
                    sessions: [newSession, ...state.sessions],
                }))

                const habitName = i18n.t("languages.habitTitle", {
                    language: newSession.language,
                    duration: newSession.duration,
                    defaultValue: `Estudio de ${newSession.language} (${newSession.duration} min)`,
                })

                useHabitsStore.getState().addHabit({
                    id,
                    name: habitName,
                    category: "languages",
                    date: newSession.date,
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                })
            },

            deleteSession: (id) => {
                set((state) => ({
                    sessions: state.sessions.filter((s) => s.id !== id),
                }))

                useHabitsStore.getState().deleteHabit(id)
            },
        }),
        {
            name: "lifeos-languages-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
)