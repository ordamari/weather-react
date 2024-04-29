/* eslint-disable @next/next/no-img-element */
import Forecast from '@/core/types/forecast.type'
import { useMemo } from 'react'
import moment from 'moment'

type DayItemProps = {
    forecast: Forecast['DailyForecasts'][0]
}

function DayItem({ forecast }: DayItemProps) {
    const icon = useMemo(() => {
        const icon = forecast.Day.Icon
        const number = icon < 10 ? `0${icon}` : icon
        return `https://developer.accuweather.com/sites/default/files/${number}-s.png`
    }, [forecast])

    return (
        <div className="w-full flex items-center justify-end flex-col gap-4">
            <span>{moment(forecast.Date).format('dddd')}</span>
            <img
                className="w-[75px] h-[45px]"
                src={icon}
                alt={forecast.Day.IconPhrase}
            />
            <div className="flex gap-2">
                <span>
                    {forecast.Temperature.Minimum.Value}°
                    {forecast.Temperature.Minimum.Unit}
                </span>
                <span>-</span>
                <span>
                    {forecast.Temperature.Maximum.Value}°
                    {forecast.Temperature.Maximum.Unit}
                </span>
            </div>
        </div>
    )
}

export default DayItem
