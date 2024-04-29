import { z } from 'zod'
import weatherSchema from '../schemas/weather.schema'

type Weather = z.infer<typeof weatherSchema>

export default Weather
