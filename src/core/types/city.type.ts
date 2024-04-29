import { z } from 'zod'
import citySchema from '../schemas/city.schema'

type City = z.infer<typeof citySchema>

export default City
