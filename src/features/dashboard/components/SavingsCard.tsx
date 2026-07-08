import { AppCard } from "@/shared/components/ui/AppCard";
import { useFinanceStore } from "@/features/finance/stores/useFinanceStore";
import { PiggyBank, TrendingUp } from "lucide-react";

export function SavingsCard() {
  const savings = useFinanceStore((state) => state.savings);
  const targetSavings = useFinanceStore((state) => state.targetSavings);

  const progressPercentage = Math.min(
    Math.round((savings / targetSavings) * 100),
    100,
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <AppCard
      title="Financial Runway"
      description="Savings target for relocation"
      icon={<PiggyBank className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-2xl font-bold tracking-tight">
              {formatCurrency(savings)}
            </p>
            <p className="text-xs text-muted-foreground">
              Saved of {formatCurrency(targetSavings)} goal
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500">
            <TrendingUp className="h-3 w-3" />
            <span>{progressPercentage}%</span>
          </div>
        </div>

        {/* Barra de progreso Premium */}
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </AppCard>
  );
}
