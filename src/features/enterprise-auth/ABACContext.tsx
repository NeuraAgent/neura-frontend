import React, { createContext, useContext, useMemo, type ReactNode } from 'react';

import { useEnterpriseAuth } from './EnterpriseAuthContext';
import {
  createABACContext,
  type ABACUser,
  type ResourceType,
  type ActionType,
} from './abacAdapter';

/**
 * ABAC Context Value Interface
 */
interface ABACContextValue {
  /**
   * Current user in ABAC format
   */
  user: ABACUser | null;

  /**
   * Check if user can perform action on resource
   */
  can: (resource: ResourceType, action: ActionType) => boolean;

  /**
   * List of resources user can access
   */
  accessibleResources: ResourceType[];

  /**
   * Quick check for admin role
   */
  isAdmin: boolean;

  /**
   * Quick check for manager or higher role
   */
  isManager: boolean;

  /**
   * Check if user has specific permission
   */
  hasPermission: (permission: string) => boolean;
}

const ABACContext = createContext<ABACContextValue | undefined>(undefined);

/**
 * Hook to access ABAC context
 */
export const useABAC = (): ABACContextValue => {
  const context = useContext(ABACContext);
  if (context === undefined) {
    throw new Error('useABAC must be used within an ABACProvider');
  }
  return context;
};

interface ABACProviderProps {
  children: ReactNode;
}

/**
 * ABAC Provider - Integrates with Enterprise Auth
 *
 * Usage:
 * ```tsx
 * <EnterpriseAuthProvider>
 *   <ABACProvider>
 *     <App />
 *   </ABACProvider>
 * </EnterpriseAuthProvider>
 * ```
 *
 * Then in components:
 * ```tsx
 * const { can, isAdmin, hasPermission } = useABAC();
 *
 * if (can('analytics', 'read')) {
 *   // Show analytics
 * }
 * ```
 */
export const ABACProvider: React.FC<ABACProviderProps> = ({ children }) => {
  const { user: enterpriseUser } = useEnterpriseAuth();

  // Create ABAC context from enterprise user
  // Memoized to prevent unnecessary re-renders
  const abacValue = useMemo(
    () => createABACContext(enterpriseUser),
    [enterpriseUser]
  );

  return (
    <ABACContext.Provider value={abacValue}>{children}</ABACContext.Provider>
  );
};

export default ABACContext;
