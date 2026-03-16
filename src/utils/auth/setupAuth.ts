/**
 * Setup Auth
 * Initialize authentication system
 * Call this once in your app entry point (main.tsx or App.tsx)
 */

/**
 * Initialize authentication system
 * Note: Authentication is now handled by apiClient with HTTP-only cookies
 * This function is kept for backward compatibility but does nothing
 */
export const setupAuth = (): void => {
  console.log('🔐 Authentication system ready (using HTTP-only cookies)');
};

/**
 * Cleanup authentication system
 */
export const teardownAuth = (): void => {
  console.log('🔓 Authentication system cleanup (no-op)');
};
