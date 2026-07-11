import { useFinanceStore } from "../stores/useFinanceStore";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Trash2,
  PiggyBank,
} from "lucide-react";
import { useState } from "react";
import { TransactionForm } from "./TransactionForm";

export function FinancePage() {
  const { transactions, funds, getBalance, deleteTransaction, addFundsToFund } =
    useFinanceStore();
  const [fundingAmount, setFundingAmount] = useState<string>("");
  const [selectedFundId, setSelectedFundId] = useState<string>("japan-fund");

  const balance = getBalance();

  const totalIncomes = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const handleAddSavings = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(fundingAmount);
    if (isNaN(amount) || amount <= 0) return;

    addFundsToFund(selectedFundId, amount);
    setFundingAmount("");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Panel Financiero</h1>
        <p className="text-sm text-muted-foreground">
          Controla tu balance, ingresos, gastos y metas de ahorro.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground uppercase">
              Balance Total
            </span>
            <p
              className={`text-2xl font-bold tracking-tight ${balance >= 0 ? "text-foreground" : "text-destructive"}`}
            >
              {balance.toFixed(2)} €
            </p>
          </div>
          <div className="p-3 bg-secondary rounded-xl text-muted-foreground">
            <Wallet className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground uppercase">
              Ingresos Totales
            </span>
            <p className="text-2xl font-bold tracking-tight text-emerald-500">
              +{totalIncomes.toFixed(2)} €
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground uppercase">
              Gastos Totales
            </span>
            <p className="text-2xl font-bold tracking-tight text-destructive">
              -{totalExpenses.toFixed(2)} €
            </p>
          </div>
          <div className="p-3 bg-destructive/10 rounded-xl text-destructive">
            <ArrowDownRight className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5 items-start">
        <div className="md:col-span-3 space-y-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Objetivos de Ahorro
            </h3>

            <div className="space-y-4">
              {funds.map((fund) => {
                const progress = Math.min(
                  100,
                  Math.round((fund.current / fund.target) * 100),
                );
                return (
                  <div
                    key={fund.id}
                    className="space-y-2 border p-4 rounded-xl bg-background/40"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold">{fund.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {fund.current.toFixed(0)} € de{" "}
                          {fund.target.toFixed(0)} €
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {funds.length > 0 && (
              <form
                onSubmit={handleAddSavings}
                className="flex gap-2 pt-2 border-t"
              >
                <select
                  value={selectedFundId}
                  onChange={(e) => setSelectedFundId(e.target.value)}
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
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
                  placeholder="Aportar importe (ej. 50)..."
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(e.target.value)}
                  className="h-9 flex-1 rounded-md border border-input bg-transparent px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <button
                  type="submit"
                  className="h-9 px-3 bg-secondary text-foreground border rounded-md hover:bg-secondary/80 transition-colors flex items-center gap-1 text-xs font-medium"
                >
                  <PiggyBank className="h-3.5 w-3.5" /> Ahorrar
                </button>
              </form>
            )}
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-base">Movimientos Recientes</h3>

            {transactions.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-xl bg-background/20">
                <p className="text-xs text-muted-foreground">
                  No hay transacciones registradas todavía.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-55 overflow-y-auto pr-1">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-background/40 hover:bg-background transition-colors"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{tx.description}</p>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="bg-secondary px-1.5 py-0.5 rounded font-medium">
                          {tx.category}
                        </span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-semibold ${tx.type === "income" ? "text-emerald-500" : "text-destructive"}`}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {tx.amount.toFixed(2)} €
                      </span>
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                        title="Eliminar movimiento"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
  );
}
