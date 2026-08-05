import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Plus, BookOpen, CheckCircle, Clock, Library, Star } from "lucide-react"
import { useBooksStore, type Book } from "../stores/useBooksStore"
import { BookFormModal } from "./BookFormModal"

type FilterStatus = "all" | "reading" | "completed" | "pending"

const getRatingColor = (rating: number) => {
    if (rating <= 3) {
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
    }
    if (rating <= 6) {
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
    }
    if (rating <= 8) {
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
    }
    return "bg-violet-500/15 text-violet-600 dark:text-violet-300 border-violet-500/40 font-bold shadow-xs"
}

export function BooksPage() {
    const { t } = useTranslation()
    const { books } = useBooksStore()
    const [filter, setFilter] = useState<FilterStatus>("all")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingBook, setEditingBook] = useState<Book | null>(null)

    const getBookStatus = (book: Book): "reading" | "completed" | "pending" => {
        if (book.readPages >= book.totalPages) return "completed"
        if (book.readPages > 0) return "reading"
        return "pending"
    }

    const filteredBooks = useMemo(() => {
        if (filter === "all") return books
        return books.filter((book) => getBookStatus(book) === filter)
    }, [books, filter])

    const counts = useMemo(() => {
        return books.reduce(
            (acc, book) => {
                const status = getBookStatus(book)
                acc[status]++
                acc.all++
                return acc
            },
            { all: 0, reading: 0, completed: 0, pending: 0 }
        )
    }, [books])

    const handleEdit = (book: Book) => {
        setEditingBook(book)
        setIsModalOpen(true)
    }

    const handleCreate = () => {
        setEditingBook(null)
        setIsModalOpen(true)
    }

    return (
        <div className="space-y-4 p-3 sm:p-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                    <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                        {t("books.title", { defaultValue: "Librería" })}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        {t("books.subtitle", { defaultValue: "Gestiona tus lecturas y progreso" })}
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-xl sm:rounded-lg hover:bg-primary/90 transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("books.addBook", { defaultValue: "Añadir libro" })}</span>
                    <span className="sm:hidden">{t("books.addBookShort", { defaultValue: "Añadir" })}</span>
                </button>
            </div>

            <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
                <button
                    onClick={() => setFilter("all")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-colors cursor-pointer shrink-0 ${filter === "all"
                            ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                            : "text-muted-foreground hover:bg-accent/50"
                        }`}
                >
                    <Library className="h-3.5 w-3.5" />
                    <span>{t("books.filters.all", { defaultValue: "Todos" })}</span>
                    <span className="ml-1 rounded-full bg-muted px-1.5 py-0.2 text-[10px]">
                        {counts.all}
                    </span>
                </button>

                <button
                    onClick={() => setFilter("reading")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-colors cursor-pointer shrink-0 ${filter === "reading"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold shadow-xs"
                            : "text-muted-foreground hover:bg-accent/50"
                        }`}
                >
                    <BookOpen className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span>{t("books.filters.reading", { defaultValue: "Leyendo" })}</span>
                    <span className="ml-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.2 text-[10px]">
                        {counts.reading}
                    </span>
                </button>

                <button
                    onClick={() => setFilter("completed")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-colors cursor-pointer shrink-0 ${filter === "completed"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
                            : "text-muted-foreground hover:bg-accent/50"
                        }`}
                >
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{t("books.filters.completed", { defaultValue: "Terminados" })}</span>
                    <span className="ml-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 text-[10px]">
                        {counts.completed}
                    </span>
                </button>

                <button
                    onClick={() => setFilter("pending")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-colors cursor-pointer shrink-0 ${filter === "pending"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold shadow-xs"
                            : "text-muted-foreground hover:bg-accent/50"
                        }`}
                >
                    <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span>{t("books.filters.pending", { defaultValue: "Pendientes" })}</span>
                    <span className="ml-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.2 text-[10px]">
                        {counts.pending}
                    </span>
                </button>
            </div>

            {filteredBooks.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-2xl">
                    <p className="text-xs text-muted-foreground">
                        {t("books.empty", { defaultValue: "No hay libros en este estado." })}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredBooks.map((book) => {
                        const status = getBookStatus(book)
                        const progress = Math.min(
                            100,
                            Math.round((book.readPages / book.totalPages) * 100)
                        )

                        return (
                            <div
                                key={book.id}
                                onClick={() => handleEdit(book)}
                                className="group relative border border-border rounded-2xl p-4 bg-card hover:border-primary/50 transition-all cursor-pointer space-y-3 shadow-xs"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="space-y-0.5 min-w-0">
                                        <h3 className="text-xs sm:text-sm font-semibold line-clamp-1">{book.title}</h3>
                                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                                            {book.author}
                                        </p>
                                    </div>

                                    {book.rating ? (
                                        <div
                                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold shrink-0 ${getRatingColor(
                                                book.rating
                                            )}`}
                                        >
                                            <Star className="h-3 w-3 fill-current shrink-0" />
                                            <span>{book.rating}/10</span>
                                        </div>
                                    ) : (
                                        <span
                                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${status === "completed"
                                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                    : status === "reading"
                                                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                }`}
                                        >
                                            {status === "completed"
                                                ? t("books.status.completed", { defaultValue: "Terminado" })
                                                : status === "reading"
                                                    ? t("books.status.reading", { defaultValue: "Leyendo" })
                                                    : t("books.status.pending", { defaultValue: "Pendiente" })}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-1.5 pt-1">
                                    <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                                        <span>
                                            {book.readPages} / {book.totalPages} págs.
                                        </span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${status === "completed" ? "bg-emerald-500" : "bg-primary"
                                                }`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <BookFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                bookToEdit={editingBook}
            />
        </div>
    )
}