import { useState } from "react"
import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { PanelLeftClose, PanelLeft } from "lucide-react"
import { navigation } from "@/shared/constants/navigation"

interface AppSidebarProps {
    isOpen?: boolean
    onToggle?: () => void
}

export function AppSidebar({ isOpen: externalIsOpen, onToggle }: AppSidebarProps) {
    const { t } = useTranslation()
    const [internalIsOpen, setInternalIsOpen] = useState(false)

    const isCollapsed = externalIsOpen !== undefined ? !externalIsOpen : !internalIsOpen
    const handleToggle = onToggle || (() => setInternalIsOpen((prev) => !prev))

    return (
        <>
            {!isCollapsed && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden transition-opacity duration-300 ease-in-out"
                    onClick={handleToggle}
                />
            )}

            <aside
                className={[
                    "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out md:static md:translate-x-0",
                    isCollapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "translate-x-0 w-64",
                ].join(" ")}
            >
                <div
                    className={[
                        "flex h-16 items-center border-b border-sidebar-border px-4 py-3 overflow-hidden",
                        isCollapsed ? "md:justify-center" : "justify-between",
                    ].join(" ")}
                >
                    <h1
                        className={[
                            "text-xl font-bold tracking-tight text-sidebar-primary truncate whitespace-nowrap transition-all duration-300 ease-in-out",
                            isCollapsed ? "md:opacity-0 md:w-0 md:pointer-events-none" : "opacity-100 w-auto",
                        ].join(" ")}
                    >
                        LifeOS
                    </h1>

                    <button
                        type="button"
                        onClick={handleToggle}
                        className="rounded-lg p-1.5 hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors cursor-pointer shrink-0"
                        title={isCollapsed ? t("sidebar.expand", "Expandir menú") : t("sidebar.collapse", "Colapsar menú")}
                    >
                        {isCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
                    </button>
                </div>

                <nav className="flex flex-1 flex-col gap-1.5 p-2 overflow-y-auto overflow-x-hidden">
                    {navigation.map((item) => {
                        const Icon = item.icon

                        return (
                            <NavLink
                                key={item.href}
                                to={item.href}
                                onClick={() => {
                                    if (window.innerWidth < 768) {
                                        handleToggle()
                                    }
                                }}
                                title={isCollapsed ? t(String(item.title)) : undefined}
                                className={({ isActive }) =>
                                    [
                                        "flex items-center rounded-lg py-2.5 transition-all duration-200 cursor-pointer overflow-hidden whitespace-nowrap",
                                        isCollapsed ? "md:justify-center md:px-0 px-3 gap-0 md:gap-0" : "px-3 gap-3",
                                        isActive
                                            ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-md shadow-primary/10"
                                            : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-primary",
                                    ].join(" ")
                                }
                            >
                                <div className="shrink-0 flex items-center justify-center">
                                    <Icon size={20} />
                                </div>
                                <span
                                    className={[
                                        "truncate transition-all duration-300 ease-in-out",
                                        isCollapsed ? "md:opacity-0 md:w-0 md:pointer-events-none md:ml-0" : "opacity-100 w-auto ml-3",
                                    ].join(" ")}
                                >
                                    {t(String(item.title))}
                                </span>
                            </NavLink>
                        )
                    })}
                </nav>
            </aside>
        </>
    )
}