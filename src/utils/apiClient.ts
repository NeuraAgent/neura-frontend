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

      // DEV: Log cookies being sent
      if (import.meta.env.DEV) {
        const cookies = document.cookie
          .split(';')
          .map(c => c.trim())
          .filter(c => c);
        const authToken = cookies.find(c => c.startsWith('auth_token='));

        console.log(
          `🍪 [Request] ${config.method?.toUpperCase()} ${config.url}`
        );
        if (authToken) {
          console.log('✅ auth_token present');
        } else {
          console.warn('⚠️ auth_token missing');
        }
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
        if (import.meta.env.DEV) {
          console.error('❌ Failed to get frontend token:', error);
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
    (response: AxiosResponse) => {
      // DEV: Check auth cookies after login
      if (import.meta.env.DEV && response.config.url?.includes('/login')) {
        console.log('🔐 [Login] Response status:', response.status);

        const cookies = document.cookie.split(';').map(c => c.trim());
        const hasAuthToken = cookies.some(c => c.startsWith('auth_token='));
        const hasRefreshToken = cookies.some(c =>
          c.startsWith('refresh_token=')
        );

        if (hasAuthToken && hasRefreshToken) {
          console.log('✅ [Login] Auth cookies set successfully');
        } else {
          console.error('❌ [Login] Auth cookies NOT set');
          console.error('   auth_token:', hasAuthToken ? 'present' : 'missing');
          console.error(
            '   refresh_token:',
            hasRefreshToken ? 'present' : 'missing'
          );
        }
      }

      return response;
    },
    (error: AxiosError) => {
      return handleErrorResponse(error);
    }
  );

  return api;
}

// Default API client instance
export const apiClient = createApiClient();
