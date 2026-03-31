/**
 * Centralized API Client - Refactored
 * Clean architecture with separated concerns
 */

import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { API_CONFIG, API_HEADERS } from '@/constants/api';

import { ApiErrorHandler, LogoutManager, RequestManager } from './api';
import { env } from './env';

// Export logout callback registration for components
export const registerLogoutCallback =
  LogoutManager.registerCallback.bind(LogoutManager);

// Token storage for development mode
const DEV_TOKEN_STORAGE = {
  getAccessToken: (): string | null => {
    if (env.NODE_ENV === 'development') {
      return localStorage.getItem('dev_access_token');
    }
    return null;
  },
  getRefreshToken: (): string | null => {
    if (env.NODE_ENV === 'development') {
      return localStorage.getItem('dev_refresh_token');
    }
    return null;
  },
  setTokens: (accessToken: string, refreshToken: string): void => {
    if (env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      localStorage.setItem('dev_access_token', accessToken);
      localStorage.setItem('dev_refresh_token', refreshToken);
      localStorage.setItem('dev_token_timestamp', timestamp);
    }
  },
  clearTokens: (): void => {
    if (env.NODE_ENV === 'development') {
      localStorage.removeItem('dev_access_token');
      localStorage.removeItem('dev_refresh_token');
      localStorage.removeItem('dev_token_timestamp');
    }
  },
};

// Export token storage for use in auth service
export { DEV_TOKEN_STORAGE };

/**
 * Handle error responses
 */
function handleErrorResponse(error: AxiosError | unknown): Promise<never> {
  // Use centralized error handler
  const { handled, errorInfo } = ApiErrorHandler.handleError(error);

  // If error was handled (401, 403, 429, 5xx), mark it
  if (handled) {
    (
      error as AxiosError & { isHandledByInterceptor?: boolean }
    ).isHandledByInterceptor = true;

    // Trigger logout for 401 auth errors
    if (errorInfo.status === 401) {
      // Clear dev tokens on 401
      DEV_TOKEN_STORAGE.clearTokens();
      LogoutManager.logout('Token expired, invalid, or missing');
    }
  }

  return Promise.reject(error);
}

/**
 * Create API client instance
 */
export function createApiClient(baseURL?: string): AxiosInstance {
  const api = axios.create({
    baseURL: baseURL || env.VITE_API_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      [API_HEADERS.CONTENT_TYPE]: 'application/json',
    },
    withCredentials: true,
  });

  // Request interceptor
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Check if request should be allowed
      if (!RequestManager.shouldAllowRequest(config)) {
        return Promise.reject({
          message: 'Request canceled - on auth page',
          config,
          isCanceled: true,
        });
      }

      // Add cache-busting headers for GET requests
      if (config.method?.toLowerCase() === 'get') {
        config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        config.headers['Pragma'] = 'no-cache';
        config.headers['Expires'] = '0';
      }

      // Add frontend authentication token
      try {
        const frontendToken = import.meta.env.VITE_FRONTEND_JWT_TOKEN;
        if (!frontendToken) {
          throw new Error('Frontend JWT token not configured');
        }
        config.headers['x-frontend-auth'] = `Bearer ${frontendToken}`;
      } catch (error) {
        if (env.NODE_ENV === 'development') {
          console.error('❌ Failed to get frontend token:', error);
        }
      }

      // In DEV mode, add Authorization header with access token
      if (env.NODE_ENV === 'development') {
        const accessToken = DEV_TOKEN_STORAGE.getAccessToken();
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      return handleErrorResponse(error);
    }
  );

  return api;
}

// Default API client instance
export const apiClient = createApiClient();
