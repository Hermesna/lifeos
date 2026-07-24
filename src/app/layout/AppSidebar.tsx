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
    const [internalIsOpen, setInternalIsOpen] = useState(true)

    const isCollapsed = externalIsOpen !== undefined ? !externalIsOpen : !internalIsOpen
    const handleToggle = onToggle || (() => setInternalIsOpen((prev) => !prev))

    return (
        <aside
            className={[
                "flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
                isCollapsed ? "w-16" : "w-64",
            ].join(" ")}
        >
            <div
                className={[
                    "flex h-16 items-center border-b border-sidebar-border px-4 py-3",
                    isCollapsed ? "justify-center" : "justify-between",
                ].join(" ")}
            >
                {!isCollapsed && (
                    <h1 className="text-xl font-bold tracking-tight text-sidebar-primary truncate">
                        LifeOS
                    </h1>
                )}

                <button
                    onClick={handleToggle}
                    className="rounded-lg p-1.5 hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
                    title={isCollapsed ? t("sidebar.expand", "Expandir menú") : t("sidebar.collapse", "Colapsar menú")}
                >
                    {isCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
                </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1.5 p-2 overflow-y-auto">
                {navigation.map((item) => {
                    const Icon = item.icon

                    return (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            title={isCollapsed ? t(String(item.title)) : undefined}
                            className={({ isActive }) =>
                                [
                                    "flex items-center gap-3 rounded-lg py-2.5 transition-all duration-200",
                                    isCollapsed ? "justify-center px-2" : "px-3",
                                    isActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-md shadow-primary/10"
                                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-primary",
                                ].join(" ")
                            }
                        >
                            <Icon size={20} className="shrink-0" />
                            {!isCollapsed && (
                                <span className="truncate">{t(String(item.title))}</span>
                            )}
                        </NavLink>
                    )
                })}
            </nav>
        </aside>
    )
}