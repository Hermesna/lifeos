import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";

export function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6 text-foreground transition-colors duration-200">
      <h2 className="text-lg font-semibold">Dashboard</h2>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900 border border-border/40">
          H
        </div>
      </div>
    </header>
  );
}
