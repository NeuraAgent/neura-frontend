/**
 * useLogout Hook
 * Centralized logout logic for the entire application
 * Handles: localStorage, sessionStorage, cookies, Zustand stores, API call, and navigation
 */

import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { AUTH_ROUTES, STORAGE_KEYS } from '@/constants/routes';
import { authService } from '@/services/authService';
import { useUserStore } from '@/stores/userStore';

export const useLogout = () => {
  const navigate = useNavigate();
  const { clearUser } = useUserStore();
  const isLoggingOutRef = useRef(false);

  const logout = useCallback(
    async (reason?: string, redirectPath?: string) => {
      // Prevent multiple simultaneous logout calls
      if (isLoggingOutRef.current) {
        console.warn('⚠️ Logout already in progress, skipping...');
        return;
      }

      isLoggingOutRef.current = true;

      if (reason) {
        console.warn(`🚪 Logging out user: ${reason}`);
      }

      try {
        // 1. Call backend logout endpoint to blacklist token and clear HTTP-only cookies
        try {
          await authService.logout();
          console.log(
            '✅ Backend logout successful - token blacklisted, cookies cleared'
          );
        } catch (error) {
          console.error('❌ Backend logout failed:', error);
          // Continue with client-side cleanup even if backend fails
        }

        // 2. Clear Zustand store (this updates React state immediately)
        clearUser();

        // 3. Clear all localStorage using constants
        const keysToRemove = [
          STORAGE_KEYS.USER_STORAGE,
          STORAGE_KEYS.AUTH_TOKEN,
          STORAGE_KEYS.REFRESH_TOKEN,
          STORAGE_KEYS.ACCESS_TOKEN,
          STORAGE_KEYS.REFRESH_TOKEN_ALT,
          STORAGE_KEYS.USER_DATA,
          STORAGE_KEYS.SESSION_ID,
        ];

        keysToRemove.forEach(key => {
          try {
            localStorage.removeItem(key);
          } catch (error) {
            console.error(`Error removing ${key}:`, error);
          }
        });

        // 4. Clear all sessionStorage except redirect path
        const redirectPathToStore = sessionStorage.getItem(
          STORAGE_KEYS.REDIRECT_AFTER_LOGIN
        );
        try {
          sessionStorage.clear();
        } catch (error) {
          console.error('Error clearing sessionStorage:', error);
        }

        // 5. Clear user data from store (userStore handles persistence)
        clearUser();

        // 6. Store redirect path if provided and valid
        const currentPath = window.location.pathname;
        const pathToStore = redirectPath || redirectPathToStore || currentPath;

        if (
          pathToStore.startsWith('/neura') &&
          pathToStore !== AUTH_ROUTES.LOGIN &&
          pathToStore !== AUTH_ROUTES.SIGNUP
        ) {
          try {
            sessionStorage.setItem(
              STORAGE_KEYS.REDIRECT_AFTER_LOGIN,
              pathToStore
            );
          } catch (error) {
            console.error('Error storing redirect path:', error);
          }
        }

        // 7. Navigate to login using constants (using React Router, not window.location)
        navigate(AUTH_ROUTES.LOGIN, { replace: true });
      } catch (error) {
        console.error('Error during logout:', error);
      } finally {
        // Reset flag after a delay to allow navigation to complete
        setTimeout(() => {
          isLoggingOutRef.current = false;
        }, 1000);
      }
    },
    [navigate, clearUser]
  );

  return { logout };
};
