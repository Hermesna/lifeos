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
    type Unsubscribe
} from "firebase/firestore"

export interface Transaction {
    id: string
    description: string
    amount: number
    type: "income" | "expense"
    category: string
    date: string
}

export interface SavingsFund {
    id: string
    name: string
    target: number
    current: number
}

interface FinanceState {
    transactions: Transaction[]
    funds: SavingsFund[]
    subscribeToFinance: () => Unsubscribe
    addTransaction: (tx: Omit<Transaction, "id">) => Promise<void>
    deleteTransaction: (id: string) => Promise<void>
    createFund: (fund: Omit<SavingsFund, "id" | "current">) => Promise<void>
    addFundsToFund: (fundId: string, amount: number) => Promise<void>
    deleteFund: (id: string) => Promise<void>
    getBalance: () => number
    getTotalSavings: () => number
    getTargetSavings: () => number
}

export const useFinanceStore = create<FinanceState>()(
    persist(
        (set, get) => ({
            transactions: [],
            funds: [],

            subscribeToFinance: () => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return () => { }

                const transactionsRef = collection(db, "users", userId, "transactions")
                const fundsRef = collection(db, "users", userId, "funds")

                const unsubscribeTransactions = onSnapshot(query(transactionsRef), (snapshot) => {
                    const transactionsData = snapshot.docs.map((docSnap) => ({
                        ...(docSnap.data() as Transaction),
                        id: docSnap.id,
                    }))
                    set({ transactions: transactionsData })
                })

                const unsubscribeFunds = onSnapshot(query(fundsRef), (snapshot) => {
                    const fundsData = snapshot.docs.map((docSnap) => ({
                        ...(docSnap.data() as SavingsFund),
                        id: docSnap.id,
                    }))
                    set({ funds: fundsData })
                })

                return () => {
                    unsubscribeTransactions()
                    unsubscribeFunds()
                }
            },

            addTransaction: async (tx) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const id = crypto.randomUUID()
                const txRef = doc(db, "users", userId, "transactions", id)

                const transactionData: Transaction = {
                    ...tx,
                    id,
                    date: tx.date || new Date().toISOString().split("T")[0],
                }

                await setDoc(txRef, transactionData)
            },

            deleteTransaction: async (id) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const txRef = doc(db, "users", userId, "transactions", id)
                await deleteDoc(txRef)
            },

            createFund: async (fund) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const id = crypto.randomUUID()
                const fundRef = doc(db, "users", userId, "funds", id)

                const fundData: SavingsFund = {
                    ...fund,
                    id,
                    current: 0,
                }

                await setDoc(fundRef, fundData)
            },

            addFundsToFund: async (fundId, amount) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const fund = get().funds.find((f) => f.id === fundId)
                if (!fund) return

                const newCurrent = Math.max(0, fund.current + amount)
                const fundRef = doc(db, "users", userId, "funds", fundId)

                await setDoc(fundRef, { current: newCurrent }, { merge: true })
            },

            deleteFund: async (id) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const fundRef = doc(db, "users", userId, "funds", id)
                await deleteDoc(fundRef)
            },

            getBalance: () => {
                return get().transactions.reduce((acc, tx) => {
                    return tx.type === "income" ? acc + tx.amount : acc - tx.amount
                }, 0)
            },

            getTotalSavings: () => {
                return get().funds.reduce((acc, f) => acc + f.current, 0)
            },

            getTargetSavings: () => {
                return get().funds.reduce((acc, f) => acc + f.target, 0)
            },
        }),
        {
            name: "lifeos-finance-storage",
        }
    )
)