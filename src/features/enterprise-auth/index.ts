// Enterprise Authentication Module
// Separate from main Neura auth system

// Auth Context & Provider
export { EnterpriseAuthProvider, useEnterpriseAuth } from './EnterpriseAuthContext';
export { enterpriseAuthService } from './enterpriseAuthService';

// ABAC (Attribute-Based Access Control) Integration
export { ABACProvider, useABAC } from './ABACContext';
export {
  toABACUser,
  checkPermission,
  getAccessibleResources,
  getRolePermissions,
  createABACContext,
} from './abacAdapter';

// Components
export { default as EnterpriseLoginForm } from './components/EnterpriseLoginForm';
export { default as EnterpriseProtectedRoute } from './components/EnterpriseProtectedRoute';

// Routes
export { default as EnterpriseRoutes } from './EnterpriseRoutes';

// Types
export type {
  EnterpriseUser,
  EnterpriseRole,
  EnterpriseLoginRequest,
  EnterpriseLoginResponse,
  EnterpriseAuthState,
  EnterpriseAuthContextValue,
} from './types';

export type {
  ABACUser,
  ResourceType,
  ActionType,
  ABACPolicy,
} from './abacAdapter';
