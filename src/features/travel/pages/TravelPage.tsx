import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
    Compass,
    Calendar,
    Wallet,
    CheckSquare,
    Square,
    Trash2,
    Plus,
    Pencil,
    X,
    Check,
} from "lucide-react"
import { useTravelStore } from "../stores/useTravelStore"
import { useAuthStore } from "@/shared/stores/useAuthStore"
import { TravelForm } from "./TravelForm"
import { ItineraryModule } from "./ItineraryModule"

export function TravelPage() {
    const { t } = useTranslation()

    const trips = useTravelStore((state) => state.trips)
    const currentUserId = useAuthStore((state) => state.user?.id)

    const activeTripId = useTravelStore((state) => state.activeTripId)
    const setActiveTrip = useTravelStore((state) => state.setActiveTrip)
    const deleteTrip = useTravelStore((state) => state.deleteTrip)
    const updateTrip = useTravelStore((state) => state.updateTrip)
    const togglePackingItem = useTravelStore((state) => state.togglePackingItem)
    const addPackingItem = useTravelStore((state) => state.addPackingItem)
    const deletePackingItem = useTravelStore((state) => state.deletePackingItem)
    const updatePackingItem = useTravelStore((state) => state.updatePackingItem)

    const [newItemName, setNewItemName] = useState("")
    const [editingPackingId, setEditingPackingId] = useState<string | null>(null)
    const [editingPackingName, setEditingPackingName] = useState("")

    const [isEditingTrip, setIsEditingTrip] = useState(false)
    const [editDestination, setEditDestination] = useState("")
    const [editStartDate, setEditStartDate] = useState("")
    const [editBudget, setEditBudget] = useState(0)

    const userTrips = trips.filter((trip) => trip.userId === currentUserId)

    const activeTrip =
        userTrips.find((trip) => trip.id === activeTripId) || userTrips[0] || null

    const totalItems = activeTrip?.packingList?.length ?? 0
    const packedItems =
        activeTrip?.packingList?.filter((i) => i.packed).length ?? 0

    const packingProgress =
        totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault()
        if (!activeTrip || !newItemName.trim()) return

        addPackingItem(activeTrip.id, newItemName.trim())
        setNewItemName("")
    }

    const handleDeleteTrip = (id: string) => {
        deleteTrip(id)
        const remainingTrips = userTrips.filter((trip) => trip.id !== id)
        setActiveTrip(remainingTrips.length > 0 ? remainingTrips[0].id : null)
    }

    const handleStartEditingTrip = () => {
        if (!activeTrip) return
        setEditDestination(activeTrip.destination)
        setEditStartDate(activeTrip.startDate)
        setEditBudget(activeTrip.budget)
        setIsEditingTrip(true)
    }

    const handleSaveTrip = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!activeTrip) return

        await updateTrip(activeTrip.id, {
            destination: editDestination.trim(),
            startDate: editStartDate.trim(),
            budget: Number(editBudget),
        })
        setIsEditingTrip(false)
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 p-4">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {t("travel.title")}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t("travel.subtitle")}
                    </p>
                </div>

                {userTrips.length > 1 && (
                    <select
                        value={activeTrip?.id || ""}
                        onChange={(e) => {
                            setActiveTrip(e.target.value || null)
                            setIsEditingTrip(false)
                        }}
                        className="rounded-lg border bg-card px-3 py-1.5 text-sm font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                        {userTrips.map((trip) => (
                            <option key={trip.id} value={trip.id}>
                                {trip.destination}
                            </option>
                        ))}
                    </select>
                )}
            </header>

            <div className="grid gap-6 md:grid-cols-5 items-start">
                <main className="md:col-span-3 space-y-6">
                    {activeTrip ? (
                        <>
                            <div className="rounded-xl border bg-card p-6 shadow-xs space-y-5">
                                {isEditingTrip ? (
                                    <form onSubmit={handleSaveTrip} className="space-y-4">
                                        <div className="flex items-center justify-between border-b pb-3">
                                            <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-wider">
                                                <Compass className="h-3.5 w-3.5" />
                                                <span>Editando Expedición</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="submit"
                                                    className="p-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                                                    title="Guardar cambios"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditingTrip(false)}
                                                    className="p-1.5 text-muted-foreground hover:text-foreground border rounded-lg transition-colors cursor-pointer"
                                                    title="Cancelar"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground uppercase">
                                                    Título / Destino
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editDestination}
                                                    onChange={(e) => setEditDestination(e.target.value)}
                                                    required
                                                    className="w-full mt-1 rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                                                />
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div>
                                                    <label className="text-xs font-medium text-muted-foreground uppercase">
                                                        {t("travel.targetWindow")}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editStartDate}
                                                        onChange={(e) => setEditStartDate(e.target.value)}
                                                        required
                                                        className="w-full mt-1 rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-xs font-medium text-muted-foreground uppercase">
                                                        {t("travel.budget")} (€)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={editBudget}
                                                        onChange={(e) => setEditBudget(Number(e.target.value))}
                                                        required
                                                        min="0"
                                                        className="w-full mt-1 rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-wider mb-1">
                                                    <Compass className="h-3.5 w-3.5" />
                                                    {t("travel.nextExpedition")}
                                                </div>
                                                <h2 className="text-xl font-bold tracking-tight">
                                                    {activeTrip.destination}
                                                </h2>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={handleStartEditingTrip}
                                                    className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg transition-colors border bg-background/50 hover:bg-muted cursor-pointer"
                                                    title="Editar expedición"
                                                    type="button"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTrip(activeTrip.id)}
                                                    className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg transition-colors border bg-background/50 hover:bg-destructive/10 cursor-pointer"
                                                    title={t("travel.deleteTrip")}
                                                    type="button"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-secondary rounded-lg text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-medium text-muted-foreground uppercase">
                                                        {t("travel.targetWindow")}
                                                    </p>
                                                    <p className="text-sm font-semibold">
                                                        {activeTrip.startDate}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-secondary rounded-lg text-muted-foreground">
                                                    <Wallet className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-medium text-muted-foreground uppercase">
                                                        {t("travel.budget")}
                                                    </p>
                                                    <p className="text-sm font-semibold">
                                                        {new Intl.NumberFormat("es-ES", {
                                                            style: "currency",
                                                            currency: "EUR",
                                                            maximumFractionDigits: 0,
                                                        }).format(activeTrip.budget)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2 border-t pt-4">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-muted-foreground">
                                            {t("travel.packingProgress")}
                                        </span>
                                        <span className="text-emerald-500 font-bold">
                                            {packingProgress}%
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                            style={{ width: `${packingProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <ItineraryModule
                                tripId={activeTrip.id}
                                itinerary={activeTrip.itinerary}
                            />

                            <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
                                <h3 className="font-semibold text-base">
                                    {t("travel.packingList")}
                                </h3>

                                <form onSubmit={handleAddItem} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        placeholder={t("travel.addItemPlaceholder")}
                                        className="flex-1 rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    <button
                                        type="submit"
                                        className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center cursor-pointer"
                                        aria-label={t("travel.addItemPlaceholder")}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </form>

                                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                                    {totalItems === 0 ? (
                                        <p className="text-xs text-muted-foreground text-center py-4">
                                            {t("travel.emptyPackingList")}
                                        </p>
                                    ) : (
                                        activeTrip.packingList?.map((item) => {
                                            const isEditing = editingPackingId === item.id

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="w-full flex items-center justify-between gap-2 p-2.5 border rounded-lg bg-background/40 hover:bg-background transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <button
                                                            type="button"
                                                            onClick={() => togglePackingItem(activeTrip.id, item.id)}
                                                            className="flex items-center gap-2 text-left cursor-pointer shrink-0"
                                                        >
                                                            {item.packed ? (
                                                                <CheckSquare className="h-4 w-4 text-emerald-500" />
                                                            ) : (
                                                                <Square className="h-4 w-4 text-muted-foreground" />
                                                            )}
                                                        </button>

                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                value={editingPackingName}
                                                                onChange={(e) => setEditingPackingName(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        e.preventDefault()
                                                                        if (editingPackingName.trim()) {
                                                                            updatePackingItem(activeTrip.id, item.id, editingPackingName.trim())
                                                                            setEditingPackingId(null)
                                                                        }
                                                                    } else if (e.key === "Escape") {
                                                                        setEditingPackingId(null)
                                                                    }
                                                                }}
                                                                autoFocus
                                                                className="flex-1 rounded border bg-background px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                            />
                                                        ) : (
                                                            <span
                                                                onClick={() => togglePackingItem(activeTrip.id, item.id)}
                                                                className={`text-sm truncate cursor-pointer flex-1 ${item.packed
                                                                        ? "line-through text-muted-foreground"
                                                                        : "font-medium"
                                                                    }`}
                                                            >
                                                                {item.name}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-1 shrink-0">
                                                        {isEditing ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (editingPackingName.trim()) {
                                                                        updatePackingItem(activeTrip.id, item.id, editingPackingName.trim())
                                                                        setEditingPackingId(null)
                                                                    }
                                                                }}
                                                                className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors cursor-pointer"
                                                            >
                                                                {t("common.save") || "Guardar"}
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEditingPackingId(item.id)
                                                                        setEditingPackingName(item.name)
                                                                    }}
                                                                    className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                                                                    title="Editar"
                                                                >
                                                                    <Pencil className="h-3.5 w-3.5" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => deletePackingItem(activeTrip.id, item.id)}
                                                                    className="p-1.5 text-muted-foreground hover:text-destructive rounded transition-colors cursor-pointer"
                                                                    title="Eliminar"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="rounded-xl border border-dashed bg-card p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
                            <Compass className="h-10 w-10 text-muted-foreground mb-3 animate-pulse" />
                            <h3 className="font-semibold text-base mb-1">
                                {t("travel.noTripsTitle")}
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                {t("travel.noTripsSubtitle")}
                            </p>
                        </div>
                    )}
                </main>

                <aside className="md:col-span-2">
                    <TravelForm />
                </aside>
            </div>
        </div>
    )
}