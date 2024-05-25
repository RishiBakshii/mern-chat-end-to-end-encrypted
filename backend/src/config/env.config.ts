import type { IConfig } from "../interfaces/config/config.interface.js"
import { env } from "../schemas/env.schema.js"

const developmentConfig:IConfig = {
    clientUrl:"http://localhost:5173",
    callbackUrl:`http://localhost:${env.PORT}/api/v1/auth`,
}

const productionConfig:IConfig = {
    clientUrl:"https://baatchit.online",
    callbackUrl:"https://baatchit.online/api/v1/auth"
}

export const config = env.NODE_ENV==='DEVELOPMENT'?developmentConfig:productionConfig