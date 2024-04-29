import { z } from 'zod'

const dailyForecastSchema = z.object({
    Date: z.string(),
    EpochDate: z.number(),
    Temperature: z.object({
        Minimum: z.object({
            Value: z.number(),
            Unit: z.string(),
            UnitType: z.number(),
        }),
        Maximum: z.object({
            Value: z.number(),
            Unit: z.string(),
            UnitType: z.number(),
        }),
    }),
    Day: z.object({
        Icon: z.number(),
        IconPhrase: z.string(),
        HasPrecipitation: z.boolean(),
    }),
    Night: z.object({
        Icon: z.number(),
        IconPhrase: z.string(),
        HasPrecipitation: z.boolean(),
    }),
    Sources: z.array(z.string()),
    MobileLink: z.string(),
    Link: z.string(),
})

const forecastSchema = z.object({
    Headline: z.object({
        Text: z.string(),
        EffectiveDate: z.string(),
        EffectiveEpochDate: z.number(),
        Severity: z.number(),
        Category: z.string(),
        EndDate: z.string().nullable(),
        EndEpochDate: z.number().nullable(),
        MobileLink: z.string(),
        Link: z.string(),
    }),
    DailyForecasts: dailyForecastSchema.array(),
})

export default forecastSchema
