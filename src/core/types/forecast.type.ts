import { z } from 'zod'
import forecastSchema from '../schemas/forecast.schema'

type Forecast = z.infer<typeof forecastSchema>

export default Forecast
