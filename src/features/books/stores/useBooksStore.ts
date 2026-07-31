import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Book {
    id: string
    title: string
    author: string
    totalPages: number
    readPages: number
    rating?: number
}

interface BooksState {
    books: Book[]
    addBook: (book: Omit<Book, "id">) => void
    updateBook: (id: string, book: Partial<Omit<Book, "id">>) => void
    deleteBook: (id: string) => void
}

export const useBooksStore = create<BooksState>()(
    persist(
        (set) => ({
            books: [
                {
                    id: "1",
                    title: "Designing Data-Intensive Applications",
                    author: "Martin Kleppmann",
                    totalPages: 470,
                    readPages: 320,
                },
                {
                    id: "2",
                    title: "Clean Code",
                    author: "Robert C. Martin",
                    totalPages: 464,
                    readPages: 464,
                    rating: 9,
                },
                {
                    id: "3",
                    title: "Clean Architecture",
                    author: "Robert C. Martin",
                    totalPages: 432,
                    readPages: 432,
                    rating: 8,
                },
            ],
            addBook: (newBook) =>
                set((state) => ({
                    books: [
                        ...state.books,
                        { ...newBook, id: crypto.randomUUID() },
                    ],
                })),
            updateBook: (id, updatedData) =>
                set((state) => ({
                    books: state.books.map((b) =>
                        b.id === id ? { ...b, ...updatedData } : b
                    ),
                })),
            deleteBook: (id) =>
                set((state) => ({
                    books: state.books.filter((b) => b.id !== id),
                })),
        }),
        { name: "lifeos-books-storage" }
    )
)