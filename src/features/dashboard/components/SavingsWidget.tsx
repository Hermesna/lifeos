import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Wallet, ArrowRight, TrendingUp, PiggyBank, ArrowUpRight } from "lucide-react"
import { useFinanceStore } from "@/features/finance/stores/useFinanceStore"

export function SavingsWidget() {
    const { t } = useTranslation()
    const getBalance = useFinanceStore((state) => state.getBalance)
    const funds = useFinanceStore((state) => state.funds)

    const totalBalance = getBalance()
    const mainFund = funds[0]

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col justify-between hover:border-border/85 transition-colors shadow-xs">
            <div className="bg-emerald-500/10 dark:bg-emerald-500/5 px-4 py-3 border-b border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-xl bg-emerald-500 text-white shadow-xs shrink-0">
                        <Wallet className="h-3.5 w-3.5" />
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            {t("savingsWidget.finance", { defaultValue: "Finanzas" })}
                        </span>
                        <h3 className="text-xs font-semibold">
                            {t("savingsWidget.title", { defaultValue: "Salud Financiera" })}
                        </h3>
                    </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <TrendingUp className="h-3 w-3 shrink-0" />
                    <span>{t("savingsWidget.status", { defaultValue: "Activo" })}</span>
                </span>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex items-baseline justify-between bg-accent/40 p-3 rounded-xl border border-border/40">
                    <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">
                            {t("savingsWidget.generalBalance", { defaultValue: "Balance General" })}
                        </span>
                        <p className="text-sm font-bold text-foreground">
                            {totalBalance.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                        </p>
                    </div>
                    <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <ArrowUpRight className="h-4 w-4" />
                    </div>
                </div>

                {mainFund ? (
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                            <span className="flex items-center gap-1.5 min-w-0 truncate">
                                <PiggyBank className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                <span className="truncate">{mainFund.name}</span>
                            </span>
                            <span className="font-semibold text-foreground shrink-0 ml-2">
                                {mainFund.current.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })} / {mainFund.target.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })}
                            </span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(Math.round((mainFund.current / mainFund.target) * 100), 100)}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-1">
                        <p className="text-[11px] text-muted-foreground">
                            {t("savingsWidget.empty", { defaultValue: "No hay fondos de ahorro creados." })}
                        </p>
                    </div>
                )}
            </div>

            <Link
                to="/finance"
                className="px-4 py-2.5 bg-accent/20 flex items-center justify-between text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors border-t border-border/40"
            >
                <span>{t("savingsWidget.manage", { defaultValue: "Ver transacciones y fondos" })}</span>
                <ArrowRight className="h-3 w-3 shrink-0" />
            </Link>
        </div>
    )
}