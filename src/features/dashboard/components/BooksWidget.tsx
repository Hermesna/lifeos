import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { BookOpen, ArrowRight, BookmarkCheck, Star, BookMarked } from "lucide-react"
import { useBooksStore } from "@/features/books/stores/useBooksStore"

export function BooksWidget() {
    const { t } = useTranslation()
    const books = useBooksStore((state) => state.books)
    const currentBook = books.find((b) => b.readPages < b.totalPages) || books[0]
    const progress = currentBook && currentBook.totalPages > 0
        ? Math.min(Math.round((currentBook.readPages / currentBook.totalPages) * 100), 100)
        : 0

    const getBookStatusLabel = (read: number, total: number) => {
        if (read >= total) return t("books.status.completed", { defaultValue: "Terminado" })
        if (read > 0) return t("books.status.reading", { defaultValue: "Leyendo" })
        return t("books.status.pending", { defaultValue: "Pendiente" })
    }

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col justify-between hover:border-border/85 transition-colors shadow-xs min-h-[145px]">
            <div className="bg-blue-500/10 dark:bg-blue-500/5 px-4 py-3 border-b border-blue-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-xl bg-blue-500 text-white shadow-xs shrink-0">
                        <BookOpen className="h-3.5 w-3.5" />
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            {t("booksWidget.library", { defaultValue: "Biblioteca" })}
                        </span>
                        <h3 className="text-xs font-semibold">
                            {t("booksWidget.title", { defaultValue: "Lectura Actual" })}
                        </h3>
                    </div>
                </div>
                <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                    {t("booksWidget.count", {
                        count: books.length,
                        defaultValue: "{{count}} libro",
                        other: "{{count}} libros",
                    })}
                </span>
            </div>

            {!currentBook ? (
                <div className="p-5 text-center">
                    <p className="text-xs text-muted-foreground py-2">
                        {t("booksWidget.empty", { defaultValue: "No hay libros en tu estantería." })}
                    </p>
                </div>
            ) : (
                <div className="p-4 flex gap-3.5 items-center">
                    <div className="relative shrink-0 w-12 h-16 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-md flex flex-col justify-between p-1.5 border-l-2 border-blue-400/50">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/20 rounded-l-lg" />
                        <span className="text-[8px] font-bold tracking-tighter line-clamp-2 opacity-90">
                            {currentBook.title}
                        </span>
                        <span className="text-[8px] opacity-75 self-end font-medium">
                            {progress}%
                        </span>
                    </div>

                    <div className="space-y-2.5 flex-1 min-w-0">
                        <div className="space-y-0.5">
                            <p className="text-xs font-bold truncate text-foreground" title={currentBook.title}>
                                {currentBook.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate" title={currentBook.author}>
                                {currentBook.author}
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-[11px] text-muted-foreground font-medium gap-2">
                                <span className="flex items-center gap-1 shrink-0">
                                    <BookmarkCheck className="h-3 w-3 text-blue-500 shrink-0" />
                                    <span>
                                        {t("booksWidget.pages", {
                                            read: currentBook.readPages,
                                            total: currentBook.totalPages,
                                            defaultValue: "Pág. {{read}} de {{total}}",
                                        })}
                                    </span>
                                </span>

                                {currentBook.rating ? (
                                    <span className="flex items-center gap-0.5 text-amber-500 font-semibold shrink-0">
                                        <Star className="h-2.5 w-2.5 fill-amber-500 shrink-0" />
                                        {currentBook.rating}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                                        <BookMarked className="h-2.5 w-2.5 shrink-0" />
                                        {getBookStatusLabel(currentBook.readPages, currentBook.totalPages)}
                                    </span>
                                )}
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Link
                to="/books"
                className="px-4 py-2.5 bg-accent/20 flex items-center justify-between text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors border-t border-border/40"
            >
                <span>{t("booksWidget.manage", { defaultValue: "Explorar estantería completa" })}</span>
                <ArrowRight className="h-3 w-3 shrink-0" />
            </Link>
        </div>
    )
}