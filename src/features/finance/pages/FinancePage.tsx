import { useFinanceStore } from "../stores/useFinanceStore"
import {
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Trash2,
    PiggyBank,
    PlusCircle,
    LayoutDashboard,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { TransactionForm } from "./TransactionForm"
import { CreateFundForm } from "./CreateFundForm"

export function FinancePage() {
    const { t } = useTranslation()
    const { transactions, funds, getBalance, deleteTransaction, addFundsToFund, deleteFund, subscribeToFinance } =
        useFinanceStore()
    const [fundingAmount, setFundingAmount] = useState<string>("")
    const [userSelectedId, setUserSelectedId] = useState<string>("")
    const [activeTab, setActiveTab] = useState<"dashboard" | "forms">("dashboard")

    useEffect(() => {
        const unsubscribe = subscribeToFinance()
        return () => {
            unsubscribe()
        }
    }, [subscribeToFinance])

    const selectedFundId =
        funds.find((f) => f.id === userSelectedId)?.id || funds[0]?.id || ""

    const balance = getBalance()

    const totalIncomes = transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0)

    const totalExpenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0)

    const handleAddSavings = (e: React.FormEvent) => {
        e.preventDefault()
        const amount = parseFloat(fundingAmount)
        if (isNaN(amount) || amount <= 0 || !selectedFundId) return

        addFundsToFund(selectedFundId, amount)
        setFundingAmount("")
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-3 sm:p-4 space-y-3 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-2.5 gap-2">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                        {t("finance.title", "Panel Financiero")}
                    </h1>
                    <p className="text-[11px] text-muted-foreground">
                        {t("finance.subtitle", "Controla tu balance, ingresos, gastos y metas.")}
                    </p>
                </div>

                <div className="flex items-center gap-1 bg-secondary/60 p-1 rounded-xl self-start sm:self-auto border border-border/40">
                    <button
                        onClick={() => setActiveTab("dashboard")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${activeTab === "dashboard"
                            ? "bg-background text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        {t("finance.tabDashboard", "Resumen")}
                    </button>
                    <button
                        onClick={() => setActiveTab("forms")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${activeTab === "forms"
                            ? "bg-background text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <PlusCircle className="h-3.5 w-3.5" />
                        {t("finance.tabForms", "Nuevo Registro")}
                    </button>
                </div>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-3 shadow-xs flex items-center justify-between">
                    <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                            {t("finance.totalBalance", "Balance Total")}
                        </span>
                        <p
                            className={`text-lg sm:text-xl font-bold tracking-tight ${balance >= 0 ? "text-foreground" : "text-destructive"
                                }`}
                        >
                            {balance.toFixed(2)} €
                        </p>
                    </div>
                    <div className="p-2 bg-secondary rounded-lg text-muted-foreground shrink-0">
                        <Wallet className="h-4 w-4" />
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-3 shadow-xs flex items-center justify-between">
                    <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                            {t("finance.totalIncomes", "Ingresos Totales")}
                        </span>
                        <p className="text-lg sm:text-xl font-bold tracking-tight text-emerald-500">
                            +{totalIncomes.toFixed(2)} €
                        </p>
                    </div>
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 shrink-0">
                        <ArrowUpRight className="h-4 w-4" />
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-3 shadow-xs flex items-center justify-between">
                    <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                            {t("finance.totalExpenses", "Gastos Totales")}
                        </span>
                        <p className="text-lg sm:text-xl font-bold tracking-tight text-destructive">
                            -{totalExpenses.toFixed(2)} €
                        </p>
                    </div>
                    <div className="p-2 bg-destructive/10 rounded-lg text-destructive shrink-0">
                        <ArrowDownRight className="h-4 w-4" />
                    </div>
                </div>
            </div>

            {activeTab === "dashboard" ? (
                <div className="grid gap-3 md:grid-cols-2 items-start">
                    <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs space-y-2.5">
                        <h3 className="font-semibold text-xs flex items-center gap-1.5">
                            <Target className="h-3.5 w-3.5 text-primary shrink-0" />
                            {t("finance.savingsGoals", "Objetivos de Ahorro")}
                        </h3>

                        <div className="space-y-2">
                            {funds.length === 0 ? (
                                <div className="text-center py-3 border border-dashed border-border rounded-lg bg-accent/20">
                                    <p className="text-[11px] text-muted-foreground">
                                        {t("finance.noFunds", "No hay objetivos creados.")}
                                    </p>
                                </div>
                            ) : (
                                funds.map((fund) => {
                                    const progress = Math.min(
                                        100,
                                        Math.round((fund.current / fund.target) * 100)
                                    )
                                    return (
                                        <div
                                            key={fund.id}
                                            className="space-y-1.5 border border-border/60 p-2.5 rounded-lg bg-accent/20"
                                        >
                                            <div className="flex justify-between items-center text-xs">
                                                <div>
                                                    <span className="font-medium truncate block">
                                                        {fund.name}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {fund.current.toFixed(2)} € / {fund.target.toFixed(2)} €
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                                        {progress}%
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteFund(fund.id)}
                                                        className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-destructive/10 cursor-pointer transition-colors"
                                                        title={t("finance.deleteFund", "Eliminar objetivo")}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        {funds.length > 0 && (
                            <form
                                onSubmit={handleAddSavings}
                                className="flex gap-2 pt-2 border-t border-border/40"
                            >
                                <select
                                    value={selectedFundId}
                                    onChange={(e) => setUserSelectedId(e.target.value)}
                                    className="h-7 rounded-lg border border-input bg-background px-2 text-[11px] focus:outline-none"
                                >
                                    {funds.map((f) => (
                                        <option key={f.id} value={f.id}>
                                            {f.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    step="any"
                                    placeholder={t("finance.addAmountPlaceholder", "Importe...")}
                                    value={fundingAmount}
                                    onChange={(e) => setFundingAmount(e.target.value)}
                                    className="h-7 flex-1 rounded-lg border border-input bg-background px-2 text-[11px] focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="h-7 px-2.5 bg-secondary text-foreground border border-border rounded-lg text-[11px] font-medium flex items-center gap-1 cursor-pointer shrink-0"
                                >
                                    <PiggyBank className="h-3 w-3" />
                                    {t("finance.saveButton", "Ahorrar")}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs space-y-2.5">
                        <h3 className="font-semibold text-xs">
                            {t("finance.recentTransactions", "Movimientos Recientes")}
                        </h3>

                        {transactions.length === 0 ? (
                            <div className="text-center py-3 border border-dashed border-border rounded-lg bg-accent/20">
                                <p className="text-[11px] text-muted-foreground">
                                    {t("finance.noTransactions", "No hay transacciones registradas.")}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                                {transactions.map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="flex items-center justify-between p-2 border border-border/60 rounded-lg bg-accent/20"
                                    >
                                        <div className="min-w-0 pr-2">
                                            <p className="text-xs font-medium truncate">{tx.description}</p>
                                            <span className="text-[10px] text-muted-foreground">
                                                {tx.category} • {tx.date}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span
                                                className={`text-xs font-semibold ${tx.type === "income"
                                                    ? "text-emerald-500"
                                                    : "text-destructive"
                                                    }`}
                                            >
                                                {tx.type === "income" ? "+" : "-"}
                                                {tx.amount.toFixed(2)} €
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => deleteTransaction(tx.id)}
                                                className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-destructive/10 cursor-pointer"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid gap-3 md:grid-cols-2 items-start">
                    <TransactionForm />
                    <CreateFundForm />
                </div>
            )}
        </div>
    )
}