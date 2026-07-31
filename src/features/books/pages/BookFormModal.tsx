import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { X, Star } from "lucide-react"
import { useBooksStore, type Book } from "../stores/useBooksStore"

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border bg-card p-4 shadow-lg">
                <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-sm font-semibold">
                        {bookToEdit
                            ? t("books.form.editTitle", { defaultValue: "Editar libro" })
                            : t("books.form.addTitle", { defaultValue: "Añadir libro" })}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-muted-foreground hover:bg-accent cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-3">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t("books.form.titleLabel", { defaultValue: "Título" })}
                        </label>
                        <input
                            {...register("title")}
                            className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder={t("books.form.titlePlaceholder", {
                                defaultValue: "Ej. Clean Architecture",
                            })}
                        />
                        {errors.title?.message && (
                            <p className="text-[10px] text-destructive">
                                {t(errors.title.message)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t("books.form.authorLabel", { defaultValue: "Autor" })}
                        </label>
                        <input
                            {...register("author")}
                            className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder={t("books.form.authorPlaceholder", {
                                defaultValue: "Ej. Robert C. Martin",
                            })}
                        />
                        {errors.author?.message && (
                            <p className="text-[10px] text-destructive">
                                {t(errors.author.message)}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t("books.form.totalPagesLabel", { defaultValue: "Páginas totales" })}
                            </label>
                            <input
                                type="number"
                                {...register("totalPages", { valueAsNumber: true })}
                                className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            {errors.totalPages?.message && (
                                <p className="text-[10px] text-destructive">
                                    {t(errors.totalPages.message)}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t("books.form.readPagesLabel", { defaultValue: "Páginas leídas" })}
                            </label>
                            <input
                                type="number"
                                {...register("readPages", { valueAsNumber: true })}
                                className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            {errors.readPages?.message && (
                                <p className="text-[10px] text-destructive">
                                    {t(errors.readPages.message)}
                                </p>
                            )}
                        </div>
                    </div>

                    {isCompleted && (
                        <div className="space-y-1.5 rounded-lg border bg-amber-500/5 p-2.5 border-amber-500/20">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-current" />
                                    {t("books.form.ratingLabel", { defaultValue: "Valoración (1 a 10)" })}
                                </label>
                            </div>
                            <div className="flex gap-1 overflow-x-auto pb-1">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setValue("rating", num)}
                                        className={`flex-1 min-w-[28px] py-1 text-xs rounded border transition-colors cursor-pointer ${currentRating === num
                                                ? "bg-amber-500 text-white border-amber-500 font-semibold"
                                                : "bg-background hover:bg-accent"
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 text-xs rounded-lg border hover:bg-accent cursor-pointer"
                        >
                            {t("common.cancel", { defaultValue: "Cancelar" })}
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1.5 text-xs rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 cursor-pointer"
                        >
                            {t("common.save", { defaultValue: "Guardar" })}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}