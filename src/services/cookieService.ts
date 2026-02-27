/**
 * Cookie Service for handling HTTP-only cookies
 * Since HTTP-only cookies cannot be accessed via JavaScript,
 * we need to work with the server to manage authentication
 */

class CookieService {
  /**
   * Check if cookies are available (basic check)
   */
  areCookiesEnabled(): boolean {
    try {
      // Try to set a test cookie
      document.cookie = 'test=1; path=/';
      const enabled = document.cookie.indexOf('test=1') !== -1;
      // Clean up test cookie
      document.cookie = 'test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      return enabled;
    } catch {
      return false;
    }
  }

  /**
   * Get a non-HTTP-only cookie value
   * Note: This cannot access HTTP-only cookies (auth_token, refresh_token)
   */
  getCookie(name: string): string | null {
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue || null;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Set a non-HTTP-only cookie
   * Note: This is for non-sensitive data only
   */
  setCookie(name: string, value: string, days: number = 365): void {
    try {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
    } catch {
      // Silent fail for cookie operations
    }
  }

  /**
   * Remove a non-HTTP-only cookie
   */
  removeCookie(name: string): void {
    try {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    } catch {
      // Silent fail for cookie operations
    }
  }

  /**
   * Clear all non-HTTP-only cookies
   */
  clearAllCookies(): void {
    try {
      const cookies = document.cookie.split(';');
      cookies.forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name =
          eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        if (name) {
          this.removeCookie(name);
        }
      });
    } catch {
      // Silent fail for cookie operations
    }
  }

  /**
   * Store user data in a non-HTTP-only cookie for UI purposes
   * Note: This should only contain non-sensitive display data
   */
  setUserDisplayData(user: any): void {
    try {
      const displayData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        hasCompletedIntro: user.hasCompletedIntro,
        preferredLanguage: user.preferredLanguage,
        picture: user.picture,
      };
      this.setCookie('user_display', JSON.stringify(displayData));
    } catch {
      // Silent fail for cookie operations
    }
  }

  /**
   * Get user display data from cookie
   */
  getUserDisplayData(): any | null {
    try {
      const data = this.getCookie('user_display');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Remove user display data
   */
  removeUserDisplayData(): void {
    this.removeCookie('user_display');
  }

  /**
   * Check if user appears to be logged in based on display data
   * Note: This is just for UI purposes, actual auth is handled by HTTP-only cookies
   */
  hasUserDisplayData(): boolean {
    return this.getUserDisplayData() !== null;
  }
}

// Export singleton instance
export const cookieService = new CookieService();
export default cookieService;
