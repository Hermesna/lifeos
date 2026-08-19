import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Plus, Trash2, CalendarDays, Pencil, Check, X } from "lucide-react"
import { useTravelStore, type ItineraryItem } from "../stores/useTravelStore"

interface ItineraryModuleProps {
    tripId: string
    itinerary?: ItineraryItem[]
}

export function ItineraryModule({
    tripId,
    itinerary = [],
}: ItineraryModuleProps) {
    const { t } = useTranslation()
    const addItineraryItem = useTravelStore((s) => s.addItineraryItem)
    const updateItineraryItem = useTravelStore((s) => s.updateItineraryItem)
    const deleteItineraryItem = useTravelStore((s) => s.deleteItineraryItem)

    const [day, setDay] = useState<number | "">(1)
    const [activity, setActivity] = useState("")

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editDay, setEditDay] = useState<number | "">(1)
    const [editActivity, setEditActivity] = useState("")

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        if (!activity.trim()) return

        const parsedDay = typeof day === "number" ? day : Number(day) || 1

        addItineraryItem(tripId, parsedDay, activity.trim())
        setActivity("")
    }

    const startEditing = (item: ItineraryItem) => {
        setEditingId(item.id)
        setEditDay(item.day)
        setEditActivity(item.activity)
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditDay(1)
        setEditActivity("")
    }

    const handleSaveEdit = (itemId: string) => {
        if (!editActivity.trim()) return
        const parsedDay = typeof editDay === "number" ? editDay : Number(editDay) || 1

        updateItineraryItem(tripId, itemId, parsedDay, editActivity.trim())
        cancelEditing()
    }

    const sortedItinerary = [...itinerary].sort((a, b) => a.day - b.day)

    return (
        <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-semibold text-base flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    {t("travel.itinerary.title", "Itinerario / Agenda")}
                </h3>
                <span className="text-xs text-muted-foreground font-medium">
                    {itinerary.length}{" "}
                    {t("travel.itinerary.activities", "actividades")}
                </span>
            </div>

            <form onSubmit={handleAdd} className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                <div className="flex items-center gap-2 sm:col-span-1">
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                        {t("travel.itinerary.dayLabel", "Día:")}
                    </span>
                    <input
                        type="number"
                        min={1}
                        value={day}
                        onChange={(e) => {
                            const val = e.target.value
                            setDay(val === "" ? "" : Math.max(1, Number(val)))
                        }}
                        placeholder="1"
                        className="w-full rounded-lg border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <input
                    type="text"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    placeholder={t("travel.itinerary.titlePlaceholder", "Actividad o lugar...")}
                    className="rounded-lg border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 sm:col-span-2"
                />
                <button
                    type="submit"
                    className="flex items-center justify-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                >
                    <Plus className="h-3.5 w-3.5" />
                    {t("travel.itinerary.addBtn", "Añadir")}
                </button>
            </form>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {sortedItinerary.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-6 border border-dashed rounded-lg">
                        {t(
                            "travel.itinerary.empty",
                            "Aún no has planeado actividades para este viaje."
                        )}
                    </p>
                ) : (
                    sortedItinerary.map((item) => {
                        const isEditing = editingId === item.id

                        return (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-3 border rounded-lg bg-background/50 hover:bg-background transition-colors group gap-2"
                            >
                                {isEditing ? (
                                    <div className="flex items-center gap-2 w-full flex-wrap sm:flex-nowrap">
                                        <input
                                            type="number"
                                            min={1}
                                            value={editDay}
                                            onChange={(e) => {
                                                const val = e.target.value
                                                setEditDay(val === "" ? "" : Math.max(1, Number(val)))
                                            }}
                                            className="w-16 rounded-lg border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0"
                                        />
                                        <input
                                            type="text"
                                            value={editActivity}
                                            onChange={(e) => setEditActivity(e.target.value)}
                                            className="flex-1 rounded-lg border bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            autoFocus
                                        />
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => handleSaveEdit(item.id)}
                                                className="text-emerald-600 hover:text-emerald-700 p-1 rounded hover:bg-emerald-500/10 transition-colors cursor-pointer"
                                                title={t("common.save", "Guardar")}
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEditing}
                                                className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors cursor-pointer"
                                                title={t("common.cancel", "Cancelar")}
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="px-2 py-0.5 rounded bg-secondary text-[11px] font-semibold text-secondary-foreground shrink-0">
                                                {t("travel.itinerary.dayTag", "Día {{day}}", { day: item.day })}
                                            </span>
                                            <p className="text-sm font-medium leading-tight truncate">{item.activity}</p>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => startEditing(item)}
                                                className="text-muted-foreground hover:text-primary p-1 rounded transition-colors cursor-pointer"
                                                title={t("travel.itinerary.edit", "Editar")}
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteItineraryItem(tripId, item.id)}
                                                className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors cursor-pointer"
                                                title={t("travel.itinerary.delete", "Eliminar")}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}