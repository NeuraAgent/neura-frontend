/**
 * useApiRequest Hook
 * Centralized API request management with authentication checks
 */

import { useCallback, useEffect, useRef } from 'react';

import { useUserStore } from '@/stores/userStore';
import { RequestManager } from '@/utils/api';
import { apiClient } from '@/utils/apiClient';

import { useErrorHandler } from './useErrorHandler';

interface UseApiRequestOptions {
  requiresAuth?: boolean;
  showErrorToast?: boolean;
  onError?: (error: any) => void;
}

export function useApiRequest() {
  const { isAuthenticated } = useUserStore();
  const { handleError } = useErrorHandler();
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel all pending requests when component unmounts
      abortControllersRef.current.forEach(controller => {
        controller.abort();
      });
      abortControllersRef.current.clear();
    };
  }, []);

  /**
   * Make GET request
   */
  const get = useCallback(
    async <T = any>(
      url: string,
      options: UseApiRequestOptions = {}
    ): Promise<T> => {
      const { requiresAuth = true, showErrorToast = false, onError } = options;

      // Check authentication if required
      if (requiresAuth && !isAuthenticated) {
        const error = new Error('Authentication required');
        (error as any).code = 'AUTH_REQUIRED';
        throw error;
      }

      // Check if request should be allowed
      if (!RequestManager.shouldAllowRequest({ url, method: 'GET' })) {
        const error = new Error('Request not allowed on auth page');
        (error as any).isCanceled = true;
        throw error;
      }

      try {
        const response = await apiClient.get<T>(url);
        return response.data;
      } catch (error: any) {
        const errorMessage = handleError(error, {
          showToast: showErrorToast,
          onError,
        });

        if (errorMessage && !error?.isHandledByInterceptor) {
          throw error;
        }

        throw error;
      }
    },
    [isAuthenticated, handleError]
  );

  /**
   * Make POST request
   */
  const post = useCallback(
    async <T = any>(
      url: string,
      data?: any,
      options: UseApiRequestOptions = {}
    ): Promise<T> => {
      const { requiresAuth = true, showErrorToast = false, onError } = options;

      // Check authentication if required
      if (requiresAuth && !isAuthenticated) {
        const error = new Error('Authentication required');
        (error as any).code = 'AUTH_REQUIRED';
        throw error;
      }

      // Check if request should be allowed
      if (!RequestManager.shouldAllowRequest({ url, method: 'POST' })) {
        const error = new Error('Request not allowed on auth page');
        (error as any).isCanceled = true;
        throw error;
      }

      try {
        const response = await apiClient.post<T>(url, data);
        return response.data;
      } catch (error: any) {
        const errorMessage = handleError(error, {
          showToast: showErrorToast,
          onError,
        });

        if (errorMessage && !error?.isHandledByInterceptor) {
          throw error;
        }

        throw error;
      }
    },
    [isAuthenticated, handleError]
  );

  /**
   * Make PUT request
   */
  const put = useCallback(
    async <T = any>(
      url: string,
      data?: any,
      options: UseApiRequestOptions = {}
    ): Promise<T> => {
      const { requiresAuth = true, showErrorToast = false, onError } = options;

      // Check authentication if required
      if (requiresAuth && !isAuthenticated) {
        const error = new Error('Authentication required');
        (error as any).code = 'AUTH_REQUIRED';
        throw error;
      }

      // Check if request should be allowed
      if (!RequestManager.shouldAllowRequest({ url, method: 'PUT' })) {
        const error = new Error('Request not allowed on auth page');
        (error as any).isCanceled = true;
        throw error;
      }

      try {
        const response = await apiClient.put<T>(url, data);
        return response.data;
      } catch (error: any) {
        const errorMessage = handleError(error, {
          showToast: showErrorToast,
          onError,
        });

        if (errorMessage && !error?.isHandledByInterceptor) {
          throw error;
        }

        throw error;
      }
    },
    [isAuthenticated, handleError]
  );

  /**
   * Make DELETE request
   */
  const del = useCallback(
    async <T = any>(
      url: string,
      options: UseApiRequestOptions = {}
    ): Promise<T> => {
      const { requiresAuth = true, showErrorToast = false, onError } = options;

      // Check authentication if required
      if (requiresAuth && !isAuthenticated) {
        const error = new Error('Authentication required');
        (error as any).code = 'AUTH_REQUIRED';
        throw error;
      }

      // Check if request should be allowed
      if (!RequestManager.shouldAllowRequest({ url, method: 'DELETE' })) {
        const error = new Error('Request not allowed on auth page');
        (error as any).isCanceled = true;
        throw error;
      }

      try {
        const response = await apiClient.delete<T>(url);
        return response.data;
      } catch (error: any) {
        const errorMessage = handleError(error, {
          showToast: showErrorToast,
          onError,
        });

        if (errorMessage && !error?.isHandledByInterceptor) {
          throw error;
        }

        throw error;
      }
    },
    [isAuthenticated, handleError]
  );

  /**
   * Cancel all pending requests
   */
  const cancelAll = useCallback(() => {
    abortControllersRef.current.forEach(controller => {
      controller.abort();
    });
    abortControllersRef.current.clear();
  }, []);

  return {
    get,
    post,
    put,
    delete: del,
    cancelAll,
  };
}
