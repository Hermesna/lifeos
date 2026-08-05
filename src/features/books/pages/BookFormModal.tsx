import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { X, Star, Save } from "lucide-react"
import { useBooksStore, type Book } from "../stores/useBooksStore"
import { Button } from "@/components/ui/button"

const bookSchema = z
    .object({
        title: z.string().min(1, "books.form.errors.titleRequired"),
        author: z.string().min(1, "books.form.errors.authorRequired"),
        totalPages: z.coerce
            .number({ message: "books.form.errors.invalidNumber" })
            .min(1, "books.form.errors.minPages"),
        readPages: z.coerce
            .number({ message: "books.form.errors.invalidNumber" })
            .min(0, "books.form.errors.minReadPages"),
        rating: z.coerce.number().min(1).max(10).optional(),
    })
    .refine((data) => data.readPages <= data.totalPages, {
        message: "books.form.errors.readExceedsTotal",
        path: ["readPages"],
    })

type BookFormInput = z.input<typeof bookSchema>
type BookFormOutput = z.output<typeof bookSchema>

interface BookFormModalProps {
    isOpen: boolean
    onClose: () => void
    bookToEdit?: Book | null
}

export function BookFormModal({ isOpen, onClose, bookToEdit }: BookFormModalProps) {
    const { t } = useTranslation()
    const { addBook, updateBook } = useBooksStore()

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { errors },
    } = useForm<BookFormInput, unknown, BookFormOutput>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title: "",
            author: "",
            totalPages: 100,
            readPages: 0,
            rating: undefined,
        },
    })

    const [totalPages, readPages, currentRating] = useWatch({
        control,
        name: ["totalPages", "readPages", "rating"],
    })

    const isCompleted = Number(readPages) > 0 && Number(readPages) >= Number(totalPages)

    useEffect(() => {
        if (bookToEdit) {
            reset({
                title: bookToEdit.title,
                author: bookToEdit.author,
                totalPages: bookToEdit.totalPages,
                readPages: bookToEdit.readPages,
                rating: bookToEdit.rating,
            })
        } else {
            reset({
                title: "",
                author: "",
                totalPages: 100,
                readPages: 0,
                rating: undefined,
            })
        }
    }, [bookToEdit, reset, isOpen])

    if (!isOpen) return null

    const onSubmit = (data: BookFormOutput) => {
        const finalData = {
            ...data,
            rating: isCompleted ? data.rating : undefined,
        }

        if (bookToEdit) {
            updateBook(bookToEdit.id, finalData)
        } else {
            addBook(finalData)
        }
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">

                <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="text-sm sm:text-base font-semibold">
                        {bookToEdit
                            ? t("books.form.editTitle", { defaultValue: "Editar libro" })
                            : t("books.form.addTitle", { defaultValue: "Añadir libro" })}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t("books.form.titleLabel", { defaultValue: "Título" })}
                        </label>
                        <input
                            {...register("title")}
                            className="flex h-10 sm:h-9 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs sm:text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                            placeholder={t("books.form.titlePlaceholder", {
                                defaultValue: "Ej. Clean Architecture",
                            })}
                        />
                        {errors.title?.message && (
                            <p className="text-[11px] text-destructive">
                                {t(errors.title.message)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t("books.form.authorLabel", { defaultValue: "Autor" })}
                        </label>
                        <input
                            {...register("author")}
                            className="flex h-10 sm:h-9 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs sm:text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                            placeholder={t("books.form.authorPlaceholder", {
                                defaultValue: "Ej. Robert C. Martin",
                            })}
                        />
                        {errors.author?.message && (
                            <p className="text-[11px] text-destructive">
                                {t(errors.author.message)}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t("books.form.totalPagesLabel", { defaultValue: "Páginas totales" })}
                            </label>
                            <input
                                type="number"
                                {...register("totalPages", { valueAsNumber: true })}
                                className="flex h-10 sm:h-9 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs sm:text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                            />
                            {errors.totalPages?.message && (
                                <p className="text-[11px] text-destructive">
                                    {t(errors.totalPages.message)}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t("books.form.readPagesLabel", { defaultValue: "Páginas leídas" })}
                            </label>
                            <input
                                type="number"
                                {...register("readPages", { valueAsNumber: true })}
                                className="flex h-10 sm:h-9 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs sm:text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                            />
                            {errors.readPages?.message && (
                                <p className="text-[11px] text-destructive">
                                    {t(errors.readPages.message)}
                                </p>
                            )}
                        </div>
                    </div>

                    {isCompleted && (
                        <div className="space-y-2 rounded-xl border bg-amber-500/5 p-3 border-amber-500/20">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                    <Star className="h-4 w-4 fill-current shrink-0" />
                                    <span>{t("books.form.ratingLabel", { defaultValue: "Valoración (1 a 10)" })}</span>
                                </label>
                            </div>
                            <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-1.5">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setValue("rating", num)}
                                        className={`flex-1 min-w-[32px] py-2 text-xs rounded-xl border transition-all cursor-pointer font-medium ${currentRating === num
                                                ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                                                : "bg-background border-border hover:bg-accent text-foreground"
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 border-t border-border">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="w-full sm:w-auto"
                        >
                            {t("common.cancel", { defaultValue: "Cancelar" })}
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto"
                        >
                            <Save className="h-4 w-4 mr-1.5" />
                            {t("common.save", { defaultValue: "Guardar" })}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}