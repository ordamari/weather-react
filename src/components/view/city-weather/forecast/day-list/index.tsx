import Forecast from '@/core/types/forecast.type'
import DayItem from '../day-item'

type DayListProps = {
    dailyForecasts: Forecast['DailyForecasts']
}

function DayList({ dailyForecasts }: DayListProps) {
    return (
        <ul className="flex gap-1 justify-between">
            {dailyForecasts.map((forecast, idx) => {
                return (
                    <li className="w-full" key={idx}>
                        <DayItem forecast={forecast} />
                    </li>
                )
            })}
        </ul>
    )
}

export default DayList
