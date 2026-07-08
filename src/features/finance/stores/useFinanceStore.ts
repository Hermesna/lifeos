import { create } from "zustand";

interface FinanceState {
  savings: number;
  targetSavings: number;
  addSavings: (amount: number) => void;
  setSavings: (amount: number) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  savings: 8000,
  targetSavings: 15000,

  addSavings: (amount) => set((state) => ({ savings: state.savings + amount })),

  setSavings: (amount) => set(() => ({ savings: amount })),
}));
