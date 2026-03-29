import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

import { enterpriseAuthService } from './enterpriseAuthService';
import type {
  EnterpriseUser,
  EnterpriseAuthContextValue,
  EnterpriseLoginResponse,
} from './types';

const EnterpriseAuthContext = createContext<EnterpriseAuthContextValue | undefined>(
  undefined
);

/**
 * Hook to access enterprise auth context
 */
export const useEnterpriseAuth = (): EnterpriseAuthContextValue => {
  const context = useContext(EnterpriseAuthContext);
  if (context === undefined) {
    throw new Error('useEnterpriseAuth must be used within an EnterpriseAuthProvider');
  }
  return context;
};

interface EnterpriseAuthProviderProps {
  children: ReactNode;
}

/**
 * Enterprise Auth Provider - Separate from main Neura auth
 * Handles authentication state for enterprise application routes
 */
export const EnterpriseAuthProvider: React.FC<EnterpriseAuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<EnterpriseUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { user: restoredUser, token } =
          await enterpriseAuthService.restoreSession();

        if (restoredUser && token) {
          setUser(restoredUser);
          setAccessToken(token);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to restore enterprise auth session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login with email and password
   */
  const login = useCallback(
    async (email: string, password: string): Promise<EnterpriseLoginResponse> => {
      setIsLoading(true);

      try {
        const response = await enterpriseAuthService.login({ email, password });

        if (response.success && response.data) {
          setUser(response.data.user);
          setAccessToken(response.data.accessToken);
          setIsAuthenticated(true);
        }

        return response;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Logout and clear session
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      await enterpriseAuthService.logout();
    } finally {
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  /**
   * Get current user from token
   */
  const getCurrentUser = useCallback(async (): Promise<EnterpriseUser | null> => {
    if (!accessToken) return null;
    return enterpriseAuthService.getCurrentUser(accessToken);
  }, [accessToken]);

  const value: EnterpriseAuthContextValue = {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getCurrentUser,
  };

  return (
    <EnterpriseAuthContext.Provider value={value}>
      {children}
    </EnterpriseAuthContext.Provider>
  );
};

export default EnterpriseAuthContext;
