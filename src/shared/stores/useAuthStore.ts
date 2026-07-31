import { create } from "zustand"
import { persist } from "zustand/middleware"
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut, 
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    type User as FirebaseUser 
} from "firebase/auth"
import { auth } from "@/shared/lib/firebase"

export interface UserProfile {
    id: string
    name: string
    email: string
    avatarUrl?: string
    role?: string
}

interface AuthState {
    user: UserProfile | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    initAuth: () => void
    login: (email: string, pass: string) => Promise<void>
    register: (email: string, pass: string) => Promise<void>
    loginWithGoogle: () => Promise<void>
    logout: () => Promise<void>
    updateUser: (updatedData: Partial<UserProfile>) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,

            initAuth: () => {
                onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
                    if (firebaseUser) {
                        const token = await firebaseUser.getIdToken()
                        const userProfile: UserProfile = {
                            id: firebaseUser.uid,
                            name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Usuario",
                            email: firebaseUser.email || "",
                            avatarUrl: firebaseUser.photoURL || undefined,
                        }
                        set({ user: userProfile, token, isAuthenticated: true, isLoading: false })
                    } else {
                        set({ user: null, token: null, isAuthenticated: false, isLoading: false })
                    }
                })
            },

            login: async (email, pass) => {
                const credential = await signInWithEmailAndPassword(auth, email, pass)
                const token = await credential.user.getIdToken()
                const userProfile: UserProfile = {
                    id: credential.user.uid,
                    name: credential.user.displayName || email.split("@")[0],
                    email: credential.user.email || email,
                    avatarUrl: credential.user.photoURL || undefined,
                }
                set({ user: userProfile, token, isAuthenticated: true })
            },

            register: async (email, pass) => {
                const credential = await createUserWithEmailAndPassword(auth, email, pass)
                const token = await credential.user.getIdToken()
                const userProfile: UserProfile = {
                    id: credential.user.uid,
                    name: email.split("@")[0],
                    email: credential.user.email || email,
                }
                set({ user: userProfile, token, isAuthenticated: true })
            },

            loginWithGoogle: async () => {
                const provider = new GoogleAuthProvider()
                const credential = await signInWithPopup(auth, provider)
                const token = await credential.user.getIdToken()
                const userProfile: UserProfile = {
                    id: credential.user.uid,
                    name: credential.user.displayName || "Usuario",
                    email: credential.user.email || "",
                    avatarUrl: credential.user.photoURL || undefined,
                }
                set({ user: userProfile, token, isAuthenticated: true })
            },

            logout: async () => {
                await signOut(auth)
                set({ user: null, token: null, isAuthenticated: false })
            },

            updateUser: (updatedData) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updatedData } : null,
                })),
        }),
        {
            name: "lifeos-auth",
        }
    )
)