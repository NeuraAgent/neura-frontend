/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_WEBSOCKET_URL: string;
  readonly VITE_AI_SOCKET_URL: string;
  readonly VITE_VECTORDB_API_URL: string;
  readonly VITE_PAYMENT_API_URL: string;
  readonly VITE_FRONTEND_JWT_TOKEN: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_SESSION_TTL: string;
  readonly VITE_ENABLE_INTRO_TOUR: string;
  readonly VITE_AWS_ACCESS_KEY_ID?: string;
  readonly VITE_AWS_SECRET_ACCESS_KEY?: string;
  readonly VITE_AWS_REGION?: string;
  readonly VITE_AWS_S3_BUCKET_NAME?: string;
  readonly VITE_AWS_S3_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
