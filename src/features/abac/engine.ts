import type {
  EnterpriseDocument,
  EnterpriseUser,
  AccessDecision,
  ABACRule,
} from './types';
import { CLEARANCE_LEVELS, SENSITIVITY_LEVELS } from './types';

/**
 * ABAC (Attribute-Based Access Control) Engine
 *
 * Evaluates access decisions based on:
 * 1. User attributes (department, role, clearance, region)
 * 2. Document attributes (department, sensitivity, region)
 * 3. Policy rules
 */

// Default ABAC Rules
export const defaultABACRules: ABACRule[] = [
  {
    id: 'rule-001',
    name: 'Clearance Level Check',
    description: 'User clearance must meet or exceed document sensitivity',
    priority: 1,
    effect: 'deny',
    conditions: [],
    isActive: true,
  },
  {
    id: 'rule-002',
    name: 'Department Access',
    description: 'Users can access documents from their own department',
    priority: 2,
    effect: 'allow',
    conditions: [
      {
        userAttribute: 'department',
        operator: 'equals',
        documentAttribute: 'department',
      },
    ],
    isActive: true,
  },
  {
    id: 'rule-003',
    name: 'Manager Cross-Department Access',
    description: 'Managers can access documents from departments they manage',
    priority: 3,
    effect: 'allow',
    conditions: [
      {
        userAttribute: 'role',
        operator: 'in',
        value: ['manager', 'director', 'admin'],
      },
      {
        userAttribute: 'managedDepartments',
        operator: 'contains',
        documentAttribute: 'department',
      },
    ],
    isActive: true,
  },
  {
    id: 'rule-004',
    name: 'Public Document Access',
    description: 'All users can access public documents',
    priority: 4,
    effect: 'allow',
    conditions: [],
    isActive: true,
  },
  {
    id: 'rule-005',
    name: 'Region Restriction',
    description: 'Regional documents require matching region or GLOBAL access',
    priority: 5,
    effect: 'allow',
    conditions: [],
    isActive: true,
  },
];

/**
 * Check if user clearance level meets document sensitivity
 */
function checkClearance(
  user: EnterpriseUser,
  document: EnterpriseDocument
): boolean {
  const userClearanceLevel = CLEARANCE_LEVELS[user.attributes.clearance];
  const docSensitivityLevel =
    SENSITIVITY_LEVELS[document.attributes.sensitivity];
  return userClearanceLevel >= docSensitivityLevel;
}

/**
 * Check if user department matches document department
 */
function checkDepartmentMatch(
  user: EnterpriseUser,
  document: EnterpriseDocument
): boolean {
  return user.attributes.department === document.attributes.department;
}

/**
 * Check if user manages the document's department
 */
function checkManagedDepartment(
  user: EnterpriseUser,
  document: EnterpriseDocument
): boolean {
  const managedDepts = user.attributes.managedDepartments || [];
  return managedDepts.includes(document.attributes.department);
}

/**
 * Check if user region matches or document is global
 */
function checkRegionAccess(
  user: EnterpriseUser,
  document: EnterpriseDocument
): boolean {
  const docRegion = document.attributes.region;
  const userRegion = user.attributes.region;

  // Global documents are accessible to all regions
  if (docRegion === 'GLOBAL') return true;

  // User must be in the same region
  return userRegion === docRegion;
}

/**
 * Check if user has access to the project
 */
function checkProjectAccess(
  user: EnterpriseUser,
  document: EnterpriseDocument
): boolean {
  const docProject = document.attributes.project;

  // If no project restriction, allow
  if (!docProject) return true;

  const allowedProjects = user.attributes.allowedProjects || [];

  // Directors and admins have access to all projects
  if (user.attributes.role === 'director' || user.attributes.role === 'admin') {
    return true;
  }

  return allowedProjects.includes(docProject);
}

/**
 * Main ABAC evaluation function
 * Evaluates whether a user can access a document based on ABAC policies
 */
