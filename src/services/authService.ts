import { type AxiosResponse } from 'axios';

import { BASE_URLS, GATEWAY_API_ENDPOINTS } from '@/constants/apiEndpoints';
import type {
  LoginResponse,
  ForgotPasswordResponse,
  SignUpRequest,
  SignUpResponse,
  User,
} from '@/types';
import { createApiClient, DEV_TOKEN_STORAGE } from '@/utils/apiClient';
import { handleNetworkError, logError } from '@/utils/errorHandler';
import { env } from '@/utils/env';

const api = createApiClient(BASE_URLS.API_GATEWAY);

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await api.post(
        GATEWAY_API_ENDPOINTS.AUTH_LOGIN,
        { email, password },
        { withCredentials: true }
      );

      const { data } = response;

      // In DEV mode, store tokens in localStorage for Authorization header
      if (env.NODE_ENV === 'development' && data.success && data.data) {
        console.log(
          '🔓 [DEV] Login successful, storing tokens in localStorage'
        );
        console.log('🔓 [DEV] Response data:', {
          hasAccessToken: !!data.data.accessToken,
          hasToken: !!data.data.token,
          hasRefreshToken: !!data.data.refreshToken,
          hasRefresh_token: !!data.data.refresh_token,
        });
        const accessToken = data.data.accessToken || data.data.token;
        const refreshToken = data.data.refreshToken || data.data.refresh_token;
        if (accessToken && refreshToken) {
          console.log('🔓 [DEV] Storing tokens:', {
            accessTokenLength: accessToken.length,
            refreshTokenLength: refreshToken.length,
          });
          DEV_TOKEN_STORAGE.setTokens(accessToken, refreshToken);
        } else {
          console.error('❌ [DEV] Tokens not found in response:', data.data);
        }
      }

      // User data will be set by the component using userStore
      // Tokens are in HTTP-only cookies - frontend never touches them

      return data;
    } catch (error: unknown) {
      logError('Login', error);

      if ((error as any).response?.data) {
        return (error as any).response.data as LoginResponse;
      }

      return handleNetworkError() as LoginResponse;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(
        GATEWAY_API_ENDPOINTS.AUTH_LOGOUT,
        {},
        { withCredentials: true }
      );

      // Clear dev tokens
      DEV_TOKEN_STORAGE.clearTokens();
    } catch (error) {
      logError('Logout', error);
      // Clear dev tokens even on error
      DEV_TOKEN_STORAGE.clearTokens();
    }
    // User data will be cleared by the component using userStore
    // Cookies are cleared by the backend
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    try {
      const response: AxiosResponse<ForgotPasswordResponse> = await api.post(
        GATEWAY_API_ENDPOINTS.AUTH_FORGOT_PASSWORD,
        { email }
      );

      return response.data;
    } catch (error: unknown) {
      logError('Forgot Password', error);

      if ((error as any).response?.data) {
        return (error as any).response.data as ForgotPasswordResponse;
      }

      return handleNetworkError() as ForgotPasswordResponse;
    }
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ForgotPasswordResponse> {
    try {
      const response: AxiosResponse<ForgotPasswordResponse> = await api.post(
        GATEWAY_API_ENDPOINTS.AUTH_RESET_PASSWORD,
        { token, newPassword }
      );

      return response.data;
    } catch (error: unknown) {
      logError('Reset Password', error);

      if ((error as any).response?.data) {
        return (error as any).response.data as ForgotPasswordResponse;
      }

      return handleNetworkError() as ForgotPasswordResponse;
    }
  }

  async signUp(signUpData: SignUpRequest): Promise<SignUpResponse> {
    try {
      const response: AxiosResponse<SignUpResponse> = await api.post(
        GATEWAY_API_ENDPOINTS.AUTH_SIGNUP,
        signUpData
      );

      return response.data;
    } catch (error: unknown) {
      logError('Sign Up', error);

      if ((error as any).response?.data) {
        return (error as any).response.data as SignUpResponse;
      }

      return handleNetworkError() as SignUpResponse;
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response: AxiosResponse<LoginResponse> = await api.post(
        GATEWAY_API_ENDPOINTS.AUTH_REFRESH,
        {},
        { withCredentials: true }
      );

      const { data } = response;

      if (data.success && data.data) {
        // In DEV mode, update tokens in localStorage
        if (env.NODE_ENV === 'development') {
          const accessToken = data.data.accessToken || data.data.token;
          const refreshToken =
            data.data.refreshToken || data.data.refresh_token;
          if (accessToken && refreshToken) {
            DEV_TOKEN_STORAGE.setTokens(accessToken, refreshToken);
          }
        }

        // User data will be updated by the component using userStore
        return true;
      }

      return false;
    } catch (error) {
      logError('Token Refresh', error);
      // Clear dev tokens on refresh failure
      DEV_TOKEN_STORAGE.clearTokens();
      return false;
    }
  }

  async updateLanguage(
    language: string
  ): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const response: AxiosResponse<{
        success: boolean;
        message: string;
        data?: { user: User };
      }> = await api.put(GATEWAY_API_ENDPOINTS.AUTH_UPDATE_LANGUAGE, {
        language,
      });

      const { data } = response;

      return {
        success: data.success,
        message: data.message,
        user: data.data?.user,
      };
    } catch (error: unknown) {
      logError('Update Language', error);

      if ((error as any).response?.data) {
        return (error as any).response.data;
      }

      return handleNetworkError();
    }
  }

  async updateIntroStatus(
    hasCompletedIntro: boolean
  ): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const response: AxiosResponse<{
        success: boolean;
        message: string;
        data?: { user: User };
      }> = await api.put(GATEWAY_API_ENDPOINTS.AUTH_UPDATE_INTRO_STATUS, {
        hasCompletedIntro,
      });

      const { data } = response;

      return {
        success: data.success,
        message: data.message,
        user: data.data?.user,
      };
    } catch (error: unknown) {
      logError('Update Intro Status', error);

      if ((error as any).response?.data) {
        return (error as any).response.data;
      }

      return handleNetworkError();
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
