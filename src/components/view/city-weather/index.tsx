import SECOND from '@/core/constants/second.constant'
import WeatherService from '@/core/services/weather.service'
import { useEffect, useRef, useState } from 'react'
import useCityStore from '@/core/store/city.store'
import Forecast from '@/core/types/forecast.type'
import Weather from '@/core/types/weather.schema'
import useToggle from '@/hooks/use-toggle'
import City from '@/core/types/city.type'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import WeatherComponent from './weather'
import ForecastComponent from './forecast'

type Data = {
    weather: Weather
    forecast: Forecast
}

function CityWeather() {
    const [isShow, toggleIsShow] = useToggle(false)
    const city = useCityStore((state) => state.city)
    const setCity = useCityStore((state) => state.set)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [data, setData] = useState<Data | null>(null)

    useEffect(() => {
        const loadData = async (city: City) => {
            const [weather, forecast] = await Promise.all([
                WeatherService.getWeather(city.Key),
                WeatherService.getForecast(city.Key),
            ])
            setData({ weather, forecast })
        }

        if (city) {
            loadData(city)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => {
                toggleIsShow(true)
            }, 2 * SECOND)
        } else {
            toggleIsShow(false)
            setData(null)
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            toggleIsShow(false)
            setData(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [city])

    if (!city) return null

    return (
        <div
            className={cn(
                'bg-white/20 rounded-xl text-white w-4/5 mx-auto max-w-full p-4 transition-opacity duration-1000 flex flex-col gap-4',
                !isShow && 'opacity-0 pointer-events-none',
                isShow && 'opacity-100 pointer-events-auto'
            )}
        >
            <button>
                <X className="w-6 h-6" onClick={setCity.bind(null, null)} />
            </button>
            {data && (
                <>
                    <WeatherComponent weather={data.weather} city={city} />
                    <ForecastComponent forecast={data.forecast} />
                </>
            )}
        </div>
    )
}

export default CityWeather
