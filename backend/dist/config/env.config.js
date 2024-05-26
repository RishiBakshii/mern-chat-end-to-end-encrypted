import { env } from "../schemas/env.schema.js";
const developmentConfig = {
    clientUrl: "http://localhost:5173",
    callbackUrl: `http://localhost:${env.PORT}/api/v1/auth`,
};
const productionConfig = {
    clientUrl: "https://baatchit.online",
    callbackUrl: "https://baatchit.online/api/v1/auth"
};
export const config = env.NODE_ENV === 'DEVELOPMENT' ? developmentConfig : productionConfig;
//# sourceMappingURL=env.config.js.map