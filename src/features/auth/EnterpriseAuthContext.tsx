import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import enterpriseAuthService from './authService';
import type { EnterpriseUser } from '@/features/abac/types';

export interface EnterpriseAuthContextValue {
  // State
  user: EnterpriseUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Methods
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const EnterpriseAuthContext = createContext<EnterpriseAuthContextValue | undefined>(undefined);

const STORAGE_KEY_TOKEN = 'enterprise_auth_token';
const STORAGE_KEY_EXPIRY = 'enterprise_auth_expiry';

export function EnterpriseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<EnterpriseUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session from localStorage on mount
  const restoreSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
      const savedExpiry = localStorage.getItem(STORAGE_KEY_EXPIRY);

      if (!savedToken || !savedExpiry) {
        setIsLoading(false);
        return;
      }

      // Check if token is expired
      if (Date.now() > parseInt(savedExpiry)) {
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_EXPIRY);
        setIsLoading(false);
        return;
      }

      // Validate token and get user
      const currentUser = await enterpriseAuthService.getCurrentUser(savedToken);

      if (currentUser) {
        setAccessToken(savedToken);
        setUser(currentUser);
      } else {
        // Token is invalid, clear storage
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_EXPIRY);
      }

      setError(null);
    } catch (err) {
      console.error('Session restoration failed:', err);
      setError('Failed to restore session');
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_EXPIRY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await enterpriseAuthService.login(email, password);

      setUser(response.user);
      setAccessToken(response.accessToken);

      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY_TOKEN, response.accessToken);
      localStorage.setItem(STORAGE_KEY_EXPIRY, response.expiresAt.toString());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setUser(null);
      setAccessToken(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await enterpriseAuthService.logout();

      // Clear state
      setUser(null);
      setAccessToken(null);
      setError(null);

      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_EXPIRY);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    if (!accessToken) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await enterpriseAuthService.getCurrentUser(accessToken);
      if (!currentUser) {
        setUser(null);
        setAccessToken(null);
      } else {
        setUser(currentUser);
      }
    } catch {
      setUser(null);
      setAccessToken(null);
    }
  }, [accessToken]);

  const value: EnterpriseAuthContextValue = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
  };

  return (
    <EnterpriseAuthContext.Provider value={value}>
      {children}
    </EnterpriseAuthContext.Provider>
  );
}

export function useEnterpriseAuth(): EnterpriseAuthContextValue {
  const context = useContext(EnterpriseAuthContext);
  if (!context) {
    throw new Error('useEnterpriseAuth must be used within EnterpriseAuthProvider');
  }
  return context;
}

export default EnterpriseAuthContext;
