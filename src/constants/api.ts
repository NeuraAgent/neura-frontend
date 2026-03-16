/**
 * API Constants
 * Centralized API configuration
 */

export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  FRONTEND_TOKEN: 'x-frontend-token',
} as const;

export const ERROR_DEBOUNCE = {
  WINDOW_MS: 2000,
  TOAST_CLEANUP_MS: 3000,
} as const;

/**
 * Public endpoints that don't require authentication
 */
export const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/refresh',
  '/health',
  '/status',
] as const;

/**
 * Auth-related endpoint patterns
 */
export const AUTH_ENDPOINT_PATTERNS = [
  '/auth/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/refresh',
] as const;

/**
 * Payment Service Endpoints
 */
export const PAYMENT_ENDPOINTS = {
  CREDITS_BALANCE: '/api/payment/credits/balance',
  CREDITS_CALCULATE: '/api/payment/credits/calculate',
  CREDITS_CHECK: '/api/payment/credits/check',
  CREDITS_HISTORY: '/api/payment/credits/history',
  PRICING_RULES: '/api/payment/pricing/rules',
  SUBSCRIPTIONS_PLANS: '/api/payment/subscriptions/plans',
} as const;

/**
 * File Service Endpoints
 */
export const FILE_ENDPOINTS = {
  FILES: '/api/files',
  FILES_ADD: '/api/files/add',
  FILES_REMOVE: '/api/files/remove',
  FILES_BY_ID: (fileId: string) => `/api/files/${fileId}`,
} as const;

/**
 * OCR Service Endpoints
 */
export const OCR_ENDPOINTS = {
  EXTRACT_TEXT: '/api/ocr/extract-text',
  HEALTH: '/api/ocr/health',
} as const;

/**
 * Settings Service Endpoints
 */
export const SETTINGS_API_ENDPOINTS = {
  CHUNK_SETTINGS: '/api/settings/chunk',
} as const;

/**
 * VectorDB Service Endpoints
 */
export const VECTORDB_API_ENDPOINTS = {
  EMBED_AND_STORE: '/api/vectordb/embed-and-store',
  BULK_EMBED_AND_STORE: '/api/vectordb/bulk-embed-and-store',
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/**
 * Error types
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  CANCELED: 'CANCELED_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTH: 'AUTH_ERROR',
  FORBIDDEN: 'FORBIDDEN_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
} as const;
