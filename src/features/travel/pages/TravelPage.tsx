import { useTravelStore } from "../stores/useTravelStore";
import {
  Compass,
  Calendar,
  Wallet,
  CheckSquare,
  Square,
  Trash2,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { TravelForm } from "./TravelForm";

export function TravelPage() {
  const {
    trips,
    activeTripId,
    setActiveTrip,
    deleteTrip,
    togglePackingItem,
    addPackingItem,
  } = useTravelStore();
  const [newItemName, setNewItemName] = useState("");

  const activeTrip =
    trips.find((t) => t.id === activeTripId) || trips[0] || null;

  const packingProgress =
    activeTrip && activeTrip.packingList.length > 0
      ? Math.round(
          (activeTrip.packingList.filter((i) => i.packed).length /
            activeTrip.packingList.length) *
            100,
        )
      : 0;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip || !newItemName.trim()) return;
    addPackingItem(activeTrip.id, newItemName.trim());
    setNewItemName("");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Expediciones & Viajes
          </h1>
          <p className="text-sm text-muted-foreground">
            Planifica tus rutas, presupuestos y listas de equipaje.
          </p>
        </div>

        {trips.length > 1 && (
          <select
            value={activeTripId || ""}
            onChange={(e) => setActiveTrip(e.target.value || null)}
            className="rounded-lg border bg-card px-3 py-1.5 text-sm font-medium shadow-sm focus:outline-none"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.destination}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Grid Principal */}
      <div className="grid gap-6 md:grid-cols-5 items-start">
        {/* Contenido Izquierdo (Detalles o Estado Vacío) */}
        <div className="md:col-span-3 space-y-4">
          {activeTrip ? (
            <>
              {/* Card de Detalles */}
              <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-wider mb-1">
                      <Compass className="h-3.5 w-3.5" /> Próxima Expedición
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">
                      {activeTrip.destination}
                    </h2>
                  </div>
                  <button
                    onClick={() => deleteTrip(activeTrip.id)}
                    className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg transition-colors border bg-background/50"
                    title="Eliminar viaje"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-secondary rounded-lg text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground uppercase">
                        Ventana Objetivo
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
                        Presupuesto Asignado
                      </p>
                      <p className="text-sm font-semibold">
                        {activeTrip.budget} €
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">
                      Progreso del Equipaje
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

              {/* Card de Packing List */}
              <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-base">
                  Lista de Equipaje (Packing List)
                </h3>

                <form onSubmit={handleAddItem} className="flex gap-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Añadir artículo (ej: Adaptador corriente)..."
                    className="flex-1 rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </form>

                <div className="space-y-1.5 max-h-55 overflow-y-auto pr-1">
                  {activeTrip.packingList.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => togglePackingItem(activeTrip.id, item.id)}
                      className="w-full flex items-center gap-3 p-2.5 border rounded-lg bg-background/40 hover:bg-background transition-colors text-left"
                    >
                      {item.packed ? (
                        <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span
                        className={`text-sm ${item.packed ? "line-through text-muted-foreground" : "font-medium"}`}
                      >
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed bg-card p-12 text-center flex flex-col items-center justify-center min-h-87.5">
              <Compass className="h-10 w-10 text-muted-foreground mb-3 animate-pulse" />
              <h3 className="font-semibold text-base mb-1">
                No hay expediciones activas
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Comienza a planificar tu regreso a Japón o introduce cualquier
                otra escapada en el panel de la derecha.
              </p>
            </div>
          )}
        </div>

        {/* Formulario lateral derecho (Siempre visible) */}
        <div className="md:col-span-2">
          <TravelForm />
        </div>
      </div>
    </div>
  );
}
