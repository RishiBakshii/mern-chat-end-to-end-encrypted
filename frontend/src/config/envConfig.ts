import { ZodError } from "zod";
import type { IConfig } from "../interfaces/config";
import { envSchema, envSchemaType } from "../schemas/envSchema";

let env: envSchemaType | null = null;

const productionConfig: IConfig = {
  base_url: "https://stangchatbackend.online/api/v1",
  absolute_base_url: "https://stangchatbackend.online",
  clientUrl: "https://baatchit.online"
};

const developmentConfig: IConfig = {
  base_url: "http://localhost:8000/api/v1",
  absolute_base_url: "http://localhost:8000",
  clientUrl: "http://localhost:5173"
};

try {
  env = envSchema.parse(import.meta.env);
} catch (error) {
  console.log('error',error);
  if (error instanceof ZodError) {
    console.error("Environment variable validation error:", error.flatten().fieldErrors);
  } else {
    console.error("Unexpected error during environment variable validation:", error);
  }
}

if (!env) {
  throw new Error("Environment variables validation failed. Application cannot start.");
}

export const config = import.meta.env.MODE === "production" ? productionConfig : developmentConfig;

export { env };
