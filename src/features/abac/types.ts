// ABAC (Attribute-Based Access Control) Types

export type Department = 'engineering' | 'marketing' | 'sales' | 'hr' | 'finance' | 'legal' | 'executive';

export type Sensitivity = 'public' | 'internal' | 'confidential' | 'restricted';

export type Region = 'JP' | 'US' | 'EU' | 'APAC' | 'GLOBAL';

export type UserRole = 'employee' | 'manager' | 'director' | 'admin' | 'viewer';

export type Clearance = 'public' | 'internal' | 'confidential' | 'restricted';

// Document attributes for ABAC
export interface DocumentAttributes {
  department: Department;
  sensitivity: Sensitivity;
  region: Region;
  tags?: string[];
  project?: string;
  createdBy?: string;
}

// User attributes for ABAC
export interface UserAttributes {
  department: Department;
  role: UserRole;
  clearance: Clearance;
  region: Region;
  managedDepartments?: Department[];
  allowedProjects?: string[];
}

// Enterprise Document
export interface EnterpriseDocument {
  id: string;
  title: string;
  description: string;
  content: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'txt' | 'md';
  fileSize: number;
  attributes: DocumentAttributes;
  createdAt: string;
  updatedAt: string;
  version: number;
  isArchived: boolean;
}

// Enterprise User
export interface EnterpriseUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  attributes: UserAttributes;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

// ABAC Policy Rule
export interface ABACRule {
  id: string;
  name: string;
  description: string;
  priority: number;
  effect: 'allow' | 'deny';
  conditions: ABACCondition[];
  isActive: boolean;
}

export interface ABACCondition {
  userAttribute: keyof UserAttributes;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'in' | 'notIn';
  documentAttribute?: keyof DocumentAttributes;
  value?: string | string[];
}

// Access Decision
export interface AccessDecision {
  allowed: boolean;
  reason: string;
  reasons?: string[];
  matchedRule?: ABACRule;
  evaluatedAt: string;
}

// Access Log
export interface AccessLog {
  id: string;
  userId: string;
  documentId: string;
  action: 'view' | 'download' | 'edit' | 'delete' | 'share';
  decision: AccessDecision;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

// Sensitivity level hierarchy for comparison
export const SENSITIVITY_LEVELS: Record<Sensitivity, number> = {
  public: 0,
  internal: 1,
  confidential: 2,
  restricted: 3,
};

export const CLEARANCE_LEVELS: Record<Clearance, number> = {
  public: 0,
  internal: 1,
  confidential: 2,
  restricted: 3,
};

// Helper to check if clearance meets sensitivity requirement
export function hasSufficientClearance(clearance: Clearance, sensitivity: Sensitivity): boolean {
  return CLEARANCE_LEVELS[clearance] >= SENSITIVITY_LEVELS[sensitivity];
}

// Department display names
export const DEPARTMENT_LABELS: Record<Department, string> = {
  engineering: 'Engineering',
  marketing: 'Marketing',
  sales: 'Sales',
  hr: 'Human Resources',
  finance: 'Finance',
  legal: 'Legal',
  executive: 'Executive',
};

// Sensitivity display with colors
export const SENSITIVITY_CONFIG: Record<Sensitivity, { label: string; color: string; bgColor: string }> = {
  public: { label: 'Public', color: 'text-emerald-700', bgColor: 'bg-emerald-50' },
  internal: { label: 'Internal', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  confidential: { label: 'Confidential', color: 'text-amber-700', bgColor: 'bg-amber-50' },
  restricted: { label: 'Restricted', color: 'text-red-700', bgColor: 'bg-red-50' },
};

// Region display names
export const REGION_LABELS: Record<Region, string> = {
  JP: 'Japan',
  US: 'United States',
  EU: 'Europe',
  APAC: 'Asia Pacific',
  GLOBAL: 'Global',
};
