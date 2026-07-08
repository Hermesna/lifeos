import { BooksPage } from "@/features/books/pages/BooksPage";
import { SavingsCard } from "@/features/dashboard/components/SavingsCard";
import HabitsPage from "@/features/habits/pages/HabitsPage";
import { LanguagesPage } from "@/features/languages/pages/LanguagesPage";
import { TravelPage } from "@/features/travel/pages/TravelPage";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">LifeOS Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          System overview and core personal metrics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <SavingsCard />
        <LanguagesPage />
        <TravelPage />
        <HabitsPage />
        <BooksPage />
      </div>
    </div>
  );
}
