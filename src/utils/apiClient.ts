/**
 * Centralized API Client with Frontend Authentication
 * All API requests should use this client to include frontend JWT token
 */

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

import { env } from './env';

function getFrontendToken(): string {
  const token = import.meta.env.VITE_FRONTEND_JWT_TOKEN;

  if (!token) {
    if (import.meta.env.DEV) {
      console.error(
        '❌ VITE_FRONTEND_JWT_TOKEN not found in environment variables'
      );
    }
    throw new Error('Frontend JWT token not configured');
  }

  if (import.meta.env.DEV) {
    console.log('✅ Frontend token loaded:', token.substring(0, 50) + '...');
  }
  return token;
}

export function createApiClient(baseURL?: string): AxiosInstance {
  const api = axios.create({
    baseURL: baseURL || env.VITE_API_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - add frontend token to all requests
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      try {
        const frontendToken = getFrontendToken();
        config.headers['x-frontend-token'] = frontendToken;
        if (import.meta.env.DEV) {
          console.log('🔑 Frontend token added to request:', config.url);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('❌ Failed to get frontend token:', error);
        }
      }

      // Add user auth token if available
      const userToken = localStorage.getItem('auth_token');
      if (userToken) {
        config.headers['Authorization'] = `Bearer ${userToken}`;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle errors
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // Handle unauthorized - might need to refresh token or redirect to login
        if (import.meta.env.DEV) {
          console.error('Unauthorized request:', error.response?.data);
        }
      } else if (error.response?.status === 403) {
        // Handle forbidden - frontend doesn't have permission
        if (import.meta.env.DEV) {
          console.error('Forbidden request:', error.response?.data);
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
}

// Default API client instance
export const apiClient = createApiClient();
