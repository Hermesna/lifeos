import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Languages, ArrowRight, BarChart3 } from "lucide-react"
import { useLanguagesStore, type StudyCategory } from "@/features/languages/stores/useLanguagesStore"

const categoryColors: Record<StudyCategory, { bg: string; label: string }> = {
    vocabulary: { bg: "bg-blue-500", label: "Vocab" },
    listening: { bg: "bg-emerald-500", label: "Listening" },
    grammar: { bg: "bg-amber-500", label: "Grammar" },
    speaking: { bg: "bg-purple-500", label: "Speaking" },
}

export function LanguagesWidget() {
    const { t } = useTranslation()
    const targetLanguage = useLanguagesStore((state) => state.targetLanguage)
    const levelsByLanguage = useLanguagesStore((state) => state.levelsByLanguage)
    const sessions = useLanguagesStore((state) => state.sessions)

    const currentLevel = levelsByLanguage[targetLanguage] || "A1"
    const targetSessions = sessions.filter((s) => s.language === targetLanguage)

    const categoryTotals = targetSessions.reduce((acc, s) => {
        acc[s.category] = (acc[s.category] || 0) + s.duration
        return acc
    }, {} as Record<StudyCategory, number>)

    const totalMinutes = Object.values(categoryTotals).reduce((a, b) => a + b, 0)

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col justify-between hover:border-border/80 transition-colors shadow-xs">
            <div className="bg-indigo-500/10 dark:bg-indigo-500/5 px-4 py-3 border-b border-indigo-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-indigo-500 text-white shadow-xs">
                        <Languages className="h-3.5 w-3.5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            {t("languagesWidget.section", { defaultValue: "Idiomas" })}
                        </span>
                        <h3 className="text-xs font-semibold">{targetLanguage}</h3>
                    </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500 text-white shadow-xs">
                    {t("languagesWidget.level", { level: currentLevel, defaultValue: "Nivel {{level}}" })}
                </span>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                        <BarChart3 className="h-3.5 w-3.5 text-indigo-500" />
                        {t("languagesWidget.distribution", { defaultValue: "Distribución de estudio" })}
                    </span>
                    <span className="font-bold">
                        {t("languagesWidget.totalMinutes", { minutes: totalMinutes, defaultValue: "{{minutes}} min total" })}
                    </span>
                </div>

                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden flex gap-0.5 p-0.5">
                    {totalMinutes === 0 ? (
                        <div className="h-full w-full bg-muted-foreground/20 rounded-full" />
                    ) : (
                        (Object.keys(categoryColors) as StudyCategory[]).map((cat) => {
                            const minutes = categoryTotals[cat] || 0
                            if (minutes === 0) return null
                            const percentage = (minutes / totalMinutes) * 100
                            const config = categoryColors[cat]

                            return (
                                <div
                                    key={cat}
                                    className={`h-full ${config.bg} rounded-xs transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                    title={`${config.label}: ${minutes} min`}
                                />
                            )
                        })
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                    {(Object.keys(categoryColors) as StudyCategory[]).map((cat) => {
                        const minutes = categoryTotals[cat] || 0
                        const config = categoryColors[cat]
                        return (
                            <div key={cat} className="flex items-center justify-between text-[10px] bg-accent/40 px-2 py-1 rounded-md">
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <span className={`h-1.5 w-1.5 rounded-full ${config.bg}`} />
                                    {config.label}
                                </span>
                                <span className="font-semibold text-foreground">
                                    {t("languagesWidget.minutes", { minutes, defaultValue: "{{minutes}}m" })}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <Link
                to="/languages"
                className="px-4 py-2.5 bg-accent/20 flex items-center justify-between text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors border-t border-border/40"
            >
                <span>{t("languagesWidget.manage", { defaultValue: "Gestionar sesiones" })}</span>
                <ArrowRight className="h-3 w-3" />
            </Link>
        </div>
    )
}