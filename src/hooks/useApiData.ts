/**
 * useApiData Hook
 * Reusable hook for fetching API data with loading, error, and refresh states
 * Handles authentication checks, loading states, and error handling automatically
 */

import { useCallback, useEffect, useState } from 'react';

import { useUserStore } from '@/stores/userStore';
import type { ApiMiddlewareResult } from '@/utils/api';
import { RequestManager } from '@/utils/api';

export interface UseApiDataOptions<T> {
  /**
   * API function to call - should return ApiMiddlewareResult<T>
   */
  apiFn: () => Promise<ApiMiddlewareResult<T>>;

  /**
   * Whether to require authentication (default: true)
   */
  requireAuth?: boolean;

  /**
   * Whether to fetch immediately on mount (default: true)
   */
  fetchOnMount?: boolean;

  /**
   * Custom error message to display
   */
  errorMessage?: string;

  /**
   * Event name to listen for refresh (e.g., 'refreshCreditBalance')
   */
  refreshEvent?: string;

  /**
   * Callback when data is successfully fetched
   */
  onSuccess?: (data: T) => void;

  /**
   * Callback when error occurs
   */
  onError?: (error: any) => void;

  /**
   * Dependencies array for refetching (like useEffect deps)
   */
  deps?: any[];
}

export interface UseApiDataReturn<T> {
  /**
   * The fetched data
   */
  data: T | null;

  /**
   * Loading state
   */
  loading: boolean;

  /**
   * Error message if any
   */
  error: string | null;

  /**
   * Function to manually refetch data
   */
  refetch: () => Promise<void>;

  /**
   * Function to set data manually (useful for optimistic updates)
   */
  setData: (data: T | null) => void;

  /**
   * Function to clear error
   */
  clearError: () => void;
}

/**
 * Hook for fetching API data with automatic loading, error, and auth handling
 *
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useApiData({
 *   apiFn: () => paymentService.getCreditBalance(),
 *   errorMessage: 'Failed to load credit balance',
 *   refreshEvent: 'refreshCreditBalance',
 * });
 * ```
 */
export function useApiData<T = any>(
  options: UseApiDataOptions<T>
): UseApiDataReturn<T> {
  const {
    apiFn,
    requireAuth = true,
    fetchOnMount = true,
    errorMessage = 'Failed to load data',
    refreshEvent,
    onSuccess,
    onError,
    deps = [],
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(fetchOnMount);
  const [error, setError] = useState<string | null>(null);

  // Check authentication
  const { isAuthenticated } = useUserStore();

  const fetchData = useCallback(async () => {
    // Skip if auth required but user not authenticated
    if (requireAuth && !isAuthenticated) {
      setLoading(false);
      return;
    }

    // Skip if on auth page
    if (RequestManager.isOnAuthPage()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await apiFn();

      if (result.success && result.data) {
        setData(result.data);
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else if (result.error && !result.error.isCanceled) {
        const errorMsg =
          result.error.message || result.error.error || errorMessage;
        setError(errorMsg);
        console.error('API Error:', result.error);
        if (onError) {
          onError(result.error);
        }
      }
    } catch (err: any) {
      const errorMsg = err.message || errorMessage;
      setError(errorMsg);
      console.error('Unexpected error:', err);
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [
    apiFn,
    requireAuth,
    isAuthenticated,
    errorMessage,
    onSuccess,
    onError,
    ...deps,
  ]);

  // Initial fetch
  useEffect(() => {
    if (fetchOnMount) {
      if (requireAuth && isAuthenticated) {
        fetchData();
      } else if (!requireAuth) {
        fetchData();
      } else {
        setLoading(false);
      }
    }
  }, [fetchOnMount, requireAuth, isAuthenticated, fetchData]);

  // Listen for refresh events
  useEffect(() => {
    if (!refreshEvent) return;

    const handleRefresh = () => {
      if (requireAuth && isAuthenticated) {
        fetchData();
      } else if (!requireAuth) {
        fetchData();
      }
    };

    window.addEventListener(refreshEvent, handleRefresh);

    return () => {
      window.removeEventListener(refreshEvent, handleRefresh);
    };
  }, [refreshEvent, requireAuth, isAuthenticated, fetchData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
    clearError,
  };
}
