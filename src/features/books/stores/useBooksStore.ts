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
    query 
} from "firebase/firestore"

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
    subscribeToBooks: () => () => void
    addBook: (book: Omit<Book, "id">) => Promise<void>
    updateBook: (id: string, book: Partial<Omit<Book, "id">>) => Promise<void>
    deleteBook: (id: string) => Promise<void>
}

export const useBooksStore = create<BooksState>()(
    persist(
        (set) => ({
            books: [],

            subscribeToBooks: () => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return () => {}

                const booksRef = collection(db, "users", userId, "books")
                const q = query(booksRef)

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const booksData = snapshot.docs.map((docSnap) => ({
                        ...(docSnap.data() as Book),
                        id: docSnap.id,
                    }))

                    set({ books: booksData })
                })

                return unsubscribe
            },

            addBook: async (newBook) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const id = crypto.randomUUID()
                const bookRef = doc(db, "users", userId, "books", id)

                const bookData: Book = {
                    ...newBook,
                    id,
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
        }),
        { name: "lifeos-books-storage" }
    )
)