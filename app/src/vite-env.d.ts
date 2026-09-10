/// <reference types="vite/client" />

declare const __BUILD_TIME__: string;
declare const __BUILD_ID__: number;

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
