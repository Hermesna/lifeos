import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { BookOpen, ArrowRight, BookmarkCheck, Star } from "lucide-react"
import { useBooksStore } from "@/features/books/stores/useBooksStore"

export function BooksWidget() {
    const { t } = useTranslation()
    const books = useBooksStore((state) => state.books)
    const currentBook = books.find((b) => b.readPages < b.totalPages) || books[0]
    const progress = currentBook && currentBook.totalPages > 0
        ? Math.min(Math.round((currentBook.readPages / currentBook.totalPages) * 100), 100)
        : 0

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col justify-between hover:border-border/80 transition-colors shadow-xs">
            <div className="bg-blue-500/10 dark:bg-blue-500/5 px-4 py-3 border-b border-blue-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-blue-500 text-white shadow-xs">
                        <BookOpen className="h-3.5 w-3.5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            {t("booksWidget.library", { defaultValue: "Biblioteca" })}
                        </span>
                        <h3 className="text-xs font-semibold">
                            {t("booksWidget.title", { defaultValue: "Lectura Actual" })}
                        </h3>
                    </div>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {t("booksWidget.count", {
                        count: books.length,
                        defaultValue: "{{count}} libro",
                        other: "{{count}} libros",
                    })}
                </span>
            </div>

            {!currentBook ? (
                <div className="p-4 text-center">
                    <p className="text-xs text-muted-foreground py-2">
                        {t("booksWidget.empty", { defaultValue: "No hay libros en tu estantería." })}
                    </p>
                </div>
            ) : (
                <div className="p-4 flex gap-3.5 items-center">
                    <div className="relative shrink-0 w-12 h-16 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-md flex flex-col justify-between p-1.5 border-l-2 border-blue-400/50">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/20 rounded-l-md" />
                        <span className="text-[8px] font-bold tracking-tighter line-clamp-2 opacity-90">
                            {currentBook.title}
                        </span>
                        <span className="text-[8px] opacity-75 self-end">
                            {progress}%
                        </span>
                    </div>

                    <div className="space-y-2 flex-1 min-w-0">
                        <div>
                            <p className="text-xs font-bold truncate text-foreground">{currentBook.title}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{currentBook.author}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <BookmarkCheck className="h-3 w-3 text-blue-500" />
                                    {t("booksWidget.pages", {
                                        read: currentBook.readPages,
                                        total: currentBook.totalPages,
                                        defaultValue: "Pág. {{read}} de {{total}}",
                                    })}
                                </span>
                                {currentBook.rating && (
                                    <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                                        <Star className="h-2.5 w-2.5 fill-amber-500" />
                                        {currentBook.rating}
                                    </span>
                                )}
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
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
                <ArrowRight className="h-3 w-3" />
            </Link>
        </div>
    )
}