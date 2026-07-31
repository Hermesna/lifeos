import { useState } from "react"
import { useTranslation } from "react-i18next"
import { X, Settings, Moon, Sun, Monitor, Globe, Save } from "lucide-react"

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
}

type ThemeMode = "light" | "dark" | "system"

function getInitialTheme(): ThemeMode {
    if (typeof window === "undefined") return "system"
    const storedTheme = localStorage.getItem("theme") as ThemeMode | null
    if (storedTheme) return storedTheme
    const isDark = document.documentElement.classList.contains("dark")
    return isDark ? "dark" : "light"
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { t, i18n } = useTranslation()

    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || "es")
    const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(getInitialTheme)

    if (!isOpen) return null

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()

        if (selectedLanguage !== i18n.language) {
            i18n.changeLanguage(selectedLanguage)
        }

        const root = document.documentElement
        if (selectedTheme === "dark") {
            root.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else if (selectedTheme === "light") {
            root.classList.remove("dark")
            localStorage.setItem("theme", "light")
        } else {
            localStorage.removeItem("theme")
            const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            if (systemDark) {
                root.classList.add("dark")
            } else {
                root.classList.remove("dark")
            }
        }

        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl space-y-5 animate-in zoom-in-95 duration-150">

                <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold">
                            {t("header.settings", { defaultValue: "Ajustes de la aplicación" })}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5 text-primary" />
                            <span>{t("settings.language", { defaultValue: "Idioma" })}</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedLanguage("es")}
                                className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-all cursor-pointer ${selectedLanguage.startsWith("es")
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border hover:bg-accent text-muted-foreground"
                                    }`}
                            >
                                <span>Español</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedLanguage("en")}
                                className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-all cursor-pointer ${selectedLanguage.startsWith("en")
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border hover:bg-accent text-muted-foreground"
                                    }`}
                            >
                                <span>English</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedLanguage("fr")}
                                className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-all cursor-pointer ${selectedLanguage.startsWith("fr")
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border hover:bg-accent text-muted-foreground"
                                    }`}
                            >
                                <span>Français</span>
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-border/60" />

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <Sun className="h-3.5 w-3.5 text-primary" />
                            <span>{t("settings.theme", { defaultValue: "Tema visual" })}</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedTheme("light")}
                                className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-all cursor-pointer ${selectedTheme === "light"
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border hover:bg-accent text-muted-foreground"
                                    }`}
                            >
                                <Sun className="h-3.5 w-3.5" />
                                <span>{t("common.light", { defaultValue: "Claro" })}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedTheme("dark")}
                                className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-all cursor-pointer ${selectedTheme === "dark"
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border hover:bg-accent text-muted-foreground"
                                    }`}
                            >
                                <Moon className="h-3.5 w-3.5" />
                                <span>{t("common.dark", { defaultValue: "Oscuro" })}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedTheme("system")}
                                className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-all cursor-pointer ${selectedTheme === "system"
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border hover:bg-accent text-muted-foreground"
                                    }`}
                            >
                                <Monitor className="h-3.5 w-3.5" />
                                <span>{t("common.system", { defaultValue: "Sistema" })}</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                        >
                            {t("common.cancel", { defaultValue: "Cancelar" })}
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                            <Save className="h-3.5 w-3.5" />
                            {t("common.save", { defaultValue: "Guardar" })}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}