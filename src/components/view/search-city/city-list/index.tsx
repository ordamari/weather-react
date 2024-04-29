import City from '@/core/types/city.type'
import CityItem from '../city-item'

type CityListProps = {
    cities: City[]
    onCityClick: (city: City) => void
}

function CityList({ cities, onCityClick }: CityListProps) {
    return (
        <ul className="py-2">
            {cities.map((city) => {
                return (
                    <li key={city.Key}>
                        <CityItem
                            onClick={onCityClick.bind(null, city)}
                            city={city}
                        />
                    </li>
                )
            })}
        </ul>
    )
}

export default CityList
