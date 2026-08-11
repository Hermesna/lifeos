import { useState, useMemo, useEffect, type DragEvent } from "react"
import { useTranslation } from "react-i18next"
import { Plus, BookOpen, CheckCircle, Clock, Library, Star, GripVertical, Trash2, AlertTriangle } from "lucide-react"
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
    const { books, subscribeToBooks, reorderBooks, deleteBook } = useBooksStore()
    const [filter, setFilter] = useState<FilterStatus>("all")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingBook, setEditingBook] = useState<Book | null>(null)
    const [bookToDelete, setBookToDelete] = useState<string | null>(null)

    const [localOrder, setLocalOrder] = useState<string[] | null>(null)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

    const orderedBooks = useMemo(() => {
        if (!localOrder) return books
        const bookMap = new Map(books.map((b) => [b.id, b]))
        const sorted: Book[] = []

        for (const id of localOrder) {
            const book = bookMap.get(id)
            if (book) {
                sorted.push(book)
                bookMap.delete(id)
            }
        }

        for (const book of bookMap.values()) {
            sorted.push(book)
        }

        return sorted
    }, [books, localOrder])

    const getBookStatus = (book: Book): "reading" | "completed" | "pending" => {
        if (book.readPages >= book.totalPages) return "completed"
        if (book.readPages > 0) return "reading"
        return "pending"
    }

    const filteredBooks = useMemo(() => {
        if (filter === "all") return orderedBooks
        return orderedBooks.filter((book) => getBookStatus(book) === filter)
    }, [orderedBooks, filter])

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

    const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
        setDraggedIndex(index)
        e.dataTransfer.effectAllowed = "move"
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    const handleDrop = async (e: DragEvent<HTMLDivElement>, targetIndex: number) => {
        e.preventDefault()
        if (draggedIndex === null || draggedIndex === targetIndex) return

        const updated = [...orderedBooks]
        const [movedItem] = updated.splice(draggedIndex, 1)
        updated.splice(targetIndex, 0, movedItem)

        const newIds = updated.map((book) => book.id)
        setLocalOrder(newIds)
        setDraggedIndex(null)

        await reorderBooks(newIds)
    }

    const confirmDeleteClick = (e: React.MouseEvent, bookId: string) => {
        e.stopPropagation()
        setBookToDelete(bookId)
    }

    const executeDelete = async (bookId: string) => {
        await deleteBook(bookId)
        setBookToDelete(null)
    }

    const handleEdit = (book: Book) => {
        setEditingBook(book)
        setIsModalOpen(true)
    }

    const handleCreate = () => {
        setEditingBook(null)
        setIsModalOpen(true)
    }

    useEffect(() => {
        const unsubscribe = subscribeToBooks()
        return () => {
            unsubscribe()
        }
    }, [subscribeToBooks])

    return (
        <div className="space-y-4 p-3 sm:p-5 max-w-5xl mx-auto w-full">
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

            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 border-b border-border pb-3">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 items-stretch">
                    {filteredBooks.map((book, index) => {
                        const status = getBookStatus(book)
                        const progress = Math.min(
                            100,
                            Math.round((book.readPages / book.totalPages) * 100)
                        )
                        const isConfirmingDelete = bookToDelete === book.id

                        return (
                            <div
                                key={book.id}
                                draggable={!isConfirmingDelete}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                onClick={() => !isConfirmingDelete && handleEdit(book)}
                                className="group relative border border-border rounded-2xl p-4 sm:pt-6 sm:pb-5 sm:px-5 bg-card hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing flex flex-col justify-between space-y-4 shadow-xs select-none overflow-hidden"
                            >
                                {isConfirmingDelete ? (
                                    <div
                                        className="absolute inset-0 bg-card/95 backdrop-blur-xs z-10 p-4 flex flex-col justify-center items-center text-center space-y-3 animate-in fade-in duration-200"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="p-2 sm:mt-2 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                            <AlertTriangle className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-semibold">
                                                {t("books.confirmDeleteTitle", { defaultValue: "¿Eliminar libro?" })}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground line-clamp-1 px-2">
                                                {book.title}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 pt-1">
                                            <button
                                                type="button"
                                                onClick={() => setBookToDelete(null)}
                                                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                                            >
                                                {t("common.cancel", { defaultValue: "Cancelar" })}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => executeDelete(book.id)}
                                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-xs"
                                            >
                                                {t("common.delete", { defaultValue: "Eliminar" })}
                                            </button>
                                        </div>
                                    </div>
                                ) : null}

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0 flex-1 w-full">
                                        <div className="text-muted-foreground/50 hover:text-foreground shrink-0 cursor-grab hidden sm:flex items-center justify-center">
                                            <GripVertical className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-0.5 min-w-0 flex-1">
                                            <h3 className="text-sm font-semibold break-words leading-tight">
                                                {book.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground break-words">
                                                {book.author}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50 w-full sm:w-auto">
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
                                                className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium shrink-0 ${status === "completed"
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

                                        <button
                                            type="button"
                                            onClick={(e) => confirmDeleteClick(e, book.id)}
                                            className="p-1.5 sm:p-1 text-muted-foreground/60 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                                            title={t("books.delete", { defaultValue: "Eliminar libro" })}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
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