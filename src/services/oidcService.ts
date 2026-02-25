import {
  UserManager,
  WebStorageStateStore,
  User as OidcUser,
} from 'oidc-client-ts';

// OIDC Configuration
const oidcConfig = {
  authority: 'https://accounts.google.com',
  client_id:
    '569152827464-fn8vs4tgdks28oclh3a3hr2vj4739mr3.apps.googleusercontent.com',
  client_secret: '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',
  redirect_uri: `${window.location.origin}/auth/callback`,
  post_logout_redirect_uri: `${window.location.origin}/login`,
  response_type: 'code',
  scope: 'openid profile email',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
  silent_redirect_uri: `${window.location.origin}/auth/silent-callback`,
  includeIdTokenInSilentRenew: true,
  loadUserInfo: true,
  metadata: {
    issuer: 'https://accounts.google.com',
    authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    token_endpoint: 'https://oauth2.googleapis.com/token',
    userinfo_endpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
    jwks_uri: 'https://www.googleapis.com/oauth2/v3/certs',
    end_session_endpoint: 'https://accounts.google.com/logout',
  },
};

// Create UserManager instance
export const userManager = new UserManager(oidcConfig);

// OIDC Service class
export class OidcService {
  private userManager: UserManager;

  constructor() {
    this.userManager = userManager;
    this.setupEventHandlers();
  }

  /**
   * Setup event handlers for OIDC events
   */
  private setupEventHandlers(): void {
    // User loaded event
    this.userManager.events.addUserLoaded(() => {
      // User loaded
    });

    // User unloaded event
    this.userManager.events.addUserUnloaded(() => {
      // User unloaded
    });

    // Access token expiring event
    this.userManager.events.addAccessTokenExpiring(() => {
      // Access token expiring
    });

    // Access token expired event
    this.userManager.events.addAccessTokenExpired(() => {
      this.signoutRedirect();
    });

    // Silent renew error event
    this.userManager.events.addSilentRenewError(error => {
      console.error('Silent renew error:', error);
    });

    // User signed out event
    this.userManager.events.addUserSignedOut(() => {
      // User signed out
    });
  }

  /**
   * Initiate login redirect to Google OAuth
   */
  async signinRedirect(): Promise<void> {
    try {
      await this.userManager.signinRedirect();
    } catch (error) {
      console.error('Error during signin redirect:', error);
      throw error;
    }
  }

  /**
   * Handle callback after OAuth redirect
   */
  async signinRedirectCallback(): Promise<OidcUser> {
    try {
      const user = await this.userManager.signinRedirectCallback();
      return user;
    } catch (error) {
      console.error('Error during signin callback:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  async getUser(): Promise<OidcUser | null> {
    try {
      return await this.userManager.getUser();
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getUser();
      return user !== null && !user.expired;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Initiate logout redirect
   */
  async signoutRedirect(): Promise<void> {
    try {
      await this.userManager.signoutRedirect();
    } catch (error) {
      console.error('Error during signout redirect:', error);
      throw error;
    }
  }

  /**
   * Handle silent callback for token renewal
   */
  async signinSilentCallback(): Promise<void> {
    try {
      await this.userManager.signinSilentCallback();
    } catch (error) {
      console.error('Error during silent signin callback:', error);
      throw error;
    }
  }

  /**
   * Remove user from storage
   */
  async removeUser(): Promise<void> {
    try {
      await this.userManager.removeUser();
    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      const user = await this.getUser();
      return user?.access_token || null;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(): Promise<any> {
    try {
      const user = await this.getUser();
      return user?.profile || null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
}

// Export singleton instance
export const oidcService = new OidcService();
