/**
 * Axios Interceptor
 * HTTP interceptor for handling token expiry in API responses
 * Dependency Inversion: Depends on abstractions (TokenExpiryHandler)
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

import { HTTP_STATUS } from './constants';
import { NavigationManager } from './navigationManager';
import { StorageManager } from './storageManager';
import { TokenExpiryHandler } from './tokenExpiryHandler';

export class AxiosInterceptor {
  private static isSetup = false;

  /**
   * Setup axios interceptors
   */
  static setup(axiosInstance: AxiosInstance = axios): void {
    if (this.isSetup) {
      console.warn('Axios interceptors already setup');
      return;
    }

    // Request interceptor - Add token to requests
    axiosInstance.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    );

    // Response interceptor - Handle errors
    axiosInstance.interceptors.response.use(
      response => response,
      this.handleResponseError
    );

    this.isSetup = true;
  }

  /**
   * Handle outgoing requests
   */
  private static handleRequest(
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    // Add token to request if available
    const token = StorageManager.getItem('accessToken');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }

  /**
   * Handle request errors
   */
  private static handleRequestError(error: unknown): Promise<never> {
    console.error('Request error:', error);
    return Promise.reject(error);
  }

  /**
   * Handle response errors
   */
  private static handleResponseError(error: AxiosError): Promise<never> {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // Don't handle errors for public routes
    if (NavigationManager.isPublicRoute()) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (status === HTTP_STATUS.UNAUTHORIZED) {
      console.error(`❌ 401 Unauthorized: ${url}`);

      // Don't redirect if already on login page
      if (!NavigationManager.isLoginPage()) {
        TokenExpiryHandler.handle401Error();
      }

      return Promise.reject(error);
    }

    // Handle 403 Forbidden
    if (status === HTTP_STATUS.FORBIDDEN) {
      console.error(`❌ 403 Forbidden: ${url}`);
      TokenExpiryHandler.handle403Error();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }

  /**
   * Remove interceptors
   */
  static teardown(axiosInstance: AxiosInstance = axios): void {
    axiosInstance.interceptors.request.clear();
    axiosInstance.interceptors.response.clear();
    this.isSetup = false;
  }
}
