/**
 * Logout Manager
 * Centralized logout handling
 */

import { ALL_AUTH_PAGES } from '@/constants/routes';

import { RequestManager } from './requestManager';

type LogoutCallback = (reason: string) => void;

export class LogoutManager {
  private static callbacks: LogoutCallback[] = [];
  private static isLoggingOut = false;

  /**
   * Register a logout callback
   */
  static registerCallback(callback: LogoutCallback): () => void {
    this.callbacks.push(callback);

    // Return unregister function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Check if already on auth page
   */
  static isOnAuthPage(): boolean {
    const currentPath = window.location.pathname;
    return ALL_AUTH_PAGES.includes(currentPath as any);
  }

  /**
   * Trigger logout
   */
  static logout(reason: string): void {
    // Prevent multiple simultaneous logout calls
    if (this.isLoggingOut) {
      console.warn('⚠️ Logout already in progress, skipping...');
      return;
    }

    // Check if we're already on an auth page
    if (this.isOnAuthPage()) {
      console.warn('⚠️ Already on auth page, skipping logout to prevent loop');
      return;
    }

    this.isLoggingOut = true;
    console.warn(`🚪 Logging out user: ${reason}`);

    // Cancel all pending requests
    RequestManager.cancelAllRequests();

    // Notify all registered callbacks
    this.callbacks.forEach(callback => {
      try {
        callback(reason);
      } catch (error) {
        console.error('Error in logout callback:', error);
      }
    });

    // Reset flag after callbacks complete
    setTimeout(() => {
      this.isLoggingOut = false;
    }, 1000);
  }

  /**
   * Check if logout is in progress
   */
  static isInProgress(): boolean {
    return this.isLoggingOut;
  }

  /**
   * Clear all callbacks (useful for testing)
   */
  static clearCallbacks(): void {
    this.callbacks = [];
  }
}
