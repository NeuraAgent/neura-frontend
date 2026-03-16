/**
 * Routes Constants
 * Centralized route paths for the application
 */

// Public Routes
export const PUBLIC_ROUTES = {
  HOME: '/',
  DOCS: '/docs',
} as const;

// Auth Routes
export const AUTH_ROUTES = {
  LOGIN: '/neura/login',
  SIGNUP: '/neura/signup',
  FORGOT_PASSWORD: '/neura/forgot-password',
  RESET_PASSWORD: '/neura/reset-password',
  VERIFY_EMAIL: '/neura/verify-email',
  OAUTH_CALLBACK: '/neura/auth/callback',
  OAUTH_SILENT_CALLBACK: '/neura/auth/silent-callback',
} as const;

// Legacy Auth Routes (for backward compatibility)
export const LEGACY_AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  OAUTH_CALLBACK: '/auth/callback',
  OAUTH_SILENT_CALLBACK: '/auth/silent-callback',
} as const;

// Protected Routes
export const PROTECTED_ROUTES = {
  NEURA_APP: '/neura',
  SETTINGS: '/neura/settings',
} as const;

// Legacy Protected Routes (for backward compatibility)
export const LEGACY_PROTECTED_ROUTES = {
  APP: '/app',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
} as const;

// All Auth Pages (for checking if user is on auth page)
export const ALL_AUTH_PAGES = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.SIGNUP,
  AUTH_ROUTES.FORGOT_PASSWORD,
  AUTH_ROUTES.RESET_PASSWORD,
  AUTH_ROUTES.VERIFY_EMAIL,
  LEGACY_AUTH_ROUTES.LOGIN,
  LEGACY_AUTH_ROUTES.SIGNUP,
  LEGACY_AUTH_ROUTES.FORGOT_PASSWORD,
  LEGACY_AUTH_ROUTES.RESET_PASSWORD,
  LEGACY_AUTH_ROUTES.VERIFY_EMAIL,
] as const;

// Helper functions
export const isAuthPage = (pathname: string): boolean => {
  return ALL_AUTH_PAGES.includes(pathname as any);
};

export const isProtectedRoute = (pathname: string): boolean => {
  return (
    pathname.startsWith(PROTECTED_ROUTES.NEURA_APP) ||
    pathname === LEGACY_PROTECTED_ROUTES.APP ||
    pathname === LEGACY_PROTECTED_ROUTES.DASHBOARD
  );
};

export const isPublicRoute = (pathname: string): boolean => {
  return (
    pathname === PUBLIC_ROUTES.HOME ||
    pathname === PUBLIC_ROUTES.DOCS ||
    isAuthPage(pathname)
  );
};

// Storage Keys
export const STORAGE_KEYS = {
  REDIRECT_AFTER_LOGIN: 'redirect_after_login',
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_STORAGE: 'user-storage',
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN_ALT: 'refreshToken',
  USER_DATA: 'userData',
  SESSION_ID: 'sessionId',
} as const;

// Cookie Names (for HTTP-only cookies managed by backend)
export const COOKIE_NAMES = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  ACCESS_TOKEN: 'access_token',
} as const;
