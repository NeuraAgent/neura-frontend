/**
 * Error Handler Utility
 * Centralized error handling with toast notifications
 */

import toastService from '@/services/toastService';

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  details?: any[];
}

/**
 * Handle API errors and show user-friendly toast messages
 */
export function handleApiError(
  error: any,
  defaultMessage: string = 'An error occurred'
): ErrorResponse {
  // Extract error message from response
  const errorMessage =
    error.response?.data?.message || error.message || defaultMessage;

  // Show toast notification
  toastService.error(errorMessage);

  // Return error response
  if (error.response?.data) {
    return error.response.data as ErrorResponse;
  }

  return {
    success: false,
    message: errorMessage,
    error: 'UNKNOWN_ERROR',
  };
}

/**
 * Handle network errors
 */
export function handleNetworkError(): ErrorResponse {
  const message = 'Network error. Please check your connection and try again.';
  toastService.error(message);

  return {
    success: false,
    message,
    error: 'NETWORK_ERROR',
  };
}

/**
 * Show success toast
 */
export function showSuccess(message: string) {
  toastService.success(message);
}

/**
 * Show warning toast
 */
export function showWarning(message: string) {
  toastService.warning(message);
}

/**
 * Show info toast
 */
export function showInfo(message: string) {
  toastService.info(message);
}

/**
 * Log error to console in development only
 */
export function logError(context: string, error: any) {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
}
