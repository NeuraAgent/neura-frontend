/**
 * useApi Hook
 * Simple hook for API requests - no try-catch needed!
 */

import { useCallback } from 'react';

import { ApiMiddleware, type ApiMiddlewareOptions } from '@/utils/api';

export function useApi() {
  /**
   * GET request - no try-catch needed
   */
  const get = useCallback(
    async <T = any>(url: string, options?: ApiMiddlewareOptions) => {
      return ApiMiddleware.get<T>(url, undefined, options);
    },
    []
  );

  /**
   * POST request - no try-catch needed
   */
  const post = useCallback(
    async <T = any>(
      url: string,
      data?: any,
      options?: ApiMiddlewareOptions
    ) => {
      return ApiMiddleware.post<T>(url, data, undefined, options);
    },
    []
  );

  /**
   * PUT request - no try-catch needed
   */
  const put = useCallback(
    async <T = any>(
      url: string,
      data?: any,
      options?: ApiMiddlewareOptions
    ) => {
      return ApiMiddleware.put<T>(url, data, undefined, options);
    },
    []
  );

  /**
   * PATCH request - no try-catch needed
   */
  const patch = useCallback(
    async <T = any>(
      url: string,
      data?: any,
      options?: ApiMiddlewareOptions
    ) => {
      return ApiMiddleware.patch<T>(url, data, undefined, options);
    },
    []
  );

  /**
   * DELETE request - no try-catch needed
   */
  const del = useCallback(
    async <T = any>(url: string, options?: ApiMiddlewareOptions) => {
      return ApiMiddleware.delete<T>(url, undefined, options);
    },
    []
  );

  return {
    get,
    post,
    put,
    patch,
    delete: del,
  };
}
