import { AppCard } from "@/shared/components/ui/AppCard";
import { Compass, Calendar } from "lucide-react";

export function TravelPage() {
  const targetDate = "Autumn 2027";
  const fundProgress = 35;

  return (
    <AppCard
      title="Next Expedition"
      description="Return to Japan"
      icon={<Compass className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Target Window</span>
          </div>
          <span className="text-sm font-semibold">{targetDate}</span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Travel Fund Status</span>
            <span className="font-medium text-card-foreground">{fundProgress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full" 
              style={{ width: `${fundProgress}%` }}
            />
          </div>
        </div>
      </div>
    </AppCard>
  );
}