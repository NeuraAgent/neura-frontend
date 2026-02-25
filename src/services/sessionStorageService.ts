/**
 * Session Storage Service with TTL support
 * Manages authentication data in sessionStorage with expiration
 */

import { env } from '@/utils/env';

interface StorageItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SessionStorageService {
  private readonly SESSION_TTL: number;

  constructor() {
    // Get TTL from environment variable (default: 30 days)
    this.SESSION_TTL = parseInt(env.VITE_SESSION_TTL, 10);
  }

  /**
   * Set item in sessionStorage with TTL
   */
  setItem<T>(key: string, value: T, customTTL?: number): void {
    try {
      const ttl = customTTL || this.SESSION_TTL;
      const item: StorageItem<T> = {
        data: value,
        timestamp: Date.now(),
        ttl,
      };

      sessionStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Failed to set sessionStorage item:', error);
    }
  }

  /**
   * Get item from sessionStorage with TTL check
   */
  getItem<T>(key: string): T | null {
    try {
      const itemStr = sessionStorage.getItem(key);
      if (!itemStr) {
        return null;
      }

      const item: StorageItem<T> = JSON.parse(itemStr);
      const now = Date.now();

      // Check if item has expired
      if (now - item.timestamp > item.ttl) {
        this.removeItem(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('Failed to get sessionStorage item:', error);
      this.removeItem(key);
      return null;
    }
  }

  /**
   * Remove item from sessionStorage
   */
  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove sessionStorage item:', error);
    }
  }

  /**
   * Clear all items from sessionStorage
   */
  clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error);
    }
  }

  /**
   * Check if item exists and is not expired
   */
  hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }

  /**
   * Get remaining TTL for an item in milliseconds
   */
  getRemainingTTL(key: string): number {
    try {
      const itemStr = sessionStorage.getItem(key);
      if (!itemStr) {
        return 0;
      }

      const item: StorageItem<any> = JSON.parse(itemStr);
      const now = Date.now();
      const elapsed = now - item.timestamp;
      const remaining = item.ttl - elapsed;

      return Math.max(0, remaining);
    } catch (error) {
      console.error('Failed to get remaining TTL:', error);
      return 0;
    }
  }

  /**
   * Check if item will expire within specified time (in milliseconds)
   */
  willExpireSoon(key: string, threshold: number = 300000): boolean {
    // Default: 5 minutes
    const remaining = this.getRemainingTTL(key);
    return remaining > 0 && remaining <= threshold;
  }

  /**
   * Extend TTL for an existing item
   */
  extendTTL(key: string, additionalTime?: number): boolean {
    try {
      const itemStr = sessionStorage.getItem(key);
      if (!itemStr) {
        return false;
      }

      const item: StorageItem<any> = JSON.parse(itemStr);
      const extension = additionalTime || this.SESSION_TTL;

      // Reset timestamp and extend TTL
      item.timestamp = Date.now();
      item.ttl = extension;

      sessionStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Failed to extend TTL:', error);
      return false;
    }
  }

  /**
   * Get all keys that match a pattern
   */
  getKeys(pattern?: RegExp): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (!pattern || pattern.test(key))) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error('Failed to get keys:', error);
      return [];
    }
  }

  /**
   * Clean up expired items
   */
  cleanup(): number {
    try {
      const keys = this.getKeys();
      let cleanedCount = 0;

      keys.forEach(key => {
        if (!this.hasItem(key)) {
          cleanedCount++;
        }
      });

      return cleanedCount;
    } catch (error) {
      console.error('Failed to cleanup expired items:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const sessionStorageService = new SessionStorageService();
export default sessionStorageService;
