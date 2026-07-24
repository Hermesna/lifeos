import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { AppHeader } from "@/app/layout/AppHeader"
import { AppSidebar } from "@/app/layout/AppSidebar"
import { useThemeStore } from "@/shared/stores/useThemeStore"

export function AppLayout() {
    const initTheme = useThemeStore((state) => state.initTheme)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    useEffect(() => {
        initTheme()
    }, [initTheme])

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