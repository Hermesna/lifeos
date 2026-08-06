import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Languages, ArrowRight, BarChart3 } from "lucide-react"
import { useLanguagesStore, type StudyCategory } from "@/features/languages/stores/useLanguagesStore"


export function LanguagesWidget() {
    const { t } = useTranslation()
    const targetLanguage = useLanguagesStore((state) => state.targetLanguage)
    const levelsByLanguage = useLanguagesStore((state) => state.levelsByLanguage)
    const sessions = useLanguagesStore((state) => state.sessions)
    const currentLevel = levelsByLanguage[targetLanguage] || "A1"
    const targetSessions = sessions.filter((s) => s.language === targetLanguage)
    const categoryColors: Record<StudyCategory, { bg: string; label: string }> = {
        vocabulary: { bg: "bg-blue-500", label: t("languagesWidget.categories.vocabulary", { defaultValue: "Vocab" }) },
        listening: { bg: "bg-emerald-500", label: t("languagesWidget.categories.listening", { defaultValue: "Listening" }) },
        grammar: { bg: "bg-amber-500", label: t("languagesWidget.categories.grammar", { defaultValue: "Grammar" }) },
        speaking: { bg: "bg-purple-500", label: t("languagesWidget.categories.speaking", { defaultValue: "Speaking" }) },
    }

    const categoryTotals = targetSessions.reduce((acc, s) => {
        acc[s.category] = (acc[s.category] || 0) + s.duration
        return acc
    }, {} as Record<StudyCategory, number>)

    const totalMinutes = Object.values(categoryTotals).reduce((a, b) => a + b, 0)

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col justify-between hover:border-border/85 transition-colors shadow-xs">
            <div className="bg-indigo-500/10 dark:bg-indigo-500/5 px-4 py-3 border-b border-indigo-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-xl bg-indigo-500 text-white shadow-xs shrink-0">
                        <Languages className="h-3.5 w-3.5" />
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            {t("languagesWidget.section", { defaultValue: "Idiomas" })}
                        </span>
                        <h3 className="text-xs font-semibold">{targetLanguage}</h3>
                    </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500 text-white shadow-xs shrink-0">
                    {t("languagesWidget.level", { level: currentLevel, defaultValue: "Nivel {{level}}" })}
                </span>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5 min-w-0 truncate">
                        <BarChart3 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{t("languagesWidget.distribution", { defaultValue: "Distribución de estudio" })}</span>
                    </span>
                    <span className="font-bold shrink-0 ml-2">
                        {t("languagesWidget.totalMinutes", { minutes: totalMinutes, defaultValue: "{{minutes}} min total" })}
                    </span>
                </div>

                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden flex gap-0.5 p-0.5">
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
                            <div key={cat} className="flex items-center justify-between text-[10px] bg-accent/40 px-2.5 py-1.5 rounded-xl border border-border/40">
                                <span className="flex items-center gap-1.5 text-muted-foreground min-w-0 truncate">
                                    <span className={`h-2 w-2 rounded-full ${config.bg} shrink-0`} />
                                    <span className="truncate">{config.label}</span>
                                </span>
                                <span className="font-semibold text-foreground shrink-0 ml-1">
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
                <ArrowRight className="h-3 w-3 shrink-0" />
            </Link>
        </div>
    )
}