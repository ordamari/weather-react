/* eslint-disable @next/next/no-img-element */
import City from '@/core/types/city.type'
import Weather from '@/core/types/weather.schema'
import { useMemo } from 'react'

type WeatherProps = {
    weather: Weather
    city: City
}
function WeatherComponent({ weather, city }: WeatherProps) {
    const icon = useMemo(() => {
        const icon = weather.WeatherIcon
        const number = icon < 10 ? `0${icon}` : icon
        return `https://developer.accuweather.com/sites/default/files/${number}-s.png`
    }, [weather])

    return (
        <div>
            <div className="flex gap-4 items-center justify-center">
                <div className="flex flex-col justify-center items-center text-xl">
                    <img
                        className="w-[150px] h-[90px]"
                        src={icon}
                        alt={weather.WeatherText}
                    />
                    <span>{weather.WeatherText}</span>
                </div>
                <div className="flex flex-col text-5xl">
                    <span>{city.LocalizedName}</span>
                    <span>
                        {weather.Temperature.Metric.Value}°
                        {weather.Temperature.Metric.Unit}
                    </span>
                </div>
            </div>
            <div className=""></div>
        </div>
    )
}

export default WeatherComponent
