import { ZodError, z } from "zod";
import { config } from "dotenv";
config()

const envSchema = z.object({
    NODE_ENV:z.enum(['DEVELOPMENT','PRODUCTION']).default("DEVELOPMENT"),
    PORT:z.string({required_error:"PORT is required"}).max(4,'Port cannot be more than 4 digits').min(4,'Port number cannot be lesser than 4 digits'),
    JWT_SECRET:z.string({required_error:"JWT_SECRET is required"}).min(20,'JWT secret key cannot be lesser than 20 characters'),
    MONGO_URI:z.string({required_error:"MONGO_URI is required"}),
    JWT_TOKEN_EXPIRATION_DAYS:z.string({required_error:"JWT_TOKEN_EXPIRATION_DAYS is required"}).min(1,'JWT_TOKEN_EXPIRATION_DAYS cannot be less than 1'),
    EMAIL:z.string().email("Please provide a valid email"),
    PASSWORD:z.string({required_error:"Password for email is required"}),
    OTP_EXPIRATION_MINUTES:z.string({required_error:"OTP_EXPIRATION_MINUTES is required"}),
    PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES:z.string({required_error:"PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES is required"}),
    CLOUDINARY_CLOUD_NAME:z.string({required_error:"CLOUDINARY_CLOUD_NAME is required"}),
    CLOUDINARY_API_KEY:z.string({required_error:"CLOUDINARY_API_KEY is required"}),
    CLOUDINARY_API_SECRET:z.string({required_error:"CLOUDINARY_API_SECRET is required"}),
    GOOGLE_CLIENT_ID:z.string({required_error:"GOOGLE_CLIENT_ID is required"}),
    GOOGLE_CLIENT_SECRET:z.string({required_error:"GOOGLE_CLIENT_SECRET is required"})
})

type envType = z.infer<typeof envSchema>

let env:envType

try {
    env=envSchema.parse(process.env)
} catch (error) {
    if(error instanceof ZodError){
        console.log(error.flatten().fieldErrors);
    }
    if(error instanceof Error){
        console.log(error.message);
    }
}

export {
    env
}




