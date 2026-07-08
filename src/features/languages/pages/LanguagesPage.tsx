import { AppCard } from "@/shared/components/ui/AppCard";
import { Languages, Flame } from "lucide-react";

export function LanguagesPage() {
  const currentStreak = 12;
  const progress = 45;

  return (
    <AppCard
      title="Language Learning"
      description="French Mastery Journey"
      icon={<Languages className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-2xl font-bold tracking-tight">A2 / B1</p>
            <p className="text-xs text-muted-foreground">Current Level Target</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-500 animate-pulse">
            <Flame className="h-4 w-4 fill-orange-500" />
            <span>{currentStreak} day streak</span>
          </div>
        </div>

        {/* Custom Premium Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress to B1</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </AppCard>
  );
}