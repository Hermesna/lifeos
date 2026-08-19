import { useHabitsStore } from "@/features/habits/stores/useHabitsStore"
import { useAuthStore } from "@/shared/stores/useAuthStore"
import { db } from "@/shared/lib/firebase"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    query,
    type Unsubscribe
} from "firebase/firestore"
import i18n from "@/i18n"

export type StudyCategory = "vocabulary" | "listening" | "grammar" | "speaking"

export interface Session {
    id: string
    language: string
    category: StudyCategory
    duration: number
    notes?: string
    date: string
    name?: string
}

export interface LanguagesState {
    sessions: Session[]
    targetLanguage: string
    userLanguages: string[]
    levelsByLanguage: Record<string, string>

    subscribeToLanguages: () => Unsubscribe
    addSession: (sessionData: Omit<Session, "id">) => Promise<void>
    deleteSession: (id: string) => Promise<void>
    setTargetLanguage: (language: string) => Promise<void>
    addUserLanguage: (language: string) => Promise<void>
    setCurrentLevel: (language: string, level: string) => Promise<void>
    updateLanguageName: (oldName: string, newName: string) => Promise<void>
    deleteLanguage: (language: string) => Promise<void>
}

export const useLanguagesStore = create<LanguagesState>()(
    persist(
        (set, get) => ({
            sessions: [],
            targetLanguage: "",
            userLanguages: [],
            levelsByLanguage: {},

            subscribeToLanguages: () => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return () => { }

                const sessionsRef = collection(db, "users", userId, "language_sessions")
                const settingsRef = doc(db, "users", userId, "settings", "languages")

                const unsubscribeSessions = onSnapshot(query(sessionsRef), (snapshot) => {
                    const sessionsData = snapshot.docs.map((docSnap) => ({
                        ...(docSnap.data() as Session),
                        id: docSnap.id,
                    }))
                    set({ sessions: sessionsData })
                })

                const unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data()
                        set({
                            targetLanguage: data.targetLanguage ?? "",
                            userLanguages: data.userLanguages ?? [],
                            levelsByLanguage: data.levelsByLanguage ?? {},
                        })
                    }
                })

                return () => {
                    unsubscribeSessions()
                    unsubscribeSettings()
                }
            },

            setTargetLanguage: async (language: string) => {
                const userId = useAuthStore.getState().user?.id
                set({ targetLanguage: language })

                if (userId) {
                    const settingsRef = doc(db, "users", userId, "settings", "languages")
                    await setDoc(settingsRef, {
                        targetLanguage: language,
                        userLanguages: get().userLanguages,
                        levelsByLanguage: get().levelsByLanguage
                    }, { merge: true })
                }
            },

            addUserLanguage: async (language: string) => {
                const { userLanguages, levelsByLanguage } = get()
                const userId = useAuthStore.getState().user?.id

                const trimmedLanguage = language.trim()
                if (trimmedLanguage && !userLanguages.includes(trimmedLanguage)) {
                    const updatedLanguages = [...userLanguages, trimmedLanguage]
                    const updatedLevels = {
                        ...levelsByLanguage,
                        [trimmedLanguage]: "A1",
                    }

                    set({
                        userLanguages: updatedLanguages,
                        targetLanguage: trimmedLanguage,
                        levelsByLanguage: updatedLevels,
                    })

                    if (userId) {
                        const settingsRef = doc(db, "users", userId, "settings", "languages")
                        await setDoc(settingsRef, {
                            userLanguages: updatedLanguages,
                            targetLanguage: trimmedLanguage,
                            levelsByLanguage: updatedLevels,
                        }, { merge: true })
                    }
                }
            },

            setCurrentLevel: async (language: string, level: string) => {
                const userId = useAuthStore.getState().user?.id
                const updatedLevels = {
                    ...get().levelsByLanguage,
                    [language]: level,
                }

                set(() => ({
                    levelsByLanguage: updatedLevels,
                }))

                if (userId) {
                    const settingsRef = doc(db, "users", userId, "settings", "languages")
                    await setDoc(settingsRef, { levelsByLanguage: updatedLevels }, { merge: true })
                }
            },

            updateLanguageName: async (oldName: string, newName: string) => {
                const { userLanguages, targetLanguage, levelsByLanguage, sessions } = get()
                const userId = useAuthStore.getState().user?.id

                const trimmedNewName = newName.trim()
                if (!trimmedNewName || userLanguages.includes(trimmedNewName) || oldName === trimmedNewName) return

                const updatedLanguages = userLanguages.map(lang => lang === oldName ? trimmedNewName : lang)
                const updatedTarget = targetLanguage === oldName ? trimmedNewName : targetLanguage

                const updatedLevels = { ...levelsByLanguage }
                if (updatedLevels[oldName]) {
                    updatedLevels[trimmedNewName] = updatedLevels[oldName]
                    delete updatedLevels[oldName]
                }

                const updatedSessions = sessions.map(s => s.language === oldName ? { ...s, language: trimmedNewName } : s)

                set({
                    userLanguages: updatedLanguages,
                    targetLanguage: updatedTarget,
                    levelsByLanguage: updatedLevels,
                    sessions: updatedSessions,
                })

                if (userId) {
                    const settingsRef = doc(db, "users", userId, "settings", "languages")
                    await setDoc(settingsRef, {
                        userLanguages: updatedLanguages,
                        targetLanguage: updatedTarget,
                        levelsByLanguage: updatedLevels,
                    }, { merge: true })

                    const affectedSessions = sessions.filter(s => s.language === oldName)
                    for (const session of affectedSessions) {
                        const sessionRef = doc(db, "users", userId, "language_sessions", session.id)
                        await setDoc(sessionRef, { language: trimmedNewName }, { merge: true })
                    }
                }
            },

            deleteLanguage: async (language: string) => {
                const { userLanguages, targetLanguage, levelsByLanguage, sessions } = get()
                const userId = useAuthStore.getState().user?.id

                const updatedLanguages = userLanguages.filter(lang => lang !== language)
                
                const updatedTarget = targetLanguage === language 
                    ? (updatedLanguages[0] || "") 
                    : targetLanguage

                const updatedLevels = { ...levelsByLanguage }
                delete updatedLevels[language]

                const sessionsToDelete = sessions.filter(s => s.language === language)
                const remainingSessions = sessions.filter(s => s.language !== language)

                set({
                    userLanguages: updatedLanguages,
                    targetLanguage: updatedTarget,
                    levelsByLanguage: updatedLevels,
                    sessions: remainingSessions,
                })

                if (userId) {
                    const settingsRef = doc(db, "users", userId, "settings", "languages")
                    await setDoc(settingsRef, {
                        userLanguages: updatedLanguages,
                        targetLanguage: updatedTarget,
                        levelsByLanguage: updatedLevels,
                    }, { merge: true })

                    for (const session of sessionsToDelete) {
                        const sessionRef = doc(db, "users", userId, "language_sessions", session.id)
                        await deleteDoc(sessionRef)
                        await useHabitsStore.getState().deleteHabit(session.id)
                    }
                }
            },

            addSession: async (sessionData) => {
                const userId = useAuthStore.getState().user?.id
                const id = crypto.randomUUID()
                const newSession: Session = { ...sessionData, id }

                set((state) => ({
                    sessions: [newSession, ...state.sessions],
                }))

                if (userId) {
                    const sessionRef = doc(db, "users", userId, "language_sessions", id)
                    await setDoc(sessionRef, newSession)
                }

                const habitName = i18n.t("languages.habitTitle", {
                    language: newSession.language,
                    duration: newSession.duration,
                    defaultValue: `Estudio de ${newSession.language} (${newSession.duration} min)`,
                })

                await useHabitsStore.getState().addHabit({
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

            deleteSession: async (id) => {
                const userId = useAuthStore.getState().user?.id

                set((state) => ({
                    sessions: state.sessions.filter((s) => s.id !== id),
                }))

                if (userId) {
                    const sessionRef = doc(db, "users", userId, "language_sessions", id)
                    await deleteDoc(sessionRef)
                }

                await useHabitsStore.getState().deleteHabit(id)
            },
        }),
        {
            name: "lifeos-languages-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
)