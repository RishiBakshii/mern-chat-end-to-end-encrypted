import {z} from 'zod'

export const envSchema = z.object({
    VITE_ENV:z.enum(["PRODUCTION","DEVELOPMENT"]),
    VITE_TENOR_API_KEY:z.string({required_error:"Tenor api key is required"}),
    VITE_FIREBASE_API_KEY:z.string({required_error:"FIREBASE_API_KEY is required"}),
    VITE_FIREBASE_AUTH_DOMAIN: z.string({required_error:"FIREBASE_AUTH_DOMAIN is required"}),
    VITE_FIREBASE_PROJECT_ID:z.string({required_error:"FIREBASE_PROJECT_ID is required"}),
    VITE_FIREBASE_STORAGE_BUCKET: z.string({required_error:"FIREBASE_STOREAGE_BUCKET is required"}),
    VITE_FIREBASE_MESSAGING_SENDER_ID: z.string({required_error:"FIREBASE_MESSAGING_SENDER_ID is required"}),
    VITE_FIREBASE_APP_ID: z.string({required_error:"FIREBASE_APP_ID is required"}),
    VITE_FIREBASE_MEASUREMENT_ID: z.string({required_error:"FIREBASE_MEASUREMENT_ID is required"}),
    VITE_FIREBASE_VAPID_KEY:z.string({required_error:"VITE_FIREBASE_VAPID_KEY is required"})
})

export type envSchemaType = z.infer<typeof envSchema>


