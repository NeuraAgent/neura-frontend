import { authService } from '@/services/authService';
import { oidcService } from '@/services/oidcService';
import type {
  LoginResponse,
  ForgotPasswordResponse,
  SignUpRequest,
  SignUpResponse,
  User,
} from '@/types';

import type { OAuthUser } from './types';
import { UserMapper } from './userMapper';

export class AuthActions {
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await authService.login(email, password);
      return response;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {
        success: false,
        message: 'An unexpected error occurred during login.',
      };
    }
  }

  static async logout(): Promise<void> {
    try {
      const oauthUser = await oidcService.getUser();
      if (oauthUser) {
        await oidcService.signoutRedirect();
      } else {
        await authService.logout();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      /* empty */
    }
  }

  static async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    try {
      return await authService.forgotPassword(email);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  static async signUp(signUpData: SignUpRequest): Promise<SignUpResponse> {
    try {
      return await authService.signUp(signUpData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {
        success: false,
        message: 'An unexpected error occurred during sign up.',
      };
    }
  }

  static async setOAuthUser(oauthUser: OAuthUser): Promise<User> {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = UserMapper.fromOAuth(oauthUser, null, null);
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async isOAuthAuthenticated(): Promise<boolean> {
    try {
      return await oidcService.isAuthenticated();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }
}
