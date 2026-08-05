import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
    BookOpen,
    Headphones,
    GraduationCap,
    MessageSquare,
    Trash2,
    Clock,
    Trophy,
    Plus,
    X,
} from "lucide-react"
import {
    useLanguagesStore,
    type StudyCategory,
} from "../stores/useLanguagesStore"
import { LanguageForm } from "./LanguageForm"

export function LanguagesPage() {
    const { t } = useTranslation()

    const {
        sessions,
        targetLanguage,
        userLanguages,
        setTargetLanguage,
        addUserLanguage,
        levelsByLanguage,
        setCurrentLevel,
        deleteSession,
    } = useLanguagesStore()

    const currentLevel = levelsByLanguage?.[targetLanguage] || "A1"
    const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

    const [isCreating, setIsCreating] = useState(false)
    const [newLangInput, setNewLangInput] = useState("")

    const categoryConfig: Record<
        StudyCategory,
        { label: string; icon: React.ReactNode; color: string; bg: string }
    > = {
        vocabulary: {
            label: t("languages.categories.vocabulary", { defaultValue: "Vocabulario" }),
            icon: <BookOpen className="h-3.5 w-3.5" />,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        listening: {
            label: t("languages.categories.listening", { defaultValue: "Escucha" }),
            icon: <Headphones className="h-3.5 w-3.5" />,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        grammar: {
            label: t("languages.categories.grammar", { defaultValue: "Gramática" }),
            icon: <GraduationCap className="h-3.5 w-3.5" />,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
        },
        speaking: {
            label: t("languages.categories.speaking", { defaultValue: "Oral" }),
            icon: <MessageSquare className="h-3.5 w-3.5" />,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
        },
    }

    const filteredSessions = sessions.filter(
        (s) => s.language === targetLanguage
    )

    const totalMinutes = filteredSessions.reduce((acc, s) => acc + s.duration, 0)
    const totalHours = (totalMinutes / 60).toFixed(1)

    const minutesByCategory = filteredSessions.reduce((acc, s) => {
        acc[s.category] = (acc[s.category] || 0) + s.duration
        return acc
    }, {} as Record<StudyCategory, number>)

    const handleCreateLanguage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newLangInput.trim()) return
        addUserLanguage(newLangInput)
        setNewLangInput("")
        setIsCreating(false)
    }

    return (
        <div className="w-full flex flex-col gap-3 max-w-7xl mx-auto p-3 box-border">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b pb-1.5 shrink-0">
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                            {t("languages.targetLanguage", { defaultValue: "Idioma Objetivo" })}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        {isCreating ? (
                            <form
                                onSubmit={handleCreateLanguage}
                                className="flex items-center gap-1.5"
                            >
                                <input
                                    type="text"
                                    placeholder={t("languages.placeholder", { defaultValue: "Ej: Japonés..." })}
                                    value={newLangInput}
                                    onChange={(e) => setNewLangInput(e.target.value)}
                                    autoFocus
                                    className="px-2 py-0.5 text-xs font-semibold bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <button
                                    type="submit"
                                    className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors"
                                >
                                    {t("common.save", { defaultValue: "Guardar" })}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </form>
                        ) : (
                            <>
                                {(!userLanguages || userLanguages.length === 0) ? (
                                    <span className="text-lg font-extrabold tracking-tight text-muted-foreground">
                                        {t("languages.noLanguages", { defaultValue: "Sin idiomas" })}
                                    </span>
                                ) : (
                                    <select
                                        value={targetLanguage || ""}
                                        onChange={(e) => setTargetLanguage(e.target.value)}
                                        className="text-lg font-extrabold tracking-tight bg-transparent border-b border-dashed border-muted-foreground/40 hover:border-primary focus:outline-none focus:border-primary cursor-pointer pr-1 py-0.5"
                                    >
                                        {userLanguages.map((lang) => (
                                            <option
                                                key={lang}
                                                value={lang}
                                                className="bg-popover text-popover-foreground text-sm font-normal"
                                            >
                                                {lang}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 bg-primary/10 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                                    title={t("languages.addNew", { defaultValue: "Añadir nuevo idioma" })}
                                >
                                    <Plus className="h-3 w-3" />
                                    {t("common.new", { defaultValue: "Nuevo" })}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2.5 bg-card border px-2.5 py-1 rounded-xl shadow-xs">
                    <div className="p-1 bg-yellow-500/10 text-yellow-600 rounded-lg">
                        <Trophy className="h-3.5 w-3.5" />
                    </div>
                    <div>
                        <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide">
                            {t("languages.level", { defaultValue: "Nivel" })}
                        </p>
                        <select
                            value={currentLevel}
                            onChange={(e) => setCurrentLevel(targetLanguage, e.target.value)}
                            className="text-xs font-bold text-foreground bg-transparent focus:outline-none cursor-pointer border-b border-dashed border-muted-foreground/30 hover:border-primary pr-0.5 leading-none"
                        >
                            {CEFR_LEVELS.map((lvl) => (
                                <option
                                    key={lvl}
                                    value={lvl}
                                    className="bg-popover text-popover-foreground text-sm font-normal"
                                >
                                    {lvl}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 shrink-0">
                <div className="p-2 rounded-xl border bg-card shadow-xs flex items-center gap-2.5">
                    <div className="p-1.5 bg-orange-500/10 rounded-lg text-orange-500">
                        <Clock className="h-3.5 w-3.5" />
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground font-medium">
                            {t("languages.stats.timeSpent", { defaultValue: "Tiempo Invertido" })}
                        </p>
                        <h3 className="text-base font-bold leading-tight">
                            {totalHours}{" "}
                            <span className="text-xs font-normal text-muted-foreground">
                                {t("languages.stats.hoursAbbr", { defaultValue: "hrs" })}
                            </span>
                        </h3>
                    </div>
                </div>

                <div className="p-2 rounded-xl border bg-card shadow-xs flex items-center gap-2.5">
                    <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500">
                        <Trophy className="h-3.5 w-3.5" />
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground font-medium">
                            {t("languages.stats.completedBlocks", { defaultValue: "Bloques Completados" })}
                        </p>
                        <h3 className="text-base font-bold leading-tight">
                            {filteredSessions.length}
                        </h3>
                    </div>
                </div>

                <div className="p-2 rounded-xl border bg-card shadow-xs space-y-0.5">
                    <p className="text-[10px] text-muted-foreground font-medium">
                        {t("languages.stats.skillBalance", { defaultValue: "Balance de Habilidades" })}
                    </p>
                    <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-muted">
                        {(Object.keys(categoryConfig) as StudyCategory[]).map((cat) => {
                            const catMins = minutesByCategory[cat] || 0
                            const pct =
                                totalMinutes > 0 ? (catMins / totalMinutes) * 100 : 0
                            if (pct === 0) return null
                            return (
                                <div
                                    key={cat}
                                    style={{ width: `${pct}%` }}
                                    className={`${categoryConfig[cat].bg.replace("/10", "")}`}
                                    title={`${categoryConfig[cat].label}: ${Math.round(pct)}%`}
                                />
                            )
                        })}
                    </div>
                    <div className="flex justify-between text-[9px] text-muted-foreground pt-0.5">
                        {(Object.keys(categoryConfig) as StudyCategory[]).map((cat) => (
                            <span key={cat} className="flex items-center gap-1">
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${categoryConfig[cat].bg.replace(
                                        "/10",
                                        ""
                                    )}`}
                                />
                                {categoryConfig[cat].label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-2.5 md:grid-cols-5 items-start">
                <div className="md:col-span-3 border rounded-xl bg-card p-2.5 shadow-xs flex flex-col">
                    <h3 className="font-semibold text-xs mb-1.5 shrink-0">
                        {t("languages.historyTitle", {
                            language: targetLanguage,
                            defaultValue: "Historial de Práctica ({{language}})",
                        })}
                    </h3>

                    {filteredSessions.length === 0 ? (
                        <div className="py-8 flex items-center justify-center text-xs text-muted-foreground">
                            {t(
                                "languages.noSessions",
                                {
                                    language: targetLanguage,
                                    defaultValue: "No has registrado ninguna sesión para {{language}} todavía.",
                                }
                            )}
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredSessions.map((session) => {
                                const config = categoryConfig[session.category]
                                return (
                                    <div
                                        key={session.id}
                                        className="flex items-center justify-between p-1.5 border rounded-lg bg-background/50 hover:bg-background transition-colors"
                                    >
                                        <div className="flex gap-2 items-center">
                                            <div
                                                className={`p-1 rounded-lg ${config.bg} ${config.color}`}
                                            >
                                                {config.icon}
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium">{config.label}</p>
                                                {session.notes && (
                                                    <p className="text-[10px] text-muted-foreground line-clamp-1">
                                                        {session.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-semibold bg-secondary px-1.5 py-0.5 rounded">
                                                +{session.duration}{" "}
                                                {t("languages.minutesAbbr", { defaultValue: "min" })}
                                            </span>
                                            <button
                                                onClick={() => deleteSession(session.id)}
                                                className="text-muted-foreground hover:text-destructive p-1 transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="md:col-span-2">
                    <LanguageForm />
                </div>
            </div>
        </div>
    )
}