import { create } from "zustand";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import { useAuthStore } from "@/shared/stores/useAuthStore";

type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => Promise<void>;
  initThemeFromDB: (userId: string) => Promise<void>;
  syncTheme: () => void;
}

const getStoredTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
};

const applyThemeToDOM = (theme: ThemeMode) => {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  root.classList.remove("dark", "light");

  const shouldBeDark = theme === "dark" || (theme === "system" && systemDark);

  if (shouldBeDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getStoredTheme(),

  setTheme: async (newTheme: ThemeMode) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      applyThemeToDOM(newTheme);
    }
    set({ theme: newTheme });

    const user = useAuthStore.getState().user;
    if (user && user.id) {
      try {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, { theme: newTheme });
      } catch (error) {
        console.error("Error al guardar el tema en la BDD:", error);
      }
    }
  },

  initThemeFromDB: async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.theme && ["light", "dark", "system"].includes(userData.theme)) {
          const dbTheme = userData.theme as ThemeMode;
          localStorage.setItem("theme", dbTheme);
          applyThemeToDOM(dbTheme);
          set({ theme: dbTheme });
        }
      }
    } catch (error) {
      console.error("Error al obtener el tema de la BDD:", error);
    }
  },

  syncTheme: () => {
    const currentTheme = get().theme;
    applyThemeToDOM(currentTheme);
  },
}));

if (typeof window !== "undefined") {
  applyThemeToDOM(getStoredTheme());

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "system" || !currentTheme) {
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  });
}