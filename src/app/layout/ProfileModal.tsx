import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "@/shared/stores/useAuthStore"
import { X, User, Mail, Shield, Save } from "lucide-react"

interface ProfileModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { t } = useTranslation()
    const { user } = useAuthStore()

    const [name, setName] = useState(user?.name || "")
    const [bio, setBio] = useState("")

    if (!isOpen) return null

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        // Aquí el store o la petición a tu API
        onClose()
    }

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-xl space-y-5 animate-in zoom-in-95 duration-150">

                <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold">
                            {t("header.profile", { defaultValue: "Mi Perfil" })}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-accent/30">
                    <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shrink-0 shadow-sm">
                        {userInitial}
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                        <p className="text-sm font-semibold truncate">
                            {user?.name || t("profile.defaultUser", { defaultValue: "Usuario" })}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {user?.email || "sin_email@lifeos.dev"}
                        </p>
                        <div className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                            <Shield className="h-3 w-3" />
                            <span>{t("profile.verifiedAccount", { defaultValue: "Cuenta Verificada" })}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-3">

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t("profile.username", { defaultValue: "Nombre de usuario" })}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t("profile.email", { defaultValue: "Correo Electrónico" })}
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground cursor-not-allowed"
                            />
                            <Mail className="absolute right-3 top-2 h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t("profile.bio", { defaultValue: "Biografía / Notas" })}
                        </label>
                        <textarea
                            rows={2}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder={t("profile.bioPlaceholder", { defaultValue: "Añade un breve resumen personal..." })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                        >
                            {t("common.cancel", { defaultValue: "Cancelar" })}
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                            <Save className="h-3.5 w-3.5" />
                            {t("common.save", { defaultValue: "Guardar" })}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}