/**
 * API Error Handler Utility
 * Centralized error handling logic
 */

import type { AxiosError } from 'axios';

import { isAuthError, isForbiddenError } from '@/constants/errorCodes';
import toastService from '@/services/toastService';

export interface ApiErrorResponse {
  status?: number;
  code?: string;
  message?: string;
  details?: any;
}

export class ApiErrorHandler {
  private static lastErrorTime = 0;
  private static lastErrorMessage = '';
  private static readonly ERROR_DEBOUNCE_MS = 2000;
  private static shownToasts = new Set<string>();
  private static readonly TOAST_CLEANUP_INTERVAL = 3000;

  /**
   * Check if error is duplicate
   */
  static isDuplicateError(errorIdentifier: string): boolean {
    const now = Date.now();
    const isDuplicate =
      errorIdentifier === this.lastErrorMessage &&
      now - this.lastErrorTime < this.ERROR_DEBOUNCE_MS;

    if (!isDuplicate) {
      this.lastErrorMessage = errorIdentifier;
      this.lastErrorTime = now;
    }

    return isDuplicate;
  }

  /**
   * Check if toast should be shown
   */
  static shouldShowToast(errorIdentifier: string): boolean {
    if (this.shownToasts.has(errorIdentifier)) {
      console.warn('⚠️ Toast already shown for this error, skipping');
      return false;
    }

    this.shownToasts.add(errorIdentifier);

    setTimeout(() => {
      this.shownToasts.delete(errorIdentifier);
    }, this.TOAST_CLEANUP_INTERVAL);

    return true;
  }

  /**
   * Extract error information from axios error
   */
  static extractErrorInfo(error: AxiosError): ApiErrorResponse {
    const status = error.response?.status;
    const errorData = error.response?.data as any;
    const code = errorData?.error || '';
    const message = errorData?.message || error.message || '';

    return { status, code, message, details: errorData };
  }

  /**
   * Create unique error identifier
   */
  static createErrorIdentifier(errorInfo: ApiErrorResponse): string {
    return `${errorInfo.status}-${errorInfo.code}-${errorInfo.message}`;
  }

  /**
   * Handle 401 Unauthorized errors
   */
  static handle401Error(errorInfo: ApiErrorResponse): boolean {
    console.error('❌ 401 Unauthorized:', errorInfo.message);

    if (isAuthError(errorInfo.code || '')) {
      const errorId = this.createErrorIdentifier(errorInfo);

      if (this.shouldShowToast(errorId)) {
        toastService.error(
          errorInfo.message || 'Session expired. Please login again.'
        );
      }

      return true; // Handled
    }

    return false; // Not handled
  }

  /**
   * Handle 403 Forbidden errors
   */
  static handle403Error(errorInfo: ApiErrorResponse): boolean {
    console.error('❌ 403 Forbidden:', errorInfo.message);

    if (isForbiddenError(errorInfo.code || '')) {
      const errorId = this.createErrorIdentifier(errorInfo);

      if (this.shouldShowToast(errorId)) {
        toastService.error(
          errorInfo.message ||
            'You do not have permission to access this resource'
        );
      }

      return true; // Handled
    }

    return false; // Not handled
  }

  /**
   * Handle 429 Rate Limit errors
   */
  static handle429Error(errorInfo: ApiErrorResponse): boolean {
    console.error('❌ 429 Rate Limit Exceeded:', errorInfo.message);

    const errorId = this.createErrorIdentifier(errorInfo);

    if (this.shouldShowToast(errorId)) {
      toastService.warning(
        errorInfo.message || 'Too many requests. Please try again later.'
      );
    }

    return true; // Handled
  }

  /**
   * Handle 5xx Server errors
   */
  static handle5xxError(errorInfo: ApiErrorResponse): boolean {
    console.error(`❌ ${errorInfo.status} Server Error:`, errorInfo.message);

    const errorId = this.createErrorIdentifier(errorInfo);

    if (this.shouldShowToast(errorId)) {
      toastService.error(
        errorInfo.message || 'Server error. Please try again later.'
      );
    }

    return true; // Handled
  }

  /**
   * Handle network errors
   */
  static handleNetworkError(error: any): boolean {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('❌ Network Error');

      const errorId = 'network-error';

      if (this.shouldShowToast(errorId)) {
        toastService.error(
          'Network error. Please check your connection and try again.'
        );
      }

      return true; // Handled
    }

    return false; // Not handled
  }

  /**
   * Main error handler
   */
  static handleError(error: any): {
    handled: boolean;
    errorInfo: ApiErrorResponse;
  } {
    // Skip canceled requests
    if (error?.isCanceled || error?.code === 'ERR_CANCELED') {
      console.log('⚠️ Request was canceled');
      return { handled: true, errorInfo: {} };
    }

    // Handle network errors
    if (this.handleNetworkError(error)) {
      return { handled: true, errorInfo: {} };
    }

    // Extract error info
    const errorInfo = this.extractErrorInfo(error);
    const errorId = this.createErrorIdentifier(errorInfo);

    // Check for duplicates
    if (this.isDuplicateError(errorId)) {
      console.warn('⚠️ Duplicate error detected, skipping');
      return { handled: true, errorInfo };
    }

    // Handle by status code
    let handled = false;

    switch (errorInfo.status) {
      case 401:
        handled = this.handle401Error(errorInfo);
        break;
      case 403:
        handled = this.handle403Error(errorInfo);
        break;
      case 404:
        // Don't show toast for 404s (might be expected)
        console.error('❌ 404 Not Found:', error.config?.url);
        handled = false;
        break;
      case 429:
        handled = this.handle429Error(errorInfo);
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        handled = this.handle5xxError(errorInfo);
        break;
      default:
        // Other errors - log but don't handle
        if (import.meta.env.DEV) {
          console.error(
            `❌ ${errorInfo.status || 'Unknown'} Error:`,
            errorInfo.message
          );
        }
        handled = false;
    }

    return { handled, errorInfo };
  }
}
