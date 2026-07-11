import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

export interface SavingsFund {
  id: string;
  name: string;
  target: number;
  current: number;
}

interface FinanceState {
  transactions: Transaction[];
  funds: SavingsFund[];
  addTransaction: (tx: Omit<Transaction, "id" | "date">) => void;
  deleteTransaction: (id: string) => void;
  addFundsToFund: (fundId: string, amount: number) => void;
  createFund: (fund: Omit<SavingsFund, "id" | "current">) => void;
  getBalance: () => number;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      funds: [
        {
          id: "japan-fund",
          name: "Expedición Japón 🇯🇵",
          target: 3500,
          current: 1225,
        },
      ],

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            {
              ...tx,
              id: crypto.randomUUID(),
              date: new Date().toISOString().split("T")[0],
            },
            ...state.transactions,
          ],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      createFund: (fund) =>
        set((state) => ({
          funds: [
            ...state.funds,
            { ...fund, id: crypto.randomUUID(), current: 0 },
          ],
        })),

      addFundsToFund: (fundId, amount) =>
        set((state) => {
          return {
            funds: state.funds.map((f) =>
              f.id === fundId
                ? { ...f, current: Math.max(0, f.current + amount) }
                : f,
            ),
          };
        }),

      getBalance: () => {
        return get().transactions.reduce((acc, tx) => {
          return tx.type === "income" ? acc + tx.amount : acc - tx.amount;
        }, 0);
      },
    }),
    {
      name: "lifeos-finance-storage",
    },
  ),
);
