/**
 * Session Manager
 * Handles session cleanup and logout operations
 * Single Responsibility: Session management
 */

import { CookieManager } from './cookieManager';
import { StorageManager } from './storageManager';

export class SessionManager {
  /**
   * Clear all session data (cookies + storage)
   */
  static clearSession(): void {
    // Clear cookies
    CookieManager.clearAuthCookies();

    // Clear storage
    StorageManager.clearAllStorage();

    console.log('✅ Session cleared successfully');
  }

  /**
   * Clear only authentication data (more conservative)
   */
  static clearAuthData(): void {
    // Clear auth cookies
    CookieManager.clearAuthCookies();

    // Clear auth storage
    StorageManager.clearAuthStorage();

    console.log('✅ Auth data cleared successfully');
  }

  /**
   * Check if user has active session
   */
  static hasActiveSession(): boolean {
    return StorageManager.hasValidToken() || CookieManager.hasAuthCookies();
  }

  /**
   * Perform complete logout
   */
  static logout(): void {
    this.clearSession();
  }
}
