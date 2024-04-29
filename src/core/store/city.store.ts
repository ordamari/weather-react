import { create } from 'zustand'
import City from '../types/city.type'

interface CityState {
    city: City | null
    set: (city: City | null) => void
}

const useCityStore = create<CityState>()((set) => ({
    city: null,
    set: (city) => set({ city }),
}))

export default useCityStore
