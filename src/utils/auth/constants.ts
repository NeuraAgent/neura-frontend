/**
 * Authentication Constants
 * Centralized configuration for authentication
 */

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  SESSION_ID: 'sessionId',
} as const;

export const AUTH_COOKIE_NAMES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export const AUTH_ROUTES = {
  LOGIN: '/neura/login',
  LOGOUT: '/neura/logout',
  SIGNUP: '/neura/signup',
} as const;

export const TOKEN_EXPIRY_BUFFER_MS = 60000; // 1 minute before actual expiry

export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
} as const;
