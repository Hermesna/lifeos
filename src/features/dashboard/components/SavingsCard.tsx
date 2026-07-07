import { Wallet } from "lucide-react";

import AppCard from "@/shared/components/ui/AppCard";

function SavingsCard() {
  return (
    <AppCard
      title="Savings"
      description="Current balance"
      icon={<Wallet className="h-5 w-5 text-emerald-500" />}
    >
      <div className="space-y-3">
        <p className="text-4xl font-bold">€8,000</p>

        <p className="text-sm text-muted-foreground">
          Goal: €25,000
        </p>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-[32%] rounded-full bg-emerald-500" />
        </div>
      </div>
    </AppCard>
  );
}

export default SavingsCard;