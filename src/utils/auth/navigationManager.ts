/**
 * Navigation Manager
 * Handles navigation operations
 * Single Responsibility: Navigation only
 */

import { AUTH_ROUTES } from './constants';

export class NavigationManager {
  /**
   * Navigate to login page
   */
  static navigateToLogin(returnUrl?: string): void {
    const url = returnUrl
      ? `${AUTH_ROUTES.LOGIN}?returnUrl=${encodeURIComponent(returnUrl)}`
      : AUTH_ROUTES.LOGIN;

    window.location.href = url;
  }

  /**
   * Navigate to logout page
   */
  static navigateToLogout(): void {
    window.location.href = AUTH_ROUTES.LOGOUT;
  }

  /**
   * Reload current page
   */
  static reloadPage(): void {
    window.location.reload();
  }

  /**
   * Get current path
   */
  static getCurrentPath(): string {
    return window.location.pathname + window.location.search;
  }

  /**
   * Check if current page is login page
   */
  static isLoginPage(): boolean {
    return window.location.pathname === AUTH_ROUTES.LOGIN;
  }

  /**
   * Check if current page is public route
   */
  static isPublicRoute(): boolean {
    const publicRoutes = [
      AUTH_ROUTES.LOGIN,
      AUTH_ROUTES.SIGNUP,
      '/neura/forgot-password',
      '/neura/reset-password',
      '/neura/verify-email',
      '/neura/oauth-callback',
      '/',
    ];

    return publicRoutes.some(route =>
      window.location.pathname.startsWith(route)
    );
  }
}
