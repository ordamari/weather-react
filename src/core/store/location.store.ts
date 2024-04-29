import { create } from 'zustand'
import Location from '../types/location.type'

interface LocationState {
    location: Location | null
    set: (location: Location) => void
}

const useLocationStore = create<LocationState>()((set) => ({
    location: null,
    set: (location) => set({ location }),
}))

export default useLocationStore
