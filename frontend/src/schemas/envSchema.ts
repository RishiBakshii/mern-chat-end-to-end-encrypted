import {z} from 'zod'

const envSchema = z.object({
    VITE_ENV:z.enum(["PRODUCTION","DEVELOPMENT"]),
    VITE_TENOR_API_KEY:z.string({required_error:"Tenor api key is required"})
})

type envSchemaType = z.infer<typeof envSchema>

export {
    envSchema,
    type envSchemaType,
}



