import { useThemeStore } from "@/shared/stores/useThemeStore";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-transparent text-muted-foreground shadow-sm transition-all hover:bg-muted hover:text-foreground active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative h-4 w-4">
        <Sun className={`absolute h-4 w-4 transition-transform duration-300 ${
          theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100 text-amber-500"
        }`} />
        
        <Moon className={`absolute h-4 w-4 transition-transform duration-300 ${
          theme === "dark" ? "rotate-0 scale-100 text-indigo-400" : "-rotate-90 scale-0"
        }`} />
      </div>
    </button>
  );
}