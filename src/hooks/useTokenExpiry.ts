/**
 * useTokenExpiry Hook
 * React hook for handling token expiry in components
 */

import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AUTH_ROUTES } from '@/utils/auth/constants';
import { SessionManager } from '@/utils/auth/sessionManager';
import { TokenExpiryHandler } from '@/utils/auth/tokenExpiryHandler';

export const useTokenExpiry = () => {
  const navigate = useNavigate();

  /**
   * Handle token expiry with React Router navigation
   */
  const handleExpiry = useCallback(
    (message?: string) => {
      SessionManager.clearSession();

      // Use React Router navigation instead of window.location
      navigate(AUTH_ROUTES.LOGIN, {
        replace: true,
        state: { message: message || 'Session expired. Please login again.' },
      });
    },
    [navigate]
  );

  /**
   * Handle 401 error
   */
  const handle401 = useCallback(() => {
    TokenExpiryHandler.handle401Error();
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    SessionManager.logout();
    navigate(AUTH_ROUTES.LOGIN, { replace: true });
  }, [navigate]);

  /**
   * Check if session is active
   */
  const hasActiveSession = useCallback(() => {
    return SessionManager.hasActiveSession();
  }, []);

  // Setup global error handler
  useEffect(() => {
    const handleUnauthorized = () => {
      handleExpiry();
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [handleExpiry]);

  return {
    handleExpiry,
    handle401,
    logout,
    hasActiveSession,
  };
};
