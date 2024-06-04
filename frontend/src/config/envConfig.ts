import { ZodError } from "zod"
import type { IConfig } from "../interfaces/config"
import { envSchema, envSchemaType } from "../schemas/envSchema"

let env:envSchemaType = {
    VITE_ENV:"DEVELOPMENT",
    VITE_TENOR_API_KEY:""
}

const productionConfig:IConfig = {
    base_url:"",
    absolute_base_url:"",
    clientUrl:"https://baatchit.online"
}

const developmentConfig:IConfig = {
    base_url:"http://localhost:8000/api/v1",
    absolute_base_url:"http://localhost:8000",
    clientUrl:"http://localhost:5173"
}

try {
    env = envSchema.parse(import.meta.env)
} catch (error) {
    if(error instanceof ZodError){
        console.log(error.flatten().fieldErrors);
    }
}

export const config = env.VITE_ENV === 'PRODUCTION' ? productionConfig : developmentConfig

export {
    env
}

