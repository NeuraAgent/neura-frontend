/**
 * useErrorHandler Hook
 * Centralized error handling with toast notifications
 * Prevents duplicate error messages from API interceptors
 */

import { useCallback } from 'react';

import toastService from '@/services/toastService';

interface ErrorHandlerOptions {
  showToast?: boolean;
  defaultMessage?: string;
  onError?: (error: any) => void;
}

export function useErrorHandler() {
  /**
   * Handle errors with optional toast notification
   * Checks if error was already handled by interceptor to prevent duplicates
   */
  const handleError = useCallback(
    (error: any, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        defaultMessage = 'An unexpected error occurred',
        onError,
      } = options;

      // Skip if request was canceled (on auth pages)
      if (error?.isCanceled) {
        return null;
      }

      // Skip if error was already handled by the interceptor
      if (error?.isHandledByInterceptor) {
        return null;
      }

      // Extract error message
      const errorMessage =
        error?.response?.data?.message || error?.message || defaultMessage;

      // Show toast if enabled
      if (showToast) {
        toastService.error(errorMessage);
      }

      // Call custom error handler if provided
      if (onError) {
        onError(error);
      }

      return errorMessage;
    },
    []
  );

  /**
   * Show success message
   */
  const showSuccess = useCallback((message: string) => {
    toastService.success(message);
  }, []);

  /**
   * Show warning message
   */
  const showWarning = useCallback((message: string) => {
    toastService.warning(message);
  }, []);

  /**
   * Show info message
   */
  const showInfo = useCallback((message: string) => {
    toastService.info(message);
  }, []);

  return {
    handleError,
    showSuccess,
    showWarning,
    showInfo,
  };
}
