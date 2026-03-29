/**
 * ABAC Adapter - Bridges Enterprise Auth with ABAC System
 *
 * This module provides utilities to integrate the enterprise authentication
 * system with the Attribute-Based Access Control (ABAC) system.
 *
 * Flow:
 * 1. User logs in via Enterprise Auth
 * 2. User data is injected into ABAC system
 * 3. ABAC system uses user attributes for access control decisions
 */

import type { EnterpriseUser, EnterpriseRole } from './types';

/**
 * ABAC User attributes interface
 * Maps enterprise user to ABAC-compatible format
 */
export interface ABACUser {
  id: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
  attributes: {
    firstName: string;
    lastName: string;
    isActive: boolean;
    lastLoginAt?: string;
  };
}

/**
 * Resource types that can be protected by ABAC
 */
export type ResourceType =
  | 'dashboard'
  | 'analytics'
  | 'users'
  | 'settings'
  | 'reports'
  | 'data';

/**
 * Action types for ABAC decisions
 */
export type ActionType = 'read' | 'write' | 'delete' | 'admin' | 'export';

/**
 * ABAC Policy definition
 */
export interface ABACPolicy {
  resource: ResourceType;
  action: ActionType;
  condition: (user: ABACUser) => boolean;
}

/**
 * Default ABAC policies based on roles
 */
const DEFAULT_POLICIES: ABACPolicy[] = [
  // Admin can do everything
  {
    resource: 'dashboard',
    action: 'admin',
    condition: (user) => user.role === 'admin',
  },
  {
    resource: 'users',
    action: 'admin',
    condition: (user) => user.role === 'admin',
  },
  {
    resource: 'settings',
    action: 'admin',
    condition: (user) => user.role === 'admin',
  },

  // Manager permissions
  {
    resource: 'dashboard',
    action: 'read',
    condition: (user) => ['admin', 'manager', 'analyst', 'viewer'].includes(user.role),
  },
  {
    resource: 'dashboard',
    action: 'write',
    condition: (user) => ['admin', 'manager'].includes(user.role),
  },
  {
    resource: 'analytics',
    action: 'read',
    condition: (user) =>
      user.permissions.includes('view_analytics') || user.role === 'admin',
  },
  {
    resource: 'reports',
    action: 'read',
    condition: (user) =>
      user.permissions.includes('view_analytics') || user.role === 'admin',
  },
  {
    resource: 'reports',
    action: 'export',
    condition: (user) =>
      user.permissions.includes('export_data') || user.role === 'admin',
  },

  // Data access
  {
    resource: 'data',
    action: 'read',
    condition: (user) => user.permissions.includes('read'),
  },
  {
    resource: 'data',
    action: 'write',
    condition: (user) => user.permissions.includes('write'),
  },
  {
    resource: 'data',
    action: 'delete',
    condition: (user) => user.permissions.includes('delete'),
  },
];

/**
 * Convert Enterprise User to ABAC User format
 */
export function toABACUser(enterpriseUser: EnterpriseUser): ABACUser {
  return {
    id: enterpriseUser.id,
    email: enterpriseUser.email,
    role: enterpriseUser.role,
    department: enterpriseUser.department,
    permissions: enterpriseUser.permissions,
    attributes: {
      firstName: enterpriseUser.firstName,
      lastName: enterpriseUser.lastName,
      isActive: enterpriseUser.isActive,
      lastLoginAt: enterpriseUser.lastLoginAt,
    },
  };
}

/**
 * Check if user has permission to perform action on resource
 */
export function checkPermission(
  user: ABACUser | null,
  resource: ResourceType,
  action: ActionType,
  customPolicies?: ABACPolicy[]
): boolean {
  if (!user) return false;
  if (!user.attributes.isActive) return false;

  const policies = customPolicies || DEFAULT_POLICIES;

  // Find matching policy
  const matchingPolicy = policies.find(
    (policy) => policy.resource === resource && policy.action === action
  );

  // If no specific policy exists, check general permissions
  if (!matchingPolicy) {
    // Admin has implicit access to everything
    if (user.role === 'admin') return true;

    // Check if user has the action as a permission
    return user.permissions.includes(action);
  }

  return matchingPolicy.condition(user);
}

/**
 * Get all accessible resources for a user
 */
export function getAccessibleResources(
  user: ABACUser | null,
  customPolicies?: ABACPolicy[]
): ResourceType[] {
  if (!user) return [];

  const resources: ResourceType[] = [
    'dashboard',
    'analytics',
    'users',
    'settings',
    'reports',
    'data',
  ];

  return resources.filter((resource) =>
    checkPermission(user, resource, 'read', customPolicies)
  );
}

/**
 * Get role-based default permissions
 */
export function getRolePermissions(role: EnterpriseRole): string[] {
  const rolePermissions: Record<EnterpriseRole, string[]> = {
    admin: ['read', 'write', 'delete', 'admin', 'manage_users', 'view_analytics', 'export_data'],
    manager: ['read', 'write', 'view_analytics', 'manage_team'],
    analyst: ['read', 'view_analytics', 'export_data'],
    viewer: ['read'],
  };

  return rolePermissions[role] || [];
}

/**
 * Create ABAC context value for use in React context
 */
export function createABACContext(enterpriseUser: EnterpriseUser | null) {
  const abacUser = enterpriseUser ? toABACUser(enterpriseUser) : null;

  return {
    user: abacUser,
    can: (resource: ResourceType, action: ActionType) =>
      checkPermission(abacUser, resource, action),
    accessibleResources: getAccessibleResources(abacUser),
    isAdmin: abacUser?.role === 'admin',
    isManager: abacUser?.role === 'manager' || abacUser?.role === 'admin',
    hasPermission: (permission: string) =>
      abacUser?.permissions.includes(permission) || false,
  };
}
