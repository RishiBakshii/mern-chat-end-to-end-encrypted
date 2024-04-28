/// <reference types="vite/client" />

import type { envSchemaType } from "./schemas/envSchema"

  
interface ImportMeta {
readonly env: envSchemaType
}