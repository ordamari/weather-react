import { z } from 'zod'

const citySchema = z.object({
    Version: z.number(),
    Key: z.string(),
    Type: z.string(),
    Rank: z.number(),
    LocalizedName: z.string(),
    Country: z.object({
        ID: z.string(),
        LocalizedName: z.string(),
    }),
    AdministrativeArea: z.object({
        ID: z.string(),
        LocalizedName: z.string(),
    }),
})

export const cityArraySchema = citySchema.array()

export default citySchema
