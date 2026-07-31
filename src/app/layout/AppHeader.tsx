import { useState, useRef, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { navigation } from "@/shared/constants/navigation"
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle"
import { LanguageToggle } from "@/shared/components/ui/LanguageToggle"
import { useAuthStore } from "@/shared/stores/useAuthStore"
import { ProfileModal } from "./ProfileModal"
import { SettingsModal } from "./SettingsModal"
import { User, Settings, LogOut } from "lucide-react"

export function AppHeader() {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)

    const currentRoute = navigation.find((item) => item.href === location.pathname)
    const pageTitle = currentRoute ? t(currentRoute.title) : t("navigation.dashboard")

    const handleLogout = () => {
        setIsProfileDropdownOpen(false)
        logout()
        navigate("/login")
    }

    const handleOpenProfileModal = () => {
        setIsProfileDropdownOpen(false)
        setIsProfileModalOpen(true)
    }

    const handleOpenSettingsModal = () => {
        setIsProfileDropdownOpen(false)
        setIsSettingsModalOpen(true)
    }

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U"

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <>
            <header className="flex h-16 items-center justify-between border-b border-border bg-header px-6 text-foreground transition-colors duration-200 z-40">
                <h2 className="text-lg font-semibold text-primary transition-all duration-200">
                    {pageTitle}
                </h2>

                <div className="flex items-center gap-2.5">
                    <LanguageToggle />
                    <ThemeToggle />

                    <div className="h-4 w-[1px] bg-border mx-1" />

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring/50 cursor-pointer"
                            aria-haspopup="true"
                            aria-expanded={isProfileDropdownOpen}
                        >
                            {userInitial}
                        </button>

                        {isProfileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-150 z-50">

                                <div
                                    onClick={handleOpenProfileModal}
                                    className="px-3 py-2 text-xs border-b border-border/60 mb-1 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                                >
                                    <p className="font-medium text-foreground">
                                        {user?.name || "Usuario"}
                                    </p>
                                    <p className="text-muted-foreground truncate">
                                        {user?.email || "sin_email@lifeos.dev"}
                                    </p>
                                </div>

                                <div className="space-y-0.5">
                                    <button
                                        onClick={handleOpenProfileModal}
                                        className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-left cursor-pointer"
                                    >
                                        <User size={16} className="text-muted-foreground" />
                                        <span>{t("header.profile", { defaultValue: "Perfil" })}</span>
                                    </button>

                                    <button
                                        onClick={handleOpenSettingsModal}
                                        className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-left cursor-pointer"
                                    >
                                        <Settings size={16} className="text-muted-foreground" />
                                        <span>{t("header.settings", { defaultValue: "Ajustes" })}</span>
                                    </button>
                                </div>

                                <div className="my-1 border-t border-border/60" />

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left font-medium cursor-pointer"
                                >
                                    <LogOut size={16} />
                                    <span>{t("header.logout", { defaultValue: "Cerrar sesión" })}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />

            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
            />
        </>
    )
}