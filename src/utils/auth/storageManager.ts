/**
 * Storage Manager
 * Handles localStorage and sessionStorage operations
 * Single Responsibility: Storage operations only
 */

import { AUTH_STORAGE_KEYS } from './constants';

export class StorageManager {
  /**
   * Clear all authentication-related data from localStorage
   */
  static clearAuthStorage(): void {
    Object.values(AUTH_STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  /**
   * Clear all localStorage data
   */
  static clearAllLocalStorage(): void {
    localStorage.clear();
  }

  /**
   * Clear all sessionStorage data
   */
  static clearAllSessionStorage(): void {
    sessionStorage.clear();
  }

  /**
   * Clear all storage (localStorage + sessionStorage)
   */
  static clearAllStorage(): void {
    this.clearAllLocalStorage();
    this.clearAllSessionStorage();
  }

  /**
   * Get item from localStorage
   */
  static getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   */
  static setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  /**
   * Remove specific item from localStorage
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * Check if user has valid token in storage
   */
  static hasValidToken(): boolean {
    const token = this.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    return !!token && token.length > 0;
  }
}
