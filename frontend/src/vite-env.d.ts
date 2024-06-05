/// <reference types="vite/client" />

import { envSchemaType } from "./schemas/envSchema";

declare global {
  interface ImportMetaEnv extends envSchemaType {
    
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
