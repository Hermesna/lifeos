import { useTheme } from "@/shared/providers/ThemeContext"
import { useTranslation } from "react-i18next"
import { Sun, Moon, Monitor } from "lucide-react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const { t } = useTranslation()

    return (
        <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border backdrop-blur-sm">
            <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-lg transition-all ${theme === "light"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                title={t("theme.light")}
                aria-label={t("theme.light")}
            >
                <Sun className="h-4 w-4" />
            </button>

            <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-lg transition-all ${theme === "dark"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                title={t("theme.dark")}
                aria-label={t("theme.dark")}
            >
                <Moon className="h-4 w-4" />
            </button>

            <button
                onClick={() => setTheme("system")}
                className={`p-2 rounded-lg transition-all ${theme === "system"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                title={t("theme.system")}
                aria-label={t("theme.system")}
            >
                <Monitor className="h-4 w-4" />
            </button>
        </div>
    )
}