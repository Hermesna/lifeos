import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ItineraryItem {
    id: string
    day: number
    activity: string
}

export interface PackingItem {
    id: string
    name: string
    packed: boolean
}

export interface Trip {
    id: string
    userId: string
    destination: string
    startDate: string
    budget: number
    itinerary: ItineraryItem[]
    packingList: PackingItem[]
}

interface TravelState {
    trips: Trip[]
    activeTripId: string | null
    addTrip: (trip: Omit<Trip, "id" | "itinerary" | "packingList">) => void
    deleteTrip: (id: string) => void
    setActiveTrip: (id: string | null) => void
    addItineraryItem: (tripId: string, day: number, activity: string) => void
    togglePackingItem: (tripId: string, itemId: string) => void
    addPackingItem: (tripId: string, name: string) => void
    getUserTrips: (userId: string) => Trip[]
}

export const useTravelStore = create<TravelState>()(
    persist(
        (set, get) => ({
            trips: [],
            activeTripId: null,

            addTrip: (newTrip) =>
                set((state) => {
                    const id = crypto.randomUUID()
                    const defaultPacking = [
                        {
                            id: crypto.randomUUID(),
                            name: "Pasaporte / Visado",
                            packed: false,
                        },
                        {
                            id: crypto.randomUUID(),
                            name: "Cargadores y Adaptadores",
                            packed: false,
                        },
                        { id: crypto.randomUUID(), name: "Botiquín básico", packed: false },
                    ]

                    return {
                        trips: [
                            { ...newTrip, id, itinerary: [], packingList: defaultPacking },
                            ...state.trips,
                        ],
                        activeTripId: state.activeTripId ?? id,
                    }
                }),

            deleteTrip: (id) =>
                set((state) => {
                    const remainingTrips = state.trips.filter((t) => t.id !== id)
                    return {
                        trips: remainingTrips,
                        activeTripId:
                            state.activeTripId === id
                                ? remainingTrips[0]?.id || null
                                : state.activeTripId,
                    }
                }),

            setActiveTrip: (id) => set({ activeTripId: id }),

            addItineraryItem: (tripId, day, activity) =>
                set((state) => ({
                    trips: state.trips.map((t) =>
                        t.id === tripId
                            ? {
                                ...t,
                                itinerary: [
                                    ...t.itinerary,
                                    { id: crypto.randomUUID(), day, activity },
                                ].sort((a, b) => a.day - b.day),
                            }
                            : t,
                    ),
                })),

            addPackingItem: (tripId, name) =>
                set((state) => ({
                    trips: state.trips.map((t) =>
                        t.id === tripId
                            ? {
                                ...t,
                                packingList: [
                                    ...t.packingList,
                                    { id: crypto.randomUUID(), name, packed: false },
                                ],
                            }
                            : t,
                    ),
                })),

            togglePackingItem: (tripId, itemId) =>
                set((state) => ({
                    trips: state.trips.map((t) =>
                        t.id === tripId
                            ? {
                                ...t,
                                packingList: t.packingList.map((item) =>
                                    item.id === itemId
                                        ? { ...item, packed: !item.packed }
                                        : item,
                                ),
                            }
                            : t,
                    ),
                })),

            getUserTrips: (userId) => get().trips.filter((trip) => trip.userId === userId),
        }),
        {
            name: "lifeos-travel-storage",
        },
    ),
)