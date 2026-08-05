import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    BookOpen,
    Headphones,
    GraduationCap,
    MessageSquare,
    Play,
    Square,
    Plus,
    Loader2,
} from "lucide-react"
import {
    useLanguagesStore,
    type StudyCategory,
} from "../stores/useLanguagesStore"

const languageSchema = z.object({
    category: z.enum(["vocabulary", "listening", "grammar", "speaking"]),
    duration: z.coerce
        .number({ message: "languages.form.errors.invalidNumber" })
        .min(1, "languages.form.errors.minDuration")
        .max(300, "languages.form.errors.maxDuration"),
    notes: z.string().max(150, "languages.form.errors.maxNotes").optional(),
})

type LanguageFormInput = z.input<typeof languageSchema>
type LanguageFormOutput = z.output<typeof languageSchema>

export function LanguageForm() {
    const { t } = useTranslation()
    const { addSession, targetLanguage } = useLanguagesStore()

    const [isSaving, setIsSaving] = useState(false)
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [seconds, setSeconds] = useState(0)

    const categoryConfig: Record<
        StudyCategory,
        {
            label: string
            icon: React.ReactNode
            color: string
            border: string
            bg: string
        }
    > = {
        vocabulary: {
            label: t("languages.categories.vocabulary", { defaultValue: "Vocabulario" }),
            icon: <BookOpen className="h-3.5 w-3.5 shrink-0" />,
            color: "text-emerald-500",
            border: "border-emerald-500/20",
            bg: "bg-emerald-500/10",
        },
        listening: {
            label: t("languages.categories.listening", { defaultValue: "Escucha" }),
            icon: <Headphones className="h-3.5 w-3.5 shrink-0" />,
            color: "text-blue-500",
            border: "border-blue-500/20",
            bg: "bg-blue-500/10",
        },
        grammar: {
            label: t("languages.categories.grammar", { defaultValue: "Gramática" }),
            icon: <GraduationCap className="h-3.5 w-3.5 shrink-0" />,
            color: "text-indigo-500",
            border: "border-indigo-500/20",
            bg: "bg-indigo-500/10",
        },
        speaking: {
            label: t("languages.categories.speaking", { defaultValue: "Oral" }),
            icon: <MessageSquare className="h-3.5 w-3.5 shrink-0" />,
            color: "text-violet-500",
            border: "border-violet-500/20",
            bg: "bg-violet-500/10",
        },
    }

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { errors },
    } = useForm<LanguageFormInput, unknown, LanguageFormOutput>({
        resolver: zodResolver(languageSchema),
        defaultValues: {
            category: "listening",
            duration: 25,
            notes: "",
        },
    })

    const selectedCategory = useWatch({
        control,
        name: "category",
    })

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>
        if (isTimerRunning) {
            interval = setInterval(() => setSeconds((s) => s + 1), 1000)
        }
        return () => clearInterval(interval)
    }, [isTimerRunning])

    const stopTimer = () => {
        setIsTimerRunning(false)
        const minutes = Math.max(1, Math.round(seconds / 60))
        setValue("duration", minutes)
        setSeconds(0)
    }

    const onSubmit = async (data: LanguageFormOutput) => {
        setIsSaving(true)
        if (isTimerRunning) {
            setIsTimerRunning(false)
        }

        await new Promise((resolve) => setTimeout(resolve, 300))

        addSession({
            ...data,
            language: targetLanguage,
            date: new Date().toISOString().split("T")[0],
        })

        setSeconds(0)
        reset({ category: data.category, duration: 25, notes: "" })
        setIsSaving(false)
    }

    const formatTimer = (sec: number) => {
        const m = Math.floor(sec / 60)
        const s = sec % 60
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    }

    return (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
            <div>
                <h3 className="font-bold text-sm tracking-tight">
                    {t("languages.form.title", { defaultValue: "Registrar Sesión" })}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 mb-3">
                    {t("languages.form.subtitle", {
                        defaultValue: "Cronometra o añade bloques manuales.",
                    })}
                </p>
            </div>

            <div className="p-3 rounded-xl border border-border/60 bg-muted/40 flex items-center justify-between mb-3 shadow-xs">
                <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t("languages.form.activeTimer", { defaultValue: "Cronómetro activo" })}
                    </p>
                    <p className="text-lg font-mono font-bold tracking-wider mt-0.5">
                        {formatTimer(seconds)}
                    </p>
                </div>
                {isTimerRunning ? (
                    <button
                        type="button"
                        onClick={stopTimer}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-medium shadow-xs hover:bg-destructive/90 cursor-pointer transition-colors"
                    >
                        <Square className="h-3.5 w-3.5 fill-current shrink-0" />{" "}
                        {t("languages.form.stopTimer", { defaultValue: "Detener" })}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsTimerRunning(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-medium shadow-xs hover:bg-emerald-700 cursor-pointer transition-colors"
                    >
                        <Play className="h-3.5 w-3.5 fill-current shrink-0" />{" "}
                        {t("languages.form.startTimer", { defaultValue: "Iniciar" })}
                    </button>
                )}
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3"
            >
                <div className="space-y-2.5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t("languages.form.categoryLabel", { defaultValue: "Categoría" })}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {(Object.keys(categoryConfig) as StudyCategory[]).map((cat) => {
                                const isSelected = selectedCategory === cat
                                const cfg = categoryConfig[cat]
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setValue("category", cat)}
                                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer shadow-xs ${isSelected
                                                ? `${cfg.bg} ${cfg.border} ${cfg.color} ring-1 ring-primary/30 font-semibold`
                                                : "bg-background border-input hover:bg-accent/50 text-muted-foreground"
                                            }`}
                                    >
                                        {cfg.icon}
                                        <span className="truncate">{cfg.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t("languages.form.durationLabel", { defaultValue: "Duración" })}
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                            {[15, 25, 45, 60].map((mins) => (
                                <button
                                    key={mins}
                                    type="button"
                                    onClick={() => setValue("duration", mins)}
                                    className="flex items-center justify-center h-8 border border-input rounded-xl text-xs font-medium hover:bg-accent transition-colors cursor-pointer shadow-xs bg-background"
                                >
                                    {mins}
                                    {t("languages.minutesAbbr", { defaultValue: "m" })}
                                </button>
                            ))}
                        </div>
                        <input
                            type="number"
                            {...register("duration", { valueAsNumber: true })}
                            className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1.5"
                            placeholder={t("languages.form.customMinutesPlaceholder", {
                                defaultValue: "Minutos personalizados",
                            })}
                        />
                        {errors.duration?.message && (
                            <p className="text-[10px] font-medium text-destructive mt-1">
                                {t(errors.duration.message)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t("languages.form.notesLabel", { defaultValue: "Notas (Opcional)" })}
                        </label>
                        <textarea
                            {...register("notes")}
                            className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-16 resize-none"
                            placeholder={t("languages.form.notesPlaceholder", {
                                defaultValue: "Ej. Aprendidas 10 palabras sobre negocios...",
                            })}
                        />
                        {errors.notes?.message && (
                            <p className="text-[10px] font-medium text-destructive mt-1">
                                {t(errors.notes.message)}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary h-9 text-xs font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-50 cursor-pointer mt-4"
                >
                    {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    ) : (
                        <>
                            <Plus className="h-4 w-4 shrink-0" />{" "}
                            {t("languages.form.submitButton", { defaultValue: "Guardar Bloque" })}
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}