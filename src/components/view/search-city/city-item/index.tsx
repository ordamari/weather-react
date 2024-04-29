import City from '@/core/types/city.type'

type CityItemProps = {
    city: City
    onClick: () => void
}

function CityItem({ city, onClick }: CityItemProps) {
    return (
        <button
            className="w-full text-start p-2 hover:bg-white/10"
            onClick={onClick}
        >
            {city.LocalizedName}
        </button>
    )
}

export default CityItem
