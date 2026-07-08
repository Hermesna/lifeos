import { HabitsWidget } from "@/features/habits/pages/HabitsWidget";
import { HabitForm } from "@/features/habits/pages/HabitForm";

export default function HabitsPage() {
  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Disciplines & Habits</h1>
        <p className="text-sm text-muted-foreground">
          Track your micro-actions and protect your streaks to achieve your mid-term goals.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Columna izquierda: Listado e interacción (3/5 del ancho) */}
        <div className="md:col-span-3">
          <HabitsWidget />
        </div>

        {/* Columna derecha: Creador de nuevos hábitos (2/5 del ancho) */}
        <div className="md:col-span-2 space-y-4">
          <HabitForm />
        </div>
      </div>
    </div>
  );
}