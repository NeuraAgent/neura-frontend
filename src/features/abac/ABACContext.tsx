import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';

import { useEnterpriseAuth } from '@/features/auth';
import { mockDocuments } from '@/mocks/documents';
import { mockUsers, defaultMockUser } from '@/mocks/users';

import {
  evaluateAccess,
  filterAccessibleDocuments,
  getAccessSummary,
} from './engine';
import type {
  EnterpriseUser,
  EnterpriseDocument,
  AccessDecision,
  AccessLog,
} from './types';

interface ABACContextValue {
  // Current user
  currentUser: EnterpriseUser;
  setCurrentUser: (user: EnterpriseUser) => void;
  availableUsers: EnterpriseUser[];

  // Documents
  allDocuments: EnterpriseDocument[];
  accessibleDocuments: EnterpriseDocument[];

  // Access control
  checkAccess: (
    document: EnterpriseDocument,
    action?: 'view' | 'download' | 'edit' | 'delete' | 'share'
  ) => AccessDecision;

  // Access logs
  accessLogs: AccessLog[];
  logAccess: (
    documentId: string,
    action: 'view' | 'download' | 'edit' | 'delete' | 'share',
    decision: AccessDecision
  ) => void;

  // Statistics
  accessSummary: {
    accessible: number;
    denied: number;
    byDepartment: Record<string, number>;
    bySensitivity: Record<string, number>;
  };
}

const ABACContext = createContext<ABACContextValue | null>(null);

export function ABACProvider({ children }: { children: ReactNode }) {
  // Get authenticated user from Enterprise Auth
  const { user: authenticatedUser, isAuthenticated } = useEnterpriseAuth();

  // Use authenticated user if available, otherwise fall back to defaultMockUser for demo
  const [currentUser, setCurrentUser] = useState<EnterpriseUser>(
    authenticatedUser || defaultMockUser
  );
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);

  // Sync ABAC user with authenticated user when auth state changes
  useEffect(() => {
    if (isAuthenticated && authenticatedUser) {
      setCurrentUser(authenticatedUser);
    }
  }, [isAuthenticated, authenticatedUser]);

  // All available documents
  const allDocuments = useMemo(() => mockDocuments, []);

  // Filter documents based on current user's access
  const accessibleDocuments = useMemo(
    () => filterAccessibleDocuments(currentUser, allDocuments),
    [currentUser, allDocuments]
  );

  // Access summary statistics
  const accessSummary = useMemo(
    () => getAccessSummary(currentUser, allDocuments),
    [currentUser, allDocuments]
  );

  // Check access for a specific document
  const checkAccess = useCallback(
    (
      document: EnterpriseDocument,
      action: 'view' | 'download' | 'edit' | 'delete' | 'share' = 'view'
    ) => {
      return evaluateAccess(currentUser, document, action);
    },
    [currentUser]
  );

  // Log access attempts
  const logAccess = useCallback(
    (
      documentId: string,
      action: 'view' | 'download' | 'edit' | 'delete' | 'share',
      decision: AccessDecision
    ) => {
      const newLog: AccessLog = {
        id: `log-${Date.now()}`,
        userId: currentUser.id,
        documentId,
        action,
        decision,
        timestamp: new Date().toISOString(),
      };
      setAccessLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
    },
    [currentUser.id]
  );

  const value = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      availableUsers: mockUsers,
      allDocuments,
      accessibleDocuments,
      checkAccess,
      accessLogs,
      logAccess,
      accessSummary,
    }),
    [
      currentUser,
      allDocuments,
      accessibleDocuments,
      checkAccess,
      accessLogs,
      logAccess,
      accessSummary,
    ]
  );

  return <ABACContext.Provider value={value}>{children}</ABACContext.Provider>;
}

export function useABAC() {
  const context = useContext(ABACContext);
  if (!context) {
    throw new Error('useABAC must be used within an ABACProvider');
  }
  return context;
}
