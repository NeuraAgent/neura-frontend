/**
 * LogoutHandler Component
 * Listens to logout events from API client and handles the logout process
 * This component should be mounted at the app root level
 */

import type { FC } from 'react';
import { useEffect } from 'react';

import { registerLogoutCallback } from '@/utils/apiClient';

import { useLogout } from '../hooks/useLogout';

export const LogoutHandler: FC = () => {
  const { logout } = useLogout();

  useEffect(() => {
    // Register callback with API client
    const unregister = registerLogoutCallback((reason: string) => {
      console.log('📢 Logout event received from API client:', reason);
      logout(reason);
    });

    // Cleanup on unmount
    return () => {
      unregister();
    };
  }, [logout]);

  // This component doesn't render anything
  return null;
};
