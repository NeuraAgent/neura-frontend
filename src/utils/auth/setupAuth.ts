/**
 * Setup Auth
 * Initialize authentication system
 * Call this once in your app entry point (main.tsx or App.tsx)
 */

import axios from 'axios';

import { AxiosInterceptor } from './axiosInterceptor';

/**
 * Initialize authentication system
 */
export const setupAuth = (): void => {
  console.log('🔐 Initializing authentication system...');

  // Setup axios interceptors
  AxiosInterceptor.setup(axios);

  console.log('✅ Authentication system initialized');
};

/**
 * Cleanup authentication system
 */
export const teardownAuth = (): void => {
  console.log('🔓 Cleaning up authentication system...');

  // Remove axios interceptors
  AxiosInterceptor.teardown(axios);

  console.log('✅ Authentication system cleaned up');
};
