import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "@/shared/stores/useAuthStore"
import { X, User, Mail, Shield, Save, Loader2 } from "lucide-react"

interface ProfileModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { t } = useTranslation()
    const { user, updateUser } = useAuthStore()

    const [name, setName] = useState(user?.name || "")
    const [bio, setBio] = useState(user?.bio || "")
    const [isLoading, setIsLoading] = useState(false)

    if (!isOpen) return null

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await updateUser({ name, bio })
            onClose()
        } catch (error) {
            console.error("Error al actualizar el perfil:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const userInitial = name ? name.charAt(0).toUpperCase() : "U"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-xl space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-150">

                <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <h3 className="text-sm sm:text-base font-semibold">
                            {t("header.profile", { defaultValue: "Mi Perfil" })}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-border bg-accent/30">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg sm:text-xl font-bold shrink-0 shadow-sm">
                        {userInitial}
                    </div>
                    <div className="space-y-0.5 overflow-hidden flex-1">
                        <p className="text-sm font-semibold truncate">
                            {name || t("profile.defaultUser", { defaultValue: "Usuario" })}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {user?.email || "sin_email@lifeos.dev"}
                        </p>
                        <div className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                            <Shield className="h-3 w-3 shrink-0" />
                            <span>{t("profile.verifiedAccount", { defaultValue: "Cuenta Verificada" })}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-3.5">

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t("profile.username", { defaultValue: "Nombre de usuario" })}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t("profile.email", { defaultValue: "Correo Electrónico" })}
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2 text-sm text-muted-foreground cursor-not-allowed pr-10"
                            />
                            <Mail className="absolute right-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t("profile.bio", { defaultValue: "Biografía / Notas" })}
                        </label>
                        <textarea
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder={t("profile.bioPlaceholder", { defaultValue: "Añade un breve resumen personal..." })}
                            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm rounded-xl border border-border hover:bg-accent transition-colors cursor-pointer font-medium disabled:opacity-50"
                        >
                            {t("common.cancel", { defaultValue: "Cancelar" })}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {isLoading ? t("common.saving", { defaultValue: "Guardando..." }) : t("common.save", { defaultValue: "Guardar" })}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}