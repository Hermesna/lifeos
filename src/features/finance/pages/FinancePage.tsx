import { SavingsCard } from "@/features/dashboard/components/SavingsCard";
import { TransactionForm } from "@/features/finance/pages/TransactionForm";

export default function FinancePage() {
  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Finance Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Track income, expenses, and monitor your European relocation runway.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-2 space-y-4">
          <SavingsCard />
        </div>

        <div className="md:col-span-3">
          <TransactionForm />
        </div>
      </div>
    </div>
  );
}
