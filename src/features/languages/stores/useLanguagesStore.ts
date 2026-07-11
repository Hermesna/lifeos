import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StudyCategory = "vocabulary" | "listening" | "grammar" | "speaking";

export interface StudySession {
  id: string;
  date: string;
  category: StudyCategory;
  duration: number;
  notes?: string;
}

interface LanguagesState {
  sessions: StudySession[];
  targetLanguage: string;
  currentLevel: string;
  addSession: (session: Omit<StudySession, "id" | "date">) => void;
  deleteSession: (id: string) => void;
  clearHistory: () => void;
}

export const useLanguagesStore = create<LanguagesState>()(
  persist(
    (set) => ({
      sessions: [],
      targetLanguage: "Francés",
      currentLevel: "A1",

      addSession: (newSession) =>
        set((state) => ({
          sessions: [
            {
              ...newSession,
              id: crypto.randomUUID(),
              date: new Date().toISOString().split("T")[0],
            },
            ...state.sessions,
          ],
        })),

      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((session) => session.id !== id),
        })),

      clearHistory: () => set({ sessions: [] }),
    }),
    {
      name: "lifeos-languages-storage",
    },
  ),
);
