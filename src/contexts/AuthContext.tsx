import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { authService } from '@/services/authService';
import { oidcService } from '@/services/oidcService';
import { useUserStore } from '@/stores/userStore';
import {
  AuthContextType,
  LoginResponse,
  ForgotPasswordResponse,
  SignUpRequest,
  SignUpResponse,
  User,
} from '@/types';

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading, setUser, setLoading, clearUser } =
    useUserStore();
  const [token, setToken] = useState<string | null>(null);

  // Initialize auth state from cookies and OAuth
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get the current persisted user from zustand (before we overwrite it)
        const persistedUser = useUserStore.getState().user;

        // First check OAuth authentication
        const oauthUser = await oidcService.getUser();
        if (oauthUser && !oauthUser.expired) {
          // Get stored user data from cookie (which has hasCompletedIntro from backend)
          const storedUser = authService.getCurrentUser();

          // Convert OAuth user to our User type, preserving stored data
          // Prioritize persisted zustand hasCompletedIntro for session continuity
          const newUser: User = {
            id:
              storedUser?.id ||
              oauthUser.profile.sub ||
              oauthUser.profile.email ||
              '',
            firstName:
              storedUser?.firstName || oauthUser.profile.given_name || '',
            lastName:
              storedUser?.lastName || oauthUser.profile.family_name || '',
            email: storedUser?.email || oauthUser.profile.email || '',
            phoneNumber: storedUser?.phoneNumber || '',
            isEmailVerified:
              storedUser?.isEmailVerified ??
              oauthUser.profile.email_verified ??
              false,
            roles: storedUser?.roles || ['user'],
            isActive: storedUser?.isActive ?? true,
            createdAt: storedUser?.createdAt || new Date().toISOString(),
            updatedAt: storedUser?.updatedAt || new Date().toISOString(),
            provider: storedUser?.provider || 'google',
            providerId: storedUser?.providerId || oauthUser.profile.sub,
            picture: storedUser?.picture || oauthUser.profile.picture,
            // Preserve session hasCompletedIntro from zustand, fallback to stored/default
            hasCompletedIntro:
              persistedUser?.hasCompletedIntro ??
              storedUser?.hasCompletedIntro ??
              false,
            preferredLanguage: storedUser?.preferredLanguage || 'vi',
          };
          setUser(newUser);
          setToken(oauthUser.access_token);
          return;
        }

        // Fallback to traditional auth
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          // Preserve session hasCompletedIntro from zustand
          const mergedUser: User = {
            ...storedUser,
            hasCompletedIntro:
              persistedUser?.hasCompletedIntro ??
              storedUser?.hasCompletedIntro ??
              false,
          };
          setUser(mergedUser);
          setToken('authenticated');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid auth data
        await authService.logout();
        await oidcService.removeUser();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    setLoading(true);

    try {
      const response = await authService.login(email, password);

      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.token);
      }

      return response;
    } catch (error) {
      console.error('Login error in context:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during login.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setLoading(true);

    try {
      // Check if user is OAuth authenticated
      const oauthUser = await oidcService.getUser();
      if (oauthUser) {
        await oidcService.signoutRedirect();
      } else {
        await authService.logout();
      }
    } catch (error) {
      console.error('Logout error in context:', error);
    } finally {
      clearUser();
      setToken(null);
      setLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (
    email: string
  ): Promise<ForgotPasswordResponse> => {
    try {
      return await authService.forgotPassword(email);
    } catch (error) {
      console.error('Forgot password error in context:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      };
    }
  };

  // Sign up function
  const signUp = async (signUpData: SignUpRequest): Promise<SignUpResponse> => {
    setLoading(true);

    try {
      const response = await authService.signUp(signUpData);

      // Don't set user or token during signup - user must verify email first
      // User will be authenticated after successful login, not signup

      return response;
    } catch (error) {
      console.error('Sign up error in context:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during sign up.',
      };
    } finally {
      setLoading(false);
    }
  };

  // OAuth set user function
  const setOAuthUser = async (oauthUser: any): Promise<void> => {
    try {
      const user: User = {
        id:
          oauthUser.profile.id ||
          oauthUser.profile.sub ||
          oauthUser.profile.email,
        firstName:
          oauthUser.profile.firstName || oauthUser.profile.given_name || '',
        lastName:
          oauthUser.profile.lastName || oauthUser.profile.family_name || '',
        email: oauthUser.profile.email || '',
        phoneNumber: oauthUser.profile.phoneNumber || '',
        isEmailVerified:
          oauthUser.profile.isEmailVerified ??
          oauthUser.profile.email_verified ??
          false,
        roles: oauthUser.profile.roles || ['user'],
        isActive: oauthUser.profile.isActive ?? true,
        createdAt: oauthUser.profile.createdAt || new Date().toISOString(),
        updatedAt: oauthUser.profile.updatedAt || new Date().toISOString(),
        provider: oauthUser.profile.provider || 'google',
        providerId: oauthUser.profile.providerId || oauthUser.profile.sub,
        picture: oauthUser.profile.picture,
        hasCompletedIntro: oauthUser.profile.hasCompletedIntro ?? false,
        preferredLanguage: oauthUser.profile.preferredLanguage || 'vi',
      };

      setUser(user);
      setToken(oauthUser.access_token);
    } catch (error) {
      console.error('Error setting OAuth user:', error);
      throw error;
    }
  };

  // Check OAuth authentication
  const isOAuthAuthenticated = async (): Promise<boolean> => {
    try {
      return await oidcService.isAuthenticated();
    } catch (error) {
      console.error('Error checking OAuth authentication:', error);
      return false;
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    forgotPassword,
    signUp,
    setOAuthUser,
    isOAuthAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
