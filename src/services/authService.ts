import { type AxiosResponse } from 'axios';

import { BASE_URLS, GATEWAY_API_ENDPOINTS } from '@/constants/apiEndpoints';
import type {
  LoginResponse,
  ForgotPasswordResponse,
  SignUpRequest,
  SignUpResponse,
  User,
} from '@/types';
import { createApiClient } from '@/utils/apiClient';

import { cookieService } from './cookieService';

// Token storage keys
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Create axios instance with frontend authentication
const api = createApiClient(BASE_URLS.API_GATEWAY);

class AuthService {
  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await api.post(
        GATEWAY_API_ENDPOINTS.AUTH_LOGIN,
        {
          email,
          password,
        }
      );

      const { data } = response;

      if (data.success && data.data) {
        // Store tokens in localStorage
        if (data.data.token) {
          localStorage.setItem(TOKEN_KEY, data.data.token);
        }
        if (data.data.refresh_token) {
          localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refresh_token);
        }

        // Store user display data in cookie for UI purposes
        cookieService.setUserDisplayData(data.data.user);
      }

      return data;
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.response?.data) {
        return error.response.data as LoginResponse;
      }

      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      await api.post(GATEWAY_API_ENDPOINTS.AUTH_LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens from localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);

      // Clear user display data
      cookieService.removeUserDisplayData();
    }
  }

  /**
   * Send forgot password request
   */
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    try {
      const response: AxiosResponse<ForgotPasswordResponse> = await api.post(
        GATEWAY_API_ENDPOINTS.AUTH_FORGOT_PASSWORD,
        {
          email,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Forgot password error:', error);

      if (error.response?.data) {
        return error.response.data as ForgotPasswordResponse;
      }

      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ForgotPasswordResponse> {
    try {
      const response: AxiosResponse<ForgotPasswordResponse> = await api.post(
        GATEWAY_API_ENDPOINTS.AUTH_RESET_PASSWORD,
        {
          token,
          newPassword,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Reset password error:', error);

      if (error.response?.data) {
        return error.response.data as ForgotPasswordResponse;
      }

      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  /**
   * Sign up new user
   */
  async signUp(signUpData: SignUpRequest): Promise<SignUpResponse> {
    try {
      const response: AxiosResponse<SignUpResponse> = await api.post(
        GATEWAY_API_ENDPOINTS.AUTH_SIGNUP,
        signUpData
      );

      const { data } = response;

      // Don't store user data during signup - user must verify email first
      // User data will be stored after successful login

      return data;
    } catch (error: any) {
      console.error('Sign up error:', error);

      if (error.response?.data) {
        return error.response.data as SignUpResponse;
      }

      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  /**
   * Get current user from cookie display data
   */
  getCurrentUser(): User | null {
    try {
      return cookieService.getUserDisplayData();
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated based on display data
   * Note: Actual authentication is handled by HTTP-only cookies
   */
  getToken(): string | null {
    // HTTP-only cookies cannot be accessed via JavaScript
    // Return null but authentication is handled automatically by cookies
    return null;
  }

  /**
   * Check if user is authenticated based on display data
   * Note: Actual authentication is handled by HTTP-only cookies
   */
  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return !!user; // Check if we have user display data
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const response: AxiosResponse<LoginResponse> = await api.post(
        GATEWAY_API_ENDPOINTS.AUTH_REFRESH
      );

      const { data } = response;

      if (data.success && data.data) {
        // Update user display data - cookies are updated automatically by server
        cookieService.setUserDisplayData(data.data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  /**
   * Check if user appears to be authenticated
   * Note: With HTTP-only cookies, we can't check token expiry from client side
   */
  shouldRefreshToken(): boolean {
    // Server handles token validation and refresh automatically
    return false;
  }

  /**
   * Auto refresh token if needed
   * Note: With HTTP-only cookies, this is handled automatically by the server
   */
  async autoRefreshToken(): Promise<boolean> {
    // HTTP-only cookies handle refresh automatically
    return true;
  }

  /**
   * Update user's preferred language
   */
  async updateLanguage(
    language: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<{
        success: boolean;
        message: string;
        data?: { user: User };
      }> = await api.put(GATEWAY_API_ENDPOINTS.AUTH_UPDATE_LANGUAGE, {
        language,
      });

      const { data } = response;

      if (data.success && data.data) {
        // Update user display data with new language preference
        cookieService.setUserDisplayData(data.data.user);
      }

      return {
        success: data.success,
        message: data.message,
      };
    } catch (error: any) {
      console.error('Update language error:', error);

      if (error.response?.data) {
        return error.response.data;
      }

      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }
  /**
   * Update user's intro completion status
   */
  async updateIntroStatus(
    hasCompletedIntro: boolean
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<{
        success: boolean;
        message: string;
        data?: { user: User };
      }> = await api.put(GATEWAY_API_ENDPOINTS.AUTH_UPDATE_INTRO_STATUS, {
        hasCompletedIntro,
      });

      const { data } = response;

      if (data.success && data.data) {
        // Update user display data with new intro status
        cookieService.setUserDisplayData(data.data.user);
      }

      return {
        success: data.success,
        message: data.message,
      };
    } catch (error: any) {
      console.error('Update intro status error:', error);

      if (error.response?.data) {
        return error.response.data;
      }

      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
