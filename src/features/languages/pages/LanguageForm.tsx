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
            icon: <BookOpen className="h-3.5 w-3.5" />,
            color: "text-emerald-500",
            border: "border-emerald-500/20",
            bg: "bg-emerald-500/10",
        },
        listening: {
            label: t("languages.categories.listening", { defaultValue: "Escucha" }),
            icon: <Headphones className="h-3.5 w-3.5" />,
            color: "text-blue-500",
            border: "border-blue-500/20",
            bg: "bg-blue-500/10",
        },
        grammar: {
            label: t("languages.categories.grammar", { defaultValue: "Gramática" }),
            icon: <GraduationCap className="h-3.5 w-3.5" />,
            color: "text-indigo-500",
            border: "border-indigo-500/20",
            bg: "bg-indigo-500/10",
        },
        speaking: {
            label: t("languages.categories.speaking", { defaultValue: "Oral" }),
            icon: <MessageSquare className="h-3.5 w-3.5" />,
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
        <div className="rounded-xl border bg-card p-3 shadow-sm flex-1 flex flex-col justify-between overflow-y-auto min-h-0">
            <div>
                <h3 className="font-semibold text-sm tracking-tight">
                    {t("languages.form.title", { defaultValue: "Registrar Sesión" })}
                </h3>
                <p className="text-[11px] text-muted-foreground mb-2">
                    {t("languages.form.subtitle", {
                        defaultValue: "Cronometra o añade bloques manuales.",
                    })}
                </p>
            </div>

            <div className="p-2 rounded-lg border bg-muted/40 flex items-center justify-between mb-2 shrink-0">
                <div>
                    <p className="text-[10px] font-medium text-muted-foreground">
                        {t("languages.form.activeTimer", { defaultValue: "Cronómetro activo" })}
                    </p>
                    <p className="text-lg font-mono font-bold tracking-wider">
                        {formatTimer(seconds)}
                    </p>
                </div>
                {isTimerRunning ? (
                    <button
                        type="button"
                        onClick={stopTimer}
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-destructive text-destructive-foreground text-xs font-semibold shadow hover:bg-destructive/90 cursor-pointer"
                    >
                        <Square className="h-3 w-3 fill-current" />{" "}
                        {t("languages.form.stopTimer", { defaultValue: "Detener" })}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsTimerRunning(true)}
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-600 text-white text-xs font-semibold shadow hover:bg-emerald-700 cursor-pointer"
                    >
                        <Play className="h-3 w-3 fill-current" />{" "}
                        {t("languages.form.startTimer", { defaultValue: "Iniciar" })}
                    </button>
                )}
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-2.5 flex-1 flex flex-col justify-between"
            >
                <div className="space-y-1">
                    <label className="text-[11px] font-medium text-muted-foreground">
                        {t("languages.form.categoryLabel", { defaultValue: "Categoría" })}
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                        {(Object.keys(categoryConfig) as StudyCategory[]).map((cat) => {
                            const isSelected = selectedCategory === cat
                            const cfg = categoryConfig[cat]
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setValue("category", cat)}
                                    className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-xs font-medium transition-all text-left cursor-pointer ${isSelected
                                            ? `${cfg.bg} ${cfg.border} ${cfg.color} ring-1 ring-primary/30`
                                            : "bg-background hover:bg-accent/50 text-muted-foreground"
                                        }`}
                                >
                                    {cfg.icon}
                                    {cfg.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[11px] font-medium text-muted-foreground">
                        {t("languages.form.durationLabel", { defaultValue: "Duración" })}
                    </label>
                    <div className="flex gap-1.5">
                        {[15, 25, 45, 60].map((mins) => (
                            <button
                                key={mins}
                                type="button"
                                onClick={() => setValue("duration", mins)}
                                className="flex-1 py-0.5 border rounded-md text-xs font-medium hover:bg-accent transition-colors cursor-pointer"
                            >
                                {mins}
                                {t("languages.minutesAbbr", { defaultValue: "m" })}
                            </button>
                        ))}
                    </div>
                    <input
                        type="number"
                        {...register("duration", { valueAsNumber: true })}
                        className="w-full rounded-lg border bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 mt-1"
                        placeholder={t("languages.form.customMinutesPlaceholder", {
                            defaultValue: "Minutos personalizados",
                        })}
                    />
                    {errors.duration?.message && (
                        <p className="text-[10px] text-destructive">
                            {t(errors.duration.message)}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-[11px] font-medium text-muted-foreground">
                        {t("languages.form.notesLabel", { defaultValue: "Notas (Opcional)" })}
                    </label>
                    <textarea
                        {...register("notes")}
                        className="w-full rounded-lg border bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 h-10 resize-none"
                        placeholder={t("languages.form.notesPlaceholder", {
                            defaultValue: "Ej. Aprendidas 10 palabras sobre negocios...",
                        })}
                    />
                    {errors.notes?.message && (
                        <p className="text-[10px] text-destructive">
                            {t(errors.notes.message)}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer mt-auto"
                >
                    {isSaving ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <>
                            <Plus className="h-3.5 w-3.5" />{" "}
                            {t("languages.form.submitButton", { defaultValue: "Guardar Bloque" })}
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}