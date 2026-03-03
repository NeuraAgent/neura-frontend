/**
 * Cookie Manager
 * Handles cookie operations
 * Single Responsibility: Cookie operations only
 */

import { AUTH_COOKIE_NAMES } from './constants';

export class CookieManager {
  /**
   * Delete a specific cookie
   */
  static deleteCookie(name: string): void {
    // Delete for current path
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

    // Delete for root path
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;

    // Delete without domain (for localhost)
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  /**
   * Clear all authentication cookies
   */
  static clearAuthCookies(): void {
    Object.values(AUTH_COOKIE_NAMES).forEach(cookieName => {
      this.deleteCookie(cookieName);
    });
  }

  /**
   * Clear all cookies
   */
  static clearAllCookies(): void {
    const cookies = document.cookie.split(';');

    cookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      this.deleteCookie(cookieName);
    });
  }

  /**
   * Get cookie value by name
   */
  static getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  }

  /**
   * Set cookie
   */
  static setCookie(name: string, value: string, days?: number): void {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
  }

  /**
   * Check if auth cookies exist
   */
  static hasAuthCookies(): boolean {
    return (
      this.getCookie(AUTH_COOKIE_NAMES.ACCESS_TOKEN) !== null ||
      this.getCookie(AUTH_COOKIE_NAMES.REFRESH_TOKEN) !== null
    );
  }
}
