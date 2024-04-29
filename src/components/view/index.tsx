import useLocationStore from '@/core/store/location.store'
import SearchCity from './search-city'
import LocationService from '@/core/services/location.service'
import City from '@/core/types/city.type'
import WeatherService from '@/core/services/weather.service'
import useCityStore from '@/core/store/city.store'
import CityWeather from './city-weather'

function View() {
    const setLocation = useLocationStore((state) => state.set)
    const setCity = useCityStore((state) => state.set)

    const onGeolocation = async () => {
        const geolocation = await LocationService.getGeolocation()
        const city = await WeatherService.getLocationCity(geolocation)
        setLocation(geolocation)
        setCity(city)
    }

    const onCityClick = async (city: City) => {
        const location = await WeatherService.getCityLocation(city)
        setLocation(location)
        setCity(city)
    }

    return (
        <div className="view p-4 flex flex-col gap-4">
            <SearchCity
                onGeolocation={onGeolocation}
                onCityClick={onCityClick}
            />
            <div className="flex  h-full justify-center items-center absolute top-0 w-full left-[-16px] pointer-events-none">
                <CityWeather />
            </div>
        </div>
    )
}

export default View
