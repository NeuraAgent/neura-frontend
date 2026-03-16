/**
 * API Middleware
 * Centralized request handling with built-in try-catch
 * No need for try-catch in components
 */

import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import { useUserStore } from '@/stores/userStore';

import { apiClient } from '../apiClient';

import { ApiErrorHandler } from './errorHandler';
import { RequestManager } from './requestManager';

export interface ApiMiddlewareOptions {
  requiresAuth?: boolean;
  showErrorToast?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onFinally?: () => void;
}

export interface ApiMiddlewareResult<T = any> {
  data: T | null;
  error: any | null;
  success: boolean;
}

/**
 * API Middleware - Handles all requests with built-in error handling
 */
export class ApiMiddleware {
  /**
   * Execute request with middleware
   */
  private static async execute<T = any>(
    requestFn: () => Promise<AxiosResponse<T>>,
    options: ApiMiddlewareOptions = {}
  ): Promise<ApiMiddlewareResult<T>> {
    const {
      requiresAuth = true,
      showErrorToast = false,
      onSuccess,
      onError,
      onFinally,
    } = options;

    try {
      // Check authentication if required
      if (requiresAuth && !useUserStore.getState().isAuthenticated) {
        const error = new Error('Authentication required');
        (error as any).code = 'AUTH_REQUIRED';

        if (onError) onError(error);
        if (onFinally) onFinally();

        return {
          data: null,
          error,
          success: false,
        };
      }

      // Execute request
      const response = await requestFn();
      const data = response.data;

      // Call success callback
      if (onSuccess) onSuccess(data);
      if (onFinally) onFinally();

      return {
        data,
        error: null,
        success: true,
      };
    } catch (error: any) {
      // Skip if canceled
      if (error?.isCanceled || error?.code === 'ERR_CANCELED') {
        if (onFinally) onFinally();
        return {
          data: null,
          error,
          success: false,
        };
      }

      // Handle error with centralized handler
      const { handled } = ApiErrorHandler.handleError(error);

      // Show toast if requested and not already handled
      if (showErrorToast && !handled) {
        ApiErrorHandler.handleError(error);
      }

      // Call error callback
      if (onError) onError(error);
      if (onFinally) onFinally();

      return {
        data: null,
        error,
        success: false,
      };
    }
  }

  /**
   * GET request
   */
  static async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    options?: ApiMiddlewareOptions
  ): Promise<ApiMiddlewareResult<T>> {
    // Check if request should be allowed
    if (!RequestManager.shouldAllowRequest({ url, method: 'GET', ...config })) {
      return {
        data: null,
        error: { message: 'Request blocked on auth page', isCanceled: true },
        success: false,
      };
    }

    return this.execute<T>(() => apiClient.get<T>(url, config), options);
  }

  /**
   * POST request
   */
  static async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    options?: ApiMiddlewareOptions
  ): Promise<ApiMiddlewareResult<T>> {
    // Check if request should be allowed
    if (
      !RequestManager.shouldAllowRequest({ url, method: 'POST', ...config })
    ) {
      return {
        data: null,
        error: { message: 'Request blocked on auth page', isCanceled: true },
        success: false,
      };
    }

    return this.execute<T>(() => apiClient.post<T>(url, data, config), options);
  }

  /**
   * PUT request
   */
  static async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    options?: ApiMiddlewareOptions
  ): Promise<ApiMiddlewareResult<T>> {
    // Check if request should be allowed
    if (!RequestManager.shouldAllowRequest({ url, method: 'PUT', ...config })) {
      return {
        data: null,
        error: { message: 'Request blocked on auth page', isCanceled: true },
        success: false,
      };
    }

    return this.execute<T>(() => apiClient.put<T>(url, data, config), options);
  }

  /**
   * PATCH request
   */
  static async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    options?: ApiMiddlewareOptions
  ): Promise<ApiMiddlewareResult<T>> {
    // Check if request should be allowed
    if (
      !RequestManager.shouldAllowRequest({ url, method: 'PATCH', ...config })
    ) {
      return {
        data: null,
        error: { message: 'Request blocked on auth page', isCanceled: true },
        success: false,
      };
    }

    return this.execute<T>(
      () => apiClient.patch<T>(url, data, config),
      options
    );
  }

  /**
   * DELETE request
   */
  static async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    options?: ApiMiddlewareOptions
  ): Promise<ApiMiddlewareResult<T>> {
    // Check if request should be allowed
    if (
      !RequestManager.shouldAllowRequest({ url, method: 'DELETE', ...config })
    ) {
      return {
        data: null,
        error: { message: 'Request blocked on auth page', isCanceled: true },
        success: false,
      };
    }

    return this.execute<T>(() => apiClient.delete<T>(url, config), options);
  }
}
