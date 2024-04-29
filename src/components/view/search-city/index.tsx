import { Input } from '@/components/ui/input'
import WeatherService from '@/core/services/weather.service'
import City from '@/core/types/city.type'
import useDebounce from '@/hooks/use-debounce'
import { Loader, MapPin, Search, X } from 'lucide-react'
import { useRef, useState } from 'react'
import CityList from './city-list'
import useIsFocused from '@/hooks/use-is-focused'
import useCityStore from '@/core/store/city.store'
import { cn } from '@/lib/utils'

type SearchCityProps = {
    onGeolocation: () => void
    onCityClick: (city: City) => void
}

function SearchCity({ onGeolocation, onCityClick }: SearchCityProps) {
    const [cities, setCities] = useState<City[]>([])
    const inputRef = useRef<HTMLInputElement | null>(null)
    const city = useCityStore((state) => state.city)
    const isFocused = useIsFocused(inputRef)
    const [query, setQuery] = useState('')
    const isDebounce = useDebounce(query, async (value) => {
        const queryCities = await WeatherService.getCities(value)
        setCities(queryCities)
    })

    return (
        <div
            className={cn(
                'bg-white/20 rounded-xl text-white w-96 mx-auto max-w-full',
                !city && 'opacity-100 pointer-events-auto',
                city && 'opacity-0 pointer-events-none'
            )}
        >
            <div className="flex p-2 gap-2">
                <button disabled={isDebounce} onClick={() => setQuery('')}>
                    {isDebounce && <Loader className="w-6 h-6 animate-spin" />}
                    {!isDebounce && query && <X className="w-6 h-6" />}
                    {!isDebounce && !query && <Search className="w-6 h-6" />}
                </button>
                <Input
                    value={query}
                    ref={inputRef}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-transparent border-none"
                    placeholder="Search City"
                />
                <button disabled={isDebounce} onClick={onGeolocation}>
                    <MapPin className="w-6 h-6" />
                </button>
            </div>
            {isFocused && !!cities.length && (
                <CityList cities={cities} onCityClick={onCityClick} />
            )}
        </div>
    )
}

export default SearchCity
