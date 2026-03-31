/**
 * Token Expiry Handler
 * Main handler for token expiration scenarios
 * Orchestrates session cleanup and navigation
 */

import { NavigationManager } from './navigationManager';
import { SessionManager } from './sessionManager';

export interface TokenExpiryOptions {
  clearSession?: boolean;
  showNotification?: boolean;
  returnUrl?: string;
  message?: string;
}

export class TokenExpiryHandler {
  private static isHandling = false;

  /**
   * Handle token expiration
   * Main entry point for token expiry handling
   */
  static handleTokenExpiry(options: TokenExpiryOptions = {}): void {
    // Prevent multiple simultaneous calls
    if (this.isHandling) {
      return;
    }

    this.isHandling = true;

    const {
      clearSession = true,
      showNotification = true,
      returnUrl,
      message = 'Your session has expired. Please login again.',
    } = options;

    try {
      if (showNotification) {
        this.showExpiryNotification(message);
      }

      // Clear session data
      if (clearSession) {
        SessionManager.clearSession();
      }

      // Navigate to login (with small delay to ensure notification is visible)
      setTimeout(() => {
        const currentPath = NavigationManager.getCurrentPath();
        const redirectUrl = returnUrl || currentPath;

        // Only add returnUrl if not already on login page
        if (!NavigationManager.isLoginPage()) {
          NavigationManager.navigateToLogin(redirectUrl);
        }

        this.isHandling = false;
      }, 500);
    } catch (error) {
      console.error('Error handling token expiry:', error);
      this.isHandling = false;

      // Fallback: force navigation to login
      NavigationManager.navigateToLogin();
    }
  }

  /**
   * Handle 401 Unauthorized response
   */
  static handle401Error(): void {
    console.error('❌ 401 Unauthorized - Token expired or invalid');

    this.handleTokenExpiry({
      clearSession: true,
      showNotification: true,
      message: 'Your session has expired. Please login again.',
    });
  }

  /**
   * Handle 403 Forbidden response
   */
  static handle403Error(): void {
    console.error('❌ 403 Forbidden - Access denied');

    this.handleTokenExpiry({
      clearSession: false,
      showNotification: true,
      message: 'Access denied. Please check your permissions.',
    });
  }

  /**
   * Show expiry notification
   */
  private static showExpiryNotification(message: string): void {
    // Try to use toast service if available
    try {
      // Dynamic import to avoid circular dependencies
      import('@/services/toastService').then(({ toastService }) => {
        toastService.error(message);
      });
    } catch {
      // Fallback to alert if toast service not available
    }
  }

  /**
   * Check if token is expired (if we have expiry info)
   */
  static isTokenExpired(expiryTime?: number): boolean {
    if (!expiryTime) return false;
    return Date.now() >= expiryTime;
  }

  /**
   * Logout user manually
   */
  static logout(): void {
    SessionManager.logout();
    NavigationManager.navigateToLogin();
  }
}
