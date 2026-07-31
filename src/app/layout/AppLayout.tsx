import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { AppHeader } from "@/app/layout/AppHeader"
import { AppSidebar } from "@/app/layout/AppSidebar"
import { useThemeStore } from "@/shared/stores/useThemeStore"
import { useAuthStore } from "@/shared/stores/useAuthStore"

export function AppLayout() {
    const initTheme = useThemeStore((state) => state.initTheme)
    const initAuth = useAuthStore((state) => state.initAuth)
    const isLoading = useAuthStore((state) => state.isLoading)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    useEffect(() => {
        initTheme()
        initAuth()
    }, [initTheme, initAuth])

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
        <div className="flex h-screen bg-background text-foreground transition-colors duration-200">
            <AppSidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen((prev) => !prev)}
            />

            <div className="flex flex-1 flex-col overflow-hidden">
                <AppHeader />

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}