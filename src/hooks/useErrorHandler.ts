import { AxiosError } from 'axios';
import { useCallback } from 'react';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  redirectOnAuth?: boolean;
}

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const { showToast = true, logError = true, redirectOnAuth = true } = options;

  const handleError = useCallback(
    (error: unknown): ApiError => {
      const apiError: ApiError = {
        message: 'An unexpected error occurred',
      };

      // Handle Axios errors
      if (error instanceof AxiosError) {
        apiError.status = error.response?.status;
        apiError.code = error.code;

        if (error.response?.data?.message) {
          apiError.message = error.response.data.message;
        } else if (error.response?.statusText) {
          apiError.message = error.response.statusText;
        } else if (error.message) {
          apiError.message = error.message;
        }

        // Handle specific HTTP status codes
        switch (error.response?.status) {
          case 400:
            apiError.message =
              'Bad request. Please check your input and try again.';
            break;
          case 401:
            apiError.message =
              'You are not authorized. Please log in and try again.';
            if (redirectOnAuth) {
              // Redirect to login page
              window.location.href = '/login';
            }
            break;
          case 403:
            apiError.message =
              'You do not have permission to perform this action.';
            break;
          case 404:
            apiError.message = 'The requested resource was not found.';
            break;
          case 429:
            apiError.message =
              'Too many requests. Please wait a moment and try again.';
            break;
          case 500:
            apiError.message = 'Internal server error. Please try again later.';
            break;
          case 502:
            apiError.message =
              'Service temporarily unavailable. Please try again later.';
            break;
          case 503:
            apiError.message = 'Service unavailable. Please try again later.';
            break;
          default:
            if (error.response?.status && error.response.status >= 500) {
              apiError.message = 'Server error. Please try again later.';
            }
        }
      }
      // Handle JavaScript errors
      else if (error instanceof Error) {
        apiError.message = error.message;
      }
      // Handle string errors
      else if (typeof error === 'string') {
        apiError.message = error;
      }

      // Log error in development
      if (logError && import.meta.env.DEV) {
        console.error('Error handled:', error);
      }

      // Show toast notification (you can integrate with a toast library here)
      if (showToast) {
        // For now, just log to console. In a real app, you'd use a toast library
        console.warn('Error:', apiError.message);
      }

      return apiError;
    },
    [showToast, logError, redirectOnAuth]
  );

  const handleAsyncError = useCallback(
    async (asyncFn: () => Promise<any>, fallbackValue?: any) => {
      try {
        return await asyncFn();
      } catch (error) {
        const apiError = handleError(error);

        // Return fallback value if provided, otherwise throw
        if (fallbackValue !== undefined) {
          return fallbackValue;
        }

        throw apiError;
      }
    },
    [handleError]
  );

  return {
    handleError,
    handleAsyncError,
  };
};
