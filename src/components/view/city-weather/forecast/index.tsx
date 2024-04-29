import Forecast from '@/core/types/forecast.type'
import DayList from './day-list'

type ForecastProps = {
    forecast: Forecast
}

function ForecastComponent({ forecast }: ForecastProps) {
    return (
        <div className="">
            <DayList dailyForecasts={forecast.DailyForecasts} />
        </div>
    )
}

export default ForecastComponent
