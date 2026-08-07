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
import { auth, db } from "@/shared/lib/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"

export interface UserProfile {
    id: string
    name: string
    email: string
    avatarUrl?: string
    role?: string
    bio?: string
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
    updateUser: (updatedData: Partial<UserProfile> & { photoURL?: string | null }) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,

            initAuth: () => {
                onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
                    if (firebaseUser) {
                        const token = await firebaseUser.getIdToken()
                        const userRef = doc(db, "users", firebaseUser.uid)
                        const userSnap = await getDoc(userRef)

                        let userProfile: UserProfile

                        if (userSnap.exists()) {
                            userProfile = userSnap.data() as UserProfile
                        } else {
                            userProfile = {
                                id: firebaseUser.uid,
                                name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Usuario",
                                email: firebaseUser.email || "",
                                avatarUrl: firebaseUser.photoURL || undefined,
                                bio: "",
                            }
                            await setDoc(userRef, userProfile)
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

                const userRef = doc(db, "users", credential.user.uid)
                const userSnap = await getDoc(userRef)

                let userProfile: UserProfile
                if (userSnap.exists()) {
                    userProfile = userSnap.data() as UserProfile
                } else {
                    userProfile = {
                        id: credential.user.uid,
                        name: credential.user.displayName || email.split("@")[0],
                        email: credential.user.email || email,
                        avatarUrl: credential.user.photoURL || undefined,
                        bio: "",
                    }
                    await setDoc(userRef, userProfile)
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
                    bio: "",
                }

                const userRef = doc(db, "users", credential.user.uid)
                await setDoc(userRef, userProfile)

                set({ user: userProfile, token, isAuthenticated: true })
            },

            loginWithGoogle: async () => {
                const provider = new GoogleAuthProvider()
                const credential = await signInWithPopup(auth, provider)
                const token = await credential.user.getIdToken()

                const userRef = doc(db, "users", credential.user.uid)
                const userSnap = await getDoc(userRef)

                let userProfile: UserProfile
                if (userSnap.exists()) {
                    userProfile = userSnap.data() as UserProfile
                } else {
                    userProfile = {
                        id: credential.user.uid,
                        name: credential.user.displayName || "Usuario",
                        email: credential.user.email || "",
                        avatarUrl: credential.user.photoURL || undefined,
                        bio: "",
                    }
                    await setDoc(userRef, userProfile)
                }

                set({ user: userProfile, token, isAuthenticated: true })
            },

            logout: async () => {
                await signOut(auth)
                set({ user: null, token: null, isAuthenticated: false })
            },

            updateUser: async (updatedData) => {
                const currentUser = get().user
                if (!currentUser) return

                const { photoURL, ...restData } = updatedData as Partial<UserProfile> & { photoURL?: string | null }

                const dataToSave: Partial<UserProfile> = {
                    ...restData,
                    ...(photoURL !== undefined && {
                        avatarUrl: photoURL || undefined,
                    }),
                }

                const updatedProfile = { ...currentUser, ...dataToSave }
                set({ user: updatedProfile })

                const userRef = doc(db, "users", currentUser.id)
                await setDoc(userRef, dataToSave, { merge: true })
            },
        }),
        {
            name: "lifeos-auth",
        }
    )
)