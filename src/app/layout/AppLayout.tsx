import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { AppHeader } from "@/app/layout/AppHeader"
import { AppSidebar } from "@/app/layout/AppSidebar"
import { useThemeStore } from "@/shared/stores/useThemeStore"
import { useAuthStore } from "@/shared/stores/useAuthStore"
import { useTravelStore } from "@/features/travel/stores/useTravelStore"
import { useBooksStore } from "@/features/books/stores/useBooksStore"
import { useHabitsStore } from "@/features/habits/stores/useHabitsStore"
import { useFinanceStore } from "@/features/finance/stores/useFinanceStore"
import { useLanguagesStore } from "@/features/languages/stores/useLanguagesStore"

export function AppLayout() {
    const syncTheme = useThemeStore((state) => state.syncTheme)
    const initThemeFromDB = useThemeStore((state) => state.initThemeFromDB)
    const initAuth = useAuthStore((state) => state.initAuth)
    const isLoading = useAuthStore((state) => state.isLoading)
    const user = useAuthStore((state) => state.user)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        syncTheme()
        initAuth()
    }, [syncTheme, initAuth])

    useEffect(() => {
        if (!user || !user.id) return

        initThemeFromDB(user.id)

        const unsubscribeTravel = useTravelStore.getState().subscribeToTrips()
        const unsubscribeBooks = useBooksStore.getState().subscribeToBooks()
        const unsubscribeHabits = useHabitsStore.getState().subscribeToHabits()
        const unsubscribeFinance = useFinanceStore.getState().subscribeToFinance()
        const unsubscribeLanguages = useLanguagesStore.getState().subscribeToLanguages()

        return () => {
            unsubscribeTravel()
            unsubscribeBooks()
            unsubscribeHabits()
            unsubscribeFinance()
            unsubscribeLanguages()
        }
    }, [user, initThemeFromDB])

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <p className="text-xs text-muted-foreground">Cargando LifeOS...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-background text-foreground transition-colors duration-200 overflow-hidden">
            <AppSidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen((prev) => !prev)}
            />

            <div className="flex flex-1 flex-col overflow-hidden">
                <AppHeader 
                    onMenuClick={() => setIsSidebarOpen((prev) => !prev)} 
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}