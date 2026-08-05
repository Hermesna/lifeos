import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Plane, ArrowRight, Calendar, MapPin, Luggage } from "lucide-react"
import { useTravelStore } from "@/features/travel/stores/useTravelStore"
import { useAuthStore } from "@/shared/stores/useAuthStore"

export function TravelWidget() {
    const { t } = useTranslation()
    const user = useAuthStore((state) => state.user)
    const trips = useTravelStore((state) => state.trips)
    const activeTripId = useTravelStore((state) => state.activeTripId)
    const getUserTrips = useTravelStore((state) => state.getUserTrips)

    const userTrips = user ? getUserTrips(user.id) : trips
    const currentTrip = userTrips.find((t) => t.id === activeTripId) || userTrips[0]

    const formatDate = (dateStr: string) => {
        if (!dateStr) return ""
        const date = new Date(dateStr)
        return date.toLocaleDateString("es-ES", { month: "short", day: "numeric", year: "numeric" })
    }

    const getDaysRemaining = (dateStr: string) => {
        if (!dateStr) return null
        const diffTime = new Date(dateStr).getTime() - new Date().getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays > 0 ? diffDays : 0
    }

    const daysLeft = currentTrip ? getDaysRemaining(currentTrip.startDate) : null

    const packingList = currentTrip?.packingList ?? []
    const packedCount = packingList.filter((item) => item.packed).length
    const totalPacking = packingList.length

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col justify-between hover:border-border/85 transition-colors shadow-xs">
            <div className="bg-sky-500/10 dark:bg-sky-500/5 px-4 py-3 border-b border-dashed border-sky-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-xl bg-sky-500 text-white shadow-xs shrink-0">
                        <Plane className="h-3.5 w-3.5 -rotate-45" />
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                            {t("travelWidget.boardingPass", { defaultValue: "Boarding Pass" })}
                        </span>
                        <h3 className="text-xs font-semibold">
                            {t("travelWidget.title", { defaultValue: "Próximo Vuelo" })}
                        </h3>
                    </div>
                </div>
                {daysLeft !== null && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500 text-white shadow-xs shrink-0">
                        {daysLeft === 0
                            ? t("travelWidget.today", { defaultValue: "¡Es hoy!" })
                            : t("travelWidget.daysLeft", { days: daysLeft, defaultValue: "Faltan {{days}}d" })}
                    </span>
                )}
            </div>

            {!currentTrip ? (
                <div className="p-5 text-center">
                    <p className="text-xs text-muted-foreground py-2">
                        {t("travelWidget.empty", { defaultValue: "No hay expediciones registradas." })}
                    </p>
                </div>
            ) : (
                <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5 min-w-0">
                            <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">
                                {t("travelWidget.destination", { defaultValue: "Destino" })}
                            </span>
                            <p className="text-sm font-bold flex items-center gap-1.5 text-foreground truncate">
                                <MapPin className="h-4 w-4 text-sky-500 shrink-0" />
                                <span className="truncate">{currentTrip.destination}</span>
                            </p>
                        </div>
                        {currentTrip.budget > 0 && (
                            <div className="text-right shrink-0">
                                <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">
                                    {t("travelWidget.budget", { defaultValue: "Presupuesto" })}
                                </span>
                                <p className="text-xs font-bold text-foreground mt-0.5">
                                    {currentTrip.budget.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
                        <div className="bg-accent/40 p-2.5 rounded-xl border border-border/40">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium">
                                <Calendar className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                                <span className="truncate">{t("travelWidget.departure", { defaultValue: "Salida" })}</span>
                            </span>
                            <p className="text-xs font-semibold mt-1 truncate">{formatDate(currentTrip.startDate)}</p>
                        </div>

                        <div className="bg-accent/40 p-2.5 rounded-xl border border-border/40">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium">
                                <Luggage className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                                <span className="truncate">{t("travelWidget.luggage", { defaultValue: "Equipaje" })}</span>
                            </span>
                            <p className="text-xs font-semibold mt-1 truncate">
                                {t("travelWidget.packed", {
                                    packed: packedCount,
                                    total: totalPacking,
                                    defaultValue: "{{packed}}/{{total}} listos",
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Link
                to="/travel"
                className="px-4 py-2.5 bg-accent/20 flex items-center justify-between text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors border-t border-border/40"
            >
                <span>{t("travelWidget.manage", { defaultValue: "Gestionar itinerario y maletas" })}</span>
                <ArrowRight className="h-3 w-3 shrink-0" />
            </Link>
        </div>
    )
}