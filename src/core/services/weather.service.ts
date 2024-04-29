import http from '@/lib/http'
import citySchema, { cityArraySchema } from '../schemas/city.schema'
import forecastSchema from '../schemas/forecast.schema'
import Location from '../types/location.type'
import City from '../types/city.type'
import IS_MOCK from '../constants/is-mock.constant'
import Weather from '../types/weather.schema'
import { weatherSchemaArray } from '../schemas/weather.schema'

class WeatherService {
    private static BASE_URL = 'https://dataservice.accuweather.com/'
    private static ACCUWEATHER_API_KEY =
        process.env.NEXT_PUBLIC_ACCUWEATHER_API_KEY ?? ''
    private static OPEN_WEATHER_API_KEY =
        process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY ?? ''
    private static citiesCache: Record<string, City[]> = {}
    private static locationCache: Record<string, Location> = {}
    private static weatherCache: Record<string, any> = {}
    private static forecastCache: Record<string, any> = {}

    private static MOCK_CITIES: City[] = [
        {
            Version: 1,
            Key: '215854',
            Type: 'City',
            Rank: 31,
            LocalizedName: 'Tel Aviv',
            Country: {
                ID: 'IL',
                LocalizedName: 'Israel',
            },
            AdministrativeArea: {
                ID: 'TA',
                LocalizedName: 'Tel Aviv',
            },
        },
        {
            Version: 1,
            Key: '3431644',
            Type: 'City',
            Rank: 45,
            LocalizedName: 'Telanaipura',
            Country: {
                ID: 'ID',
                LocalizedName: 'Indonesia',
            },
            AdministrativeArea: {
                ID: 'JA',
                LocalizedName: 'Jambi',
            },
        },
        {
            Version: 1,
            Key: '300558',
            Type: 'City',
            Rank: 45,
            LocalizedName: 'Telok Blangah New Town',
            Country: {
                ID: 'SG',
                LocalizedName: 'Singapore',
            },
            AdministrativeArea: {
                ID: '05',
                LocalizedName: 'South West',
            },
        },
        {
            Version: 1,
            Key: '325876',
            Type: 'City',
            Rank: 51,
            LocalizedName: 'Telford',
            Country: {
                ID: 'GB',
                LocalizedName: 'United Kingdom',
            },
            AdministrativeArea: {
                ID: 'TFW',
                LocalizedName: 'Telford and Wrekin',
            },
        },
        {
            Version: 1,
            Key: '169072',
            Type: 'City',
            Rank: 51,
            LocalizedName: 'Telavi',
            Country: {
                ID: 'GE',
                LocalizedName: 'Georgia',
            },
            AdministrativeArea: {
                ID: 'KA',
                LocalizedName: 'Kakheti',
            },
        },
        {
            Version: 1,
            Key: '230611',
            Type: 'City',
            Rank: 51,
            LocalizedName: 'Telsiai',
            Country: {
                ID: 'LT',
                LocalizedName: 'Lithuania',
            },
            AdministrativeArea: {
                ID: 'TE',
                LocalizedName: 'Telšiai',
            },
        },
        {
            Version: 1,
            Key: '2723742',
            Type: 'City',
            Rank: 55,
            LocalizedName: 'Telégrafo',
            Country: {
                ID: 'BR',
                LocalizedName: 'Brazil',
            },
            AdministrativeArea: {
                ID: 'PA',
                LocalizedName: 'Pará',
            },
        },
        {
            Version: 1,
            Key: '186933',
            Type: 'City',
            Rank: 55,
            LocalizedName: 'Tela',
            Country: {
                ID: 'HN',
                LocalizedName: 'Honduras',
            },
            AdministrativeArea: {
                ID: 'AT',
                LocalizedName: 'Atlántida',
            },
        },
        {
            Version: 1,
            Key: '3453754',
            Type: 'City',
            Rank: 55,
            LocalizedName: 'Telaga Asih',
            Country: {
                ID: 'ID',
                LocalizedName: 'Indonesia',
            },
            AdministrativeArea: {
                ID: 'JB',
                LocalizedName: 'West Java',
            },
        },
        {
            Version: 1,
            Key: '3453755',
            Type: 'City',
            Rank: 55,
            LocalizedName: 'Telagamurni',
            Country: {
                ID: 'ID',
                LocalizedName: 'Indonesia',
            },
            AdministrativeArea: {
                ID: 'JB',
                LocalizedName: 'West Java',
            },
        },
    ]

    private static MOCK_WEATHER: Weather = {
        LocalObservationDateTime: '2024-04-28T16:12:00+03:00',
        EpochTime: 1714309920,
        WeatherText: 'Sunny',
        WeatherIcon: 1,
        HasPrecipitation: false,
        PrecipitationType: null,
        IsDayTime: true,
        Temperature: {
            Metric: {
                Value: 24,
                Unit: 'C',
                UnitType: 17,
            },
            Imperial: {
                Value: 75,
                Unit: 'F',
                UnitType: 18,
            },
        },
        MobileLink:
            'http://www.accuweather.com/en/il/tel-aviv/215854/current-weather/215854?lang=en-us',
        Link: 'http://www.accuweather.com/en/il/tel-aviv/215854/current-weather/215854?lang=en-us',
    }

    private static MOCK_FORECAST = {
        Headline: {
            EffectiveDate: '2024-04-28T20:00:00+03:00',
            EffectiveEpochDate: 1714323600,
            Severity: 7,
            Text: 'Warm Sunday night',
            Category: 'heat',
            EndDate: '2024-04-29T08:00:00+03:00',
            EndEpochDate: 1714366800,
            MobileLink:
                'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?unit=c&lang=en-us',
            Link: 'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?unit=c&lang=en-us',
        },
        DailyForecasts: [
            {
                Date: '2024-04-28T07:00:00+03:00',
                EpochDate: 1714276800,
                Temperature: {
                    Minimum: {
                        Value: 19.8,
                        Unit: 'C',
                        UnitType: 17,
                    },
                    Maximum: {
                        Value: 26.8,
                        Unit: 'C',
                        UnitType: 17,
                    },
                },
                Day: {
                    Icon: 3,
                    IconPhrase: 'Partly sunny',
                    HasPrecipitation: false,
                },
                Night: {
                    Icon: 38,
                    IconPhrase: 'Mostly cloudy',
                    HasPrecipitation: false,
                },
                Sources: ['AccuWeather'],
                MobileLink:
                    'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=1&unit=c&lang=en-us',
                Link: 'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=1&unit=c&lang=en-us',
            },
            {
                Date: '2024-04-29T07:00:00+03:00',
                EpochDate: 1714363200,
                Temperature: {
                    Minimum: {
                        Value: 19.9,
                        Unit: 'C',
                        UnitType: 17,
                    },
                    Maximum: {
                        Value: 24.7,
                        Unit: 'C',
                        UnitType: 17,
                    },
                },
                Day: {
                    Icon: 6,
                    IconPhrase: 'Mostly cloudy',
                    HasPrecipitation: false,
                },
                Night: {
                    Icon: 38,
                    IconPhrase: 'Mostly cloudy',
                    HasPrecipitation: false,
                },
                Sources: ['AccuWeather'],
                MobileLink:
                    'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=2&unit=c&lang=en-us',
                Link: 'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=2&unit=c&lang=en-us',
            },
            {
                Date: '2024-04-30T07:00:00+03:00',
                EpochDate: 1714449600,
                Temperature: {
                    Minimum: {
                        Value: 19.6,
                        Unit: 'C',
                        UnitType: 17,
                    },
                    Maximum: {
                        Value: 24.1,
                        Unit: 'C',
                        UnitType: 17,
                    },
                },
                Day: {
                    Icon: 4,
                    IconPhrase: 'Intermittent clouds',
                    HasPrecipitation: false,
                },
                Night: {
                    Icon: 34,
                    IconPhrase: 'Mostly clear',
                    HasPrecipitation: false,
                },
                Sources: ['AccuWeather'],
                MobileLink:
                    'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=3&unit=c&lang=en-us',
                Link: 'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=3&unit=c&lang=en-us',
            },
            {
                Date: '2024-05-01T07:00:00+03:00',
                EpochDate: 1714536000,
                Temperature: {
                    Minimum: {
                        Value: 19.3,
                        Unit: 'C',
                        UnitType: 17,
                    },
                    Maximum: {
                        Value: 24.5,
                        Unit: 'C',
                        UnitType: 17,
                    },
                },
                Day: {
                    Icon: 1,
                    IconPhrase: 'Sunny',
                    HasPrecipitation: false,
                },
                Night: {
                    Icon: 38,
                    IconPhrase: 'Mostly cloudy',
                    HasPrecipitation: false,
                },
                Sources: ['AccuWeather'],
                MobileLink:
                    'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=4&unit=c&lang=en-us',
                Link: 'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=4&unit=c&lang=en-us',
            },
            {
                Date: '2024-05-02T07:00:00+03:00',
                EpochDate: 1714622400,
                Temperature: {
                    Minimum: {
                        Value: 18.5,
                        Unit: 'C',
                        UnitType: 17,
                    },
                    Maximum: {
                        Value: 23.8,
                        Unit: 'C',
                        UnitType: 17,
                    },
                },
                Day: {
                    Icon: 3,
                    IconPhrase: 'Partly sunny',
                    HasPrecipitation: false,
                },
                Night: {
                    Icon: 35,
                    IconPhrase: 'Partly cloudy',
                    HasPrecipitation: false,
                },
                Sources: ['AccuWeather'],
                MobileLink:
                    'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=5&unit=c&lang=en-us',
                Link: 'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=5&unit=c&lang=en-us',
            },
        ],
    }

