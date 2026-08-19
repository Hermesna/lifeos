import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useAuthStore } from "@/shared/stores/useAuthStore"
import { db } from "@/shared/lib/firebase"
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    query
} from "firebase/firestore"

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
    subscribeToTrips: () => () => void
    addTrip: (
        trip: Omit<Trip, "id" | "userId" | "itinerary" | "packingList">,
    ) => Promise<string | null>
    updateTrip: (
        tripId: string,
        fields: { destination?: string; startDate?: string; budget?: number }
    ) => Promise<void>
    deleteTrip: (id: string) => Promise<void>
    setActiveTrip: (id: string | null) => void
    addItineraryItem: (
        tripId: string,
        day: number,
        activity: string,
        extra?: Omit<ItineraryItem, "id" | "day" | "activity">,
    ) => Promise<void>
    updateItineraryItem: (
        tripId: string,
        itemId: string,
        day: number,
        activity: string,
        extra?: Omit<ItineraryItem, "id" | "day" | "activity">
    ) => Promise<void>
    deleteItineraryItem: (tripId: string, itemId: string) => Promise<void>
    togglePackingItem: (tripId: string, itemId: string) => Promise<void>
    addPackingItem: (tripId: string, name: string) => Promise<void>
    deletePackingItem: (tripId: string, itemId: string) => Promise<void>
    updatePackingItem: (tripId: string, itemId: string, name: string) => Promise<void>
    getUserTrips: (userId?: string) => Trip[]
}

export const useTravelStore = create<TravelState>()(
    persist(
        (set, get) => ({
            trips: [],
            activeTripId: null,

            subscribeToTrips: () => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return () => { }

                const tripsRef = collection(db, "users", userId, "trips")
                const q = query(tripsRef)

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const tripsData = snapshot.docs.map((docSnap) => ({
                        ...(docSnap.data() as Trip),
                        id: docSnap.id,
                    }))

                    set({
                        trips: tripsData,
                        activeTripId: get().activeTripId ?? tripsData[0]?.id ?? null,
                    })
                })

                return unsubscribe
            },

            addTrip: async (newTrip) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return null

                const id = crypto.randomUUID()
                const tripRef = doc(db, "users", userId, "trips", id)

                const tripData: Trip = {
                    ...newTrip,
                    id,
                    userId,
                    itinerary: [],
                    packingList: [],
                }

                await setDoc(tripRef, tripData)
                set({ activeTripId: id })
                return id
            },

            updateTrip: async (tripId, fields) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const tripRef = doc(db, "users", userId, "trips", tripId)
                await setDoc(tripRef, fields, { merge: true })
            },

            deleteTrip: async (id) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const tripRef = doc(db, "users", userId, "trips", id)
                await deleteDoc(tripRef)

                set((state) => {
                    const remainingTrips = state.trips.filter((t) => t.id !== id)
                    return {
                        trips: remainingTrips,
                        activeTripId:
                            state.activeTripId === id
                                ? remainingTrips[0]?.id || null
                                : state.activeTripId,
                    }
                })
            },

            setActiveTrip: (id) => set({ activeTripId: id }),

            addItineraryItem: async (tripId, day, activity, extra = {}) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const trip = get().trips.find((t) => t.id === tripId)
                if (!trip) return

                const newItem: ItineraryItem = {
                    id: crypto.randomUUID(),
                    day,
                    activity,
                    ...extra,
                }

                const updatedItinerary = [...(trip.itinerary ?? []), newItem].sort(
                    (a, b) => a.day - b.day,
                )

                const tripRef = doc(db, "users", userId, "trips", tripId)
                await setDoc(tripRef, { itinerary: updatedItinerary }, { merge: true })
            },

            updateItineraryItem: async (tripId, itemId, day, activity, extra = {}) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const trip = get().trips.find((t) => t.id === tripId)
                if (!trip) return

                const updatedItinerary = (trip.itinerary ?? []).map((item) =>
                    item.id === itemId
                        ? { ...item, day, activity, ...extra }
                        : item
                ).sort((a, b) => a.day - b.day)

                const tripRef = doc(db, "users", userId, "trips", tripId)
                await setDoc(tripRef, { itinerary: updatedItinerary }, { merge: true })
            },

            deleteItineraryItem: async (tripId, itemId) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const trip = get().trips.find((t) => t.id === tripId)
                if (!trip) return

                const updatedItinerary = (trip.itinerary ?? []).filter(
                    (item) => item.id !== itemId,
                )

                const tripRef = doc(db, "users", userId, "trips", tripId)
                await setDoc(tripRef, { itinerary: updatedItinerary }, { merge: true })
            },

            addPackingItem: async (tripId, name) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const trip = get().trips.find((t) => t.id === tripId)
                if (!trip) return

                const newItem: PackingItem = {
                    id: crypto.randomUUID(),
                    name,
                    packed: false,
                }

                const updatedPackingList = [...(trip.packingList ?? []), newItem]

                const tripRef = doc(db, "users", userId, "trips", tripId)
                await setDoc(tripRef, { packingList: updatedPackingList }, { merge: true })
            },

            deletePackingItem: async (tripId, itemId) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const trip = get().trips.find((t) => t.id === tripId)
                if (!trip) return

                const updatedPackingList = (trip.packingList ?? []).filter(
                    (item) => item.id !== itemId,
                )

                const tripRef = doc(db, "users", userId, "trips", tripId)
                await setDoc(tripRef, { packingList: updatedPackingList }, { merge: true })
            },

            updatePackingItem: async (tripId, itemId, name) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const trip = get().trips.find((t) => t.id === tripId)
                if (!trip) return

                const updatedPackingList = (trip.packingList ?? []).map((item) =>
                    item.id === itemId ? { ...item, name } : item,
                )

                const tripRef = doc(db, "users", userId, "trips", tripId)
                await setDoc(tripRef, { packingList: updatedPackingList }, { merge: true })
            },

            togglePackingItem: async (tripId, itemId) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) return

                const trip = get().trips.find((t) => t.id === tripId)
                if (!trip) return

                const updatedPackingList = (trip.packingList ?? []).map((item) =>
                    item.id === itemId ? { ...item, packed: !item.packed } : item,
                )

                const tripRef = doc(db, "users", userId, "trips", tripId)
                await setDoc(tripRef, { packingList: updatedPackingList }, { merge: true })
            },

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