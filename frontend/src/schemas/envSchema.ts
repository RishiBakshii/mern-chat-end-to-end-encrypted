import {z} from 'zod'

const envSchema = z.object({
    VITE_ENV:z.enum(["PRODUCTION","DEVELOPMENT"])
})

type envSchemaType = z.infer<typeof envSchema>

export {
    envSchema,
    type envSchemaType,
}



