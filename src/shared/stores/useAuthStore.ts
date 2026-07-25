import { create } from "zustand"
import { persist } from "zustand/middleware"

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
    login: (user: UserProfile, token: string) => void
    logout: () => void
    updateUser: (updatedData: Partial<UserProfile>) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: {
                id: "usr_123",
                name: "Hermes",
                email: "hermesnunezalcaraz@gmail.com",
            },
            token: "mock_jwt_token",
            isAuthenticated: true,

            login: (user, token) =>
                set({
                    user,
                    token,
                    isAuthenticated: true,
                }),

            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                }),

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