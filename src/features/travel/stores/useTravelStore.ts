import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useAuthStore } from "@/shared/stores/useAuthStore"

export type ActivityCategory =
    | "sightseeing"
    | "food"
    | "transport"
    | "stay"
    | "flight"

export interface ItineraryItem {
    id: string
    day: number
    activity: string
    time?: string
    location?: string
    category?: ActivityCategory
    notes?: string
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
    addTrip: (
        trip: Omit<Trip, "id" | "userId" | "itinerary" | "packingList">,
    ) => string | null
    deleteTrip: (id: string) => void
    setActiveTrip: (id: string | null) => void
    addItineraryItem: (
        tripId: string,
        day: number,
        activity: string,
        extra?: Omit<ItineraryItem, "id" | "day" | "activity">,
    ) => void
    deleteItineraryItem: (tripId: string, itemId: string) => void
    togglePackingItem: (tripId: string, itemId: string) => void
    addPackingItem: (tripId: string, name: string) => void
    getUserTrips: (userId?: string) => Trip[]
}

export const useTravelStore = create<TravelState>()(
    persist(
        (set, get) => ({
            trips: [],
            activeTripId: null,

            addTrip: (newTrip) => {
                let createdId: string | null = null

                set((state) => {
                    const currentUserId = useAuthStore.getState().user?.id
                    if (!currentUserId) return state

                    const id = crypto.randomUUID()
                    createdId = id

                    const defaultPacking: PackingItem[] = []

                    return {
                        trips: [
                            {
                                ...newTrip,
                                id,
                                userId: currentUserId,
                                itinerary: [],
                                packingList: defaultPacking,
                            },
                            ...state.trips,
                        ],
                        activeTripId: id,
                    }
                })

                return createdId
            },

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

            addItineraryItem: (tripId, day, activity, extra = {}) =>
                set((state) => ({
                    trips: state.trips.map((t) => {
                        if (t.id !== tripId) return t

                        const currentItinerary = t.itinerary ?? []
                        const newItem: ItineraryItem = {
                            id: crypto.randomUUID(),
                            day,
                            activity,
                            ...extra,
                        }

                        return {
                            ...t,
                            itinerary: [...currentItinerary, newItem].sort(
                                (a, b) => a.day - b.day,
                            ),
                        }
                    }),
                })),

            deleteItineraryItem: (tripId, itemId) =>
                set((state) => ({
                    trips: state.trips.map((t) =>
                        t.id === tripId
                            ? {
                                ...t,
                                itinerary: (t.itinerary ?? []).filter(
                                    (item) => item.id !== itemId,
                                ),
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
                                    ...(t.packingList ?? []),
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
                                packingList: (t.packingList ?? []).map((item) =>
                                    item.id === itemId
                                        ? { ...item, packed: !item.packed }
                                        : item,
                                ),
                            }
                            : t,
                    ),
                })),

            getUserTrips: (userId) => {
                const targetUserId = userId ?? useAuthStore.getState().user?.id
                if (!targetUserId) return []
                return get().trips.filter((trip) => trip.userId === targetUserId)
            },
        }),
        {
            name: "lifeos-travel-storage",
        },
    ),
)