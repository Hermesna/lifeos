import { create } from "zustand";

export interface Habit {
  id: string;
  name: string;
  history: number[];
  streak: number;
}

interface HabitsState {
  habits: Habit[];
  toggleHabitToday: (id: string) => void;
  addHabit: (name: string, category: string) => void;
}

export const useHabitsStore = create<HabitsState>((set) => ({
  habits: [
    {
      id: "french",
      name: "French Study",
      history: [1, 1, 0, 1, 1, 1, 1],
      streak: 5,
    },
    {
      id: "code",
      name: "LeetCode / Side Project",
      history: [1, 0, 1, 1, 0, 1, 1],
      streak: 2,
    },
    {
      id: "workout",
      name: "Gym / Workout",
      history: [0, 1, 0, 1, 0, 1, 0],
      streak: 1,
    },
  ],

  toggleHabitToday: (id) =>
    set((state) => ({
      habits: state.habits.map((habit) => {
        if (habit.id !== id) return habit;

        const newHistory = [...habit.history];
        const lastIndex = newHistory.length - 1;
        const currentStatus = newHistory[lastIndex];
        const newStatus = currentStatus === 1 ? 0 : 1;
        newHistory[lastIndex] = newStatus;

        const newStreak =
          newStatus === 1 ? habit.streak + 1 : Math.max(0, habit.streak - 1);

        return {
          ...habit,
          history: newHistory,
          streak: newStreak,
        };
      }),
    })),

  addHabit: (name) =>
    set((state) => ({
      habits: [
        ...state.habits,
        {
          id: crypto.randomUUID(),
          name,
          history: [0, 0, 0, 0, 0, 0, 0],
          streak: 0,
        },
      ],
    })),
}));