    public static async getCities(query: string): Promise<City[]> {
        if (query.length < 3) return [] as City[]
        if (IS_MOCK) return this.MOCK_CITIES
        if (this.citiesCache[query]) return this.citiesCache[query] as City[]
        const cities = await http.get(
            `${this.BASE_URL}locations/v1/cities/autocomplete`,
            {
                q: query,
                apikey: this.ACCUWEATHER_API_KEY,
            },
            cityArraySchema
        )
        this.citiesCache[query] = cities
        return cities as City[]
    }

    public static async getWeather(cityKey: string) {
        if (this.weatherCache[cityKey]) return this.weatherCache[cityKey]
        if (IS_MOCK) return this.MOCK_WEATHER
        const weatherArr = await http.get(
            `${this.BASE_URL}currentconditions/v1/${cityKey}`,
            {
                apikey: this.ACCUWEATHER_API_KEY,
            },
            weatherSchemaArray
        )
        const weather = weatherArr[0]
        this.weatherCache[cityKey] = weather
        return weather
    }

    public static async getForecast(cityKey: string) {
        if (this.forecastCache[cityKey]) return this.forecastCache[cityKey]
        if (IS_MOCK) return this.MOCK_FORECAST
        const forecast = await http.get(
            `${this.BASE_URL}forecasts/v1/daily/5day/${cityKey}`,
            {
                apikey: this.ACCUWEATHER_API_KEY,
                metric: true,
            },
            forecastSchema
        )
        this.forecastCache[cityKey] = forecast
        return forecast
    }

    public static async getLocationCity(location: Location) {
        const city = await http.get(
            `${this.BASE_URL}locations/v1/cities/geoposition/search`,
            {
                q: `${location.latitude},${location.longitude}`,
                apikey: this.ACCUWEATHER_API_KEY,
                details: true,
            },
            citySchema
        )
        return city
    }

    public static async getCityLocation(city: City) {
        if (this.locationCache[city.Key]) return this.locationCache[city.Key]
        if (IS_MOCK) return { latitude: 32.0853, longitude: 34.7818 }
        const res = await http.get<any[]>(
            'http://api.openweathermap.org/geo/1.0/direct',
            {
                q: `${city.LocalizedName},${city.Country.ID}`,
                appid: this.OPEN_WEATHER_API_KEY,
            }
        )

        const location = {
            latitude: res[0].lat,
            longitude: res[0].lon,
        }

        this.locationCache[city.Key] = location
        return location
    }
}

export default WeatherService