export function evaluateAccess(
  user: EnterpriseUser,
  document: EnterpriseDocument,
  _action: 'view' | 'download' | 'edit' | 'delete' | 'share' = 'view'
): AccessDecision {
  const timestamp = new Date().toISOString();
  const reasons: string[] = [];

  // Rule 1: Check clearance level (fundamental requirement)
  if (!checkClearance(user, document)) {
    reasons.push(
      `Insufficient clearance level. User has '${user.attributes.clearance}' clearance, but document requires '${document.attributes.sensitivity}' or higher.`
    );
    return {
      allowed: false,
      reason: reasons.join(' '),
      reasons,
      matchedRule: defaultABACRules[0],
      evaluatedAt: timestamp,
    };
  }

  // Rule 2: Public documents are accessible to everyone
  if (document.attributes.sensitivity === 'public') {
    return {
      allowed: true,
      reason: 'Document is public and accessible to all authenticated users.',
      matchedRule: defaultABACRules[3],
      evaluatedAt: timestamp,
    };
  }

  // Rule 3: Check region access
  if (!checkRegionAccess(user, document)) {
    return {
      allowed: false,
      reason: `Regional access denied. Document is restricted to '${document.attributes.region}' region, but user is in '${user.attributes.region}' region.`,
      matchedRule: defaultABACRules[4],
      evaluatedAt: timestamp,
    };
  }

  // Rule 4: Check project access
  if (!checkProjectAccess(user, document)) {
    return {
      allowed: false,
      reason: `Project access denied. User is not assigned to project '${document.attributes.project}'.`,
      evaluatedAt: timestamp,
    };
  }

  // Rule 5: Same department access
  if (checkDepartmentMatch(user, document)) {
    return {
      allowed: true,
      reason: `Access granted. User belongs to the same department ('${user.attributes.department}') as the document.`,
      matchedRule: defaultABACRules[1],
      evaluatedAt: timestamp,
    };
  }

  // Rule 6: Managed department access (for managers/directors)
  if (checkManagedDepartment(user, document)) {
    return {
      allowed: true,
      reason: `Access granted. User manages the '${document.attributes.department}' department.`,
      matchedRule: defaultABACRules[2],
      evaluatedAt: timestamp,
    };
  }

  // Rule 7: Admin/Director override for internal documents
  if (
    (user.attributes.role === 'admin' || user.attributes.role === 'director') &&
    document.attributes.sensitivity !== 'restricted'
  ) {
    return {
      allowed: true,
      reason: `Access granted. User has '${user.attributes.role}' role with elevated privileges.`,
      evaluatedAt: timestamp,
    };
  }

  // Default deny
  return {
    allowed: false,
    reason: `Access denied. User department ('${user.attributes.department}') does not match document department ('${document.attributes.department}') and no override rules apply.`,
    evaluatedAt: timestamp,
  };
}

/**
 * Filter documents based on user access
 */
export function filterAccessibleDocuments(
  user: EnterpriseUser,
  documents: EnterpriseDocument[]
): EnterpriseDocument[] {
  return documents.filter(doc => evaluateAccess(user, doc).allowed);
}

/**
 * Get access summary for a list of documents
 */
export function getAccessSummary(
  user: EnterpriseUser,
  documents: EnterpriseDocument[]
): {
  accessible: number;
  denied: number;
  byDepartment: Record<string, number>;
  bySensitivity: Record<string, number>;
} {
  const accessible = documents.filter(doc => evaluateAccess(user, doc).allowed);
  const denied = documents.length - accessible.length;

  const byDepartment: Record<string, number> = {};
  const bySensitivity: Record<string, number> = {};

  accessible.forEach(doc => {
    byDepartment[doc.attributes.department] =
      (byDepartment[doc.attributes.department] || 0) + 1;
    bySensitivity[doc.attributes.sensitivity] =
      (bySensitivity[doc.attributes.sensitivity] || 0) + 1;
  });

  return {
    accessible: accessible.length,
    denied,
    byDepartment,
    bySensitivity,
  };
}
