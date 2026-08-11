import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useAuthStore } from "@/shared/stores/useAuthStore"
import { db } from "@/shared/lib/firebase"
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    query,
    writeBatch
} from "firebase/firestore"

export interface Book {
    id: string
    title: string
    author: string
    totalPages: number
    readPages: number
    rating?: number
    order?: number
}

interface BooksState {
    books: Book[]
    subscribeToBooks: () => () => void
    addBook: (book: Omit<Book, "id" | "order">) => Promise<void>
    updateBook: (id: string, book: Partial<Omit<Book, "id">>) => Promise<void>
    deleteBook: (id: string) => Promise<void>
    reorderBooks: (orderedIds: string[]) => Promise<void>
}

export const useBooksStore = create<BooksState>()(
    persist(
        (set) => ({
            books: [],

            subscribeToBooks: () => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return () => { }

                const booksRef = collection(db, "users", userId, "books")
                const q = query(booksRef)

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const booksData = snapshot.docs.map((docSnap) => ({
                        ...(docSnap.data() as Book),
                        id: docSnap.id,
                    }))

                    booksData.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

                    set({ books: booksData })
                })

                return unsubscribe
            },

            addBook: async (newBook) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const id = crypto.randomUUID()
                const bookRef = doc(db, "users", userId, "books", id)

                const currentBooks = useBooksStore.getState().books
                const nextOrder = currentBooks.length > 0
                    ? Math.max(...currentBooks.map(b => b.order ?? 0)) + 1
                    : 0

                const bookData: Book = {
                    ...newBook,
                    id,
                    order: nextOrder,
                }

                await setDoc(bookRef, bookData)
            },

            updateBook: async (id, updatedData) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const bookRef = doc(db, "users", userId, "books", id)
                await setDoc(bookRef, updatedData, { merge: true })
            },

            deleteBook: async (id) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const bookRef = doc(db, "users", userId, "books", id)
                await deleteDoc(bookRef)
            },

            reorderBooks: async (orderedIds) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const batch = writeBatch(db)

                orderedIds.forEach((id, index) => {
                    const bookRef = doc(db, "users", userId, "books", id)
                    batch.set(bookRef, { order: index }, { merge: true })
                })

                await batch.commit()
            },
        }),
        { name: "lifeos-books-storage" }
    )
)