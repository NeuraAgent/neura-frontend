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

    // Clear storage (this clears ALL localStorage including Zustand stores)
    StorageManager.clearAllStorage();

    // Explicitly clear Zustand persisted stores to prevent rehydration issues
    // These are the keys used by Zustand persist middleware
    try {
      localStorage.removeItem('user-storage'); // userStore
      localStorage.removeItem('auth_token'); // Legacy token key
      localStorage.removeItem('refresh_token'); // Legacy refresh token key
    } catch (error) {
      console.error('Error clearing Zustand stores:', error);
    }
  }

  /**
   * Clear only authentication data (more conservative)
   */
  static clearAuthData(): void {
    // Clear auth cookies
    CookieManager.clearAuthCookies();

    // Clear auth storage
    StorageManager.clearAuthStorage();

    // Clear Zustand user store
    try {
      localStorage.removeItem('user-storage');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
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
