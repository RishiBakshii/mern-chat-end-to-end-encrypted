import { IConfig } from "../interfaces/config.interface.js"
import { env } from "../schemas/env.schema.js"

const developmentConfig:IConfig = {
    clientUrl:"http://localhost:5173",
}

const productionConfig:IConfig = {
    clientUrl:""
}

export const config = env.NODE_ENV==='DEVELOPMENT'?developmentConfig:productionConfig