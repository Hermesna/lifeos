import { AppCard } from "@/shared/components/ui/AppCard";
import { useHabitsStore } from "../stores/useHabitsStore";
import { CheckCircle2, Flame } from "lucide-react";

export function HabitsWidget() {
  const habits = useHabitsStore((state) => state.habits);
  const toggleHabitToday = useHabitsStore((state) => state.toggleHabitToday);

  return (
    <AppCard
      title="Daily Disciplines"
      description="Consistency tracker"
      icon={<CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="space-y-4 pt-2">
        {habits.map((habit) => (
          <div key={habit.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-card-foreground">
                {habit.name}
              </span>
              <span className="flex items-center gap-0.5 text-orange-500 font-semibold">
                <Flame className="h-3 w-3 fill-orange-500" />
                {habit.streak}d
              </span>
            </div>

            <div className="flex gap-1">
              {habit.history.map((done, index) => {
                const isToday = index === habit.history.length - 1;

                return (
                  <button
                    key={index}
                    disabled={!isToday}
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`h-4 flex-1 rounded-sm border transition-all ${
                      done
                        ? "bg-primary border-primary/20"
                        : "bg-secondary/40 border-border/50"
                    } ${isToday ? "cursor-pointer hover:scale-105 ring-1 ring-primary/30" : "cursor-default"}`}
                    title={
                      isToday
                        ? "Click to toggle today's progress"
                        : done
                          ? "Completed"
                          : "Missed"
                    }
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </AppCard>
  );
}
