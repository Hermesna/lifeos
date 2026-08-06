import { useFinanceStore } from "../stores/useFinanceStore"
import {
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Trash2,
    PiggyBank,
} from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { TransactionForm } from "./TransactionForm"

export function FinancePage() {
    const { t } = useTranslation()
    const { transactions, funds, getBalance, deleteTransaction, addFundsToFund } =
        useFinanceStore()
    const [fundingAmount, setFundingAmount] = useState<string>("")
    const [selectedFundId, setSelectedFundId] = useState<string>("japan-fund")

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
        if (isNaN(amount) || amount <= 0) return

        addFundsToFund(selectedFundId, amount)
        setFundingAmount("")
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-5 pb-16">
            <div className="border-b border-border pb-3">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {t("finance.title", "Panel Financiero")}
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {t(
                        "finance.subtitle",
                        "Controla tu balance, ingresos, gastos y metas de ahorro."
                    )}
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            {t("finance.totalBalance", "Balance Total")}
                        </span>
                        <p
                            className={`text-xl sm:text-2xl font-bold tracking-tight ${
                                balance >= 0 ? "text-foreground" : "text-destructive"
                            }`}
                        >
                            {balance.toFixed(2)} €
                        </p>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-secondary rounded-2xl text-muted-foreground shadow-xs shrink-0">
                        <Wallet className="h-5 w-5" />
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            {t("finance.totalIncomes", "Ingresos Totales")}
                        </span>
                        <p className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-500">
                            +{totalIncomes.toFixed(2)} €
                        </p>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 shadow-xs shrink-0">
                        <ArrowUpRight className="h-5 w-5" />
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            {t("finance.totalExpenses", "Gastos Totales")}
                        </span>
                        <p className="text-xl sm:text-2xl font-bold tracking-tight text-destructive">
                            -{totalExpenses.toFixed(2)} €
                        </p>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-destructive/10 rounded-2xl text-destructive shadow-xs shrink-0">
                        <ArrowDownRight className="h-5 w-5" />
                    </div>
                </div>
            </div>

            <div className="grid gap-5 md:grid-cols-5 items-start">
                <div className="md:col-span-3 space-y-5">
                    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-3">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary shrink-0" />{" "}
                            {t("finance.savingsGoals", "Objetivos de Ahorro")}
                        </h3>

                        <div className="space-y-2.5">
                            {funds.map((fund) => {
                                const progress = Math.min(
                                    100,
                                    Math.round((fund.current / fund.target) * 100)
                                )
                                return (
                                    <div
                                        key={fund.id}
                                        className="space-y-2 border border-border/60 p-3.5 rounded-xl bg-accent/30"
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold truncate">{fund.name}</p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                                    {t(
                                                        "finance.fundProgress",
                                                        "{{current}} € de {{target}} €",
                                                        {
                                                            current: fund.current.toFixed(0),
                                                            target: fund.target.toFixed(0),
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full shrink-0">
                                                {progress}%
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {funds.length > 0 && (
                            <form
                                onSubmit={handleAddSavings}
                                className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-border/40"
                            >
                                <select
                                    value={selectedFundId}
                                    onChange={(e) => setSelectedFundId(e.target.value)}
                                    className="h-9 rounded-xl border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring shadow-xs"
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
                                    placeholder={t(
                                        "finance.addAmountPlaceholder",
                                        "Aportar importe (ej. 50)..."
                                    )}
                                    value={fundingAmount}
                                    onChange={(e) => setFundingAmount(e.target.value)}
                                    className="h-9 flex-1 rounded-xl border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shadow-xs"
                                />
                                <button
                                    type="submit"
                                    className="h-9 px-3.5 bg-secondary text-foreground border border-border rounded-xl hover:bg-secondary/85 transition-colors flex items-center justify-center gap-1.5 text-xs font-medium shadow-xs cursor-pointer shrink-0"
                                >
                                    <PiggyBank className="h-3.5 w-3.5 shrink-0" />{" "}
                                    {t("finance.saveButton", "Ahorrar")}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-3">
                        <h3 className="font-semibold text-sm">
                            {t("finance.recentTransactions", "Movimientos Recientes")}
                        </h3>

                        {transactions.length === 0 ? (
                            <div className="text-center py-6 border border-dashed border-border rounded-xl bg-accent/20">
                                <p className="text-xs text-muted-foreground">
                                    {t(
                                        "finance.noTransactions",
                                        "No hay transacciones registradas todavía."
                                    )}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                {transactions.map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="flex items-center justify-between p-2.5 sm:p-3 border border-border/60 rounded-xl bg-accent/20 hover:bg-accent/40 transition-colors"
                                    >
                                        <div className="space-y-0.5 min-w-0 pr-2">
                                            <p className="text-xs font-medium truncate">{tx.description}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                <span className="bg-secondary px-1.5 py-0.5 rounded-md font-medium">
                                                    {tx.category}
                                                </span>
                                                <span>{tx.date}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2.5 shrink-0">
                                            <span
                                                className={`text-xs font-semibold ${
                                                    tx.type === "income"
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
                                                className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
                                                title={t("finance.deleteTransaction", "Eliminar movimiento")}
                                            >
                                                <Trash2 className="h-3.5 w-3.5 shrink-0" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2">
                    <TransactionForm />
                </div>
            </div>
        </div>
    )
}