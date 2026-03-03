import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

import { useUserStore } from '@/stores/userStore';
import type {
  LoginResponse,
  ForgotPasswordResponse,
  SignUpRequest,
  SignUpResponse,
} from '@/types';

import { AuthActions } from './authActions';
import { AuthInitializer } from './authInitializer';
import type { AuthContextValue, OAuthUser } from './types';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading, setUser, setLoading, clearUser } =
    useUserStore();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const { user, token } = await AuthInitializer.initialize();
      if (user) {
        setUser(user);
        setToken(token);
      }
      setLoading(false);
    };

    initializeAuth();
  }, [setUser, setLoading]);

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResponse> => {
      setLoading(true);
      try {
        const response = await AuthActions.login(email, password);
        if (response.success && response.data) {
          setUser(response.data.user);
          setToken(response.data.token);
        }
        return response;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading]
  );

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await AuthActions.logout();
    } finally {
      clearUser();
      setToken(null);
      setLoading(false);
    }
  }, [clearUser, setLoading]);

  const forgotPassword = useCallback(
    async (email: string): Promise<ForgotPasswordResponse> => {
      return AuthActions.forgotPassword(email);
    },
    []
  );

  const signUp = useCallback(
    async (signUpData: SignUpRequest): Promise<SignUpResponse> => {
      setLoading(true);
      try {
        return await AuthActions.signUp(signUpData);
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const setOAuthUser = useCallback(
    async (oauthUser: unknown): Promise<void> => {
      const user = await AuthActions.setOAuthUser(oauthUser as OAuthUser);
      setUser(user);
      setToken((oauthUser as OAuthUser).access_token);
    },
    [setUser]
  );

  const isOAuthAuthenticated = useCallback(async (): Promise<boolean> => {
    return AuthActions.isOAuthAuthenticated();
  }, []);

  const value: AuthContextValue = {
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
