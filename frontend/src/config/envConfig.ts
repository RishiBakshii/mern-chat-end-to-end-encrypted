import { ZodError } from "zod"
import type { IConfig } from "../interfaces/config"
import { envSchema } from "../schemas/envSchema"

let env

const productionConfig:IConfig = {
    base_url:"",
    absolute_base_url:""
}

const developmentConfig:IConfig = {
    base_url:"http://localhost:8000/api/v1",
    absolute_base_url:"http://localhost:8000"
}

try {
    env = envSchema.parse(import.meta.env)
} catch (error) {
    if(error instanceof ZodError){
        console.log(error.flatten().fieldErrors);
    }
}

export const config = env?.VITE_ENV === 'PRODUCTION' ? productionConfig : developmentConfig

