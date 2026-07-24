export interface UserProfile {
    id: string
    name: string
    email: string
    avatarUrl?: string
    preferences: {
        language: string
        theme: "light" | "dark" | "system"
        currency: string
    }
}