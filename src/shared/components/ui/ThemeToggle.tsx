import { useState, useRef, useEffect } from "react"
import { useTheme } from "@/shared/providers/ThemeContext"
import { useTranslation } from "react-i18next"
import { Sun, Moon, Monitor } from "lucide-react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const themeConfig = {
        light: { icon: Sun, label: t("theme.light") },
        dark: { icon: Moon, label: t("theme.dark") },
        system: { icon: Monitor, label: t("theme.system") },
    }

    const CurrentIcon = themeConfig[theme]?.icon || Monitor

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="hidden md:flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border backdrop-blur-sm">
                <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                        theme === "light"
                            ? "bg-card text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                    title={t("theme.light")}
                    aria-label={t("theme.light")}
                >
                    <Sun className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                        theme === "dark"
                            ? "bg-card text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                    title={t("theme.dark")}
                    aria-label={t("theme.dark")}
                >
                    <Moon className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                        theme === "system"
                            ? "bg-card text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                    title={t("theme.system")}
                    aria-label={t("theme.system")}
                >
                    <Monitor className="h-4 w-4" />
                </button>
            </div>

            <div className="flex md:hidden items-center">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl border bg-secondary/50 text-foreground shadow-xs backdrop-blur-sm cursor-pointer"
                    aria-label={t("theme.label", "Cambiar tema")}
                >
                    <CurrentIcon className="h-4 w-4" />
                </button>

                {isOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-36 bg-card border border-border rounded-xl shadow-lg p-1 z-50 flex flex-col gap-1 animate-in fade-in-80 zoom-in-95">
                        {(["light", "dark", "system"] as const).map((tKey) => {
                            const Icon = themeConfig[tKey].icon
                            const isSelected = theme === tKey
                            return (
                                <button
                                    key={tKey}
                                    type="button"
                                    onClick={() => {
                                        setTheme(tKey)
                                        setIsOpen(false)
                                    }}
                                    className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                                        isSelected
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                                    }`}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    <span>{themeConfig[tKey].label}</span>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}