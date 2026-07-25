import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Plus, Trash2, CalendarDays } from "lucide-react"
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
  const deleteItineraryItem = useTravelStore((s) => s.deleteItineraryItem)

  const [day, setDay] = useState<number | "">(1)
  const [activity, setActivity] = useState("")

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activity.trim()) return

    const parsedDay = typeof day === "number" ? day : Number(day) || 1

    addItineraryItem(tripId, parsedDay, activity.trim())
    setActivity("")
  }

  const sortedItinerary = [...itinerary].sort((a, b) => a.day - b.day)

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
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
          className="flex items-center justify-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
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
          sortedItinerary.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-background/50 hover:bg-background transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-secondary text-[11px] font-semibold text-secondary-foreground shrink-0">
                  {t("travel.itinerary.dayTag", "Día {{day}}", { day: item.day })}
                </span>
                <p className="text-sm font-medium leading-tight">{item.activity}</p>
              </div>

              <button
                type="button"
                onClick={() => deleteItineraryItem(tripId, item.id)}
                className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                title={t("travel.itinerary.delete", "Eliminar")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}