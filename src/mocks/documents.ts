import type { EnterpriseDocument } from '@/features/abac/types';

export const mockDocuments: EnterpriseDocument[] = [
  // Engineering Department Documents
  {
    id: 'doc-001',
    title: 'System Architecture Overview',
    description:
      'High-level architecture documentation for the Neura AI platform',
    content:
      'This document outlines the microservices architecture, data flow, and integration patterns used in the Neura AI platform...',
    fileType: 'pdf',
    fileSize: 2456000,
    attributes: {
      department: 'engineering',
      sensitivity: 'internal',
      region: 'GLOBAL',
      tags: ['architecture', 'technical', 'system-design'],
      project: 'project-alpha',
      createdBy: 'user-001',
    },
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-03-20T14:30:00Z',
    version: 3,
    isArchived: false,
  },
  {
    id: 'doc-002',
    title: 'API Security Guidelines',
    description: 'Security best practices and guidelines for API development',
    content:
      'This document covers authentication protocols, rate limiting, data encryption, and security audit procedures...',
    fileType: 'md',
    fileSize: 156000,
    attributes: {
      department: 'engineering',
      sensitivity: 'confidential',
      region: 'GLOBAL',
      tags: ['security', 'api', 'guidelines'],
      project: 'project-alpha',
      createdBy: 'user-001',
    },
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-03-15T11:00:00Z',
    version: 2,
    isArchived: false,
  },
  {
    id: 'doc-003',
    title: 'Infrastructure Credentials',
    description: 'Access credentials and secrets management documentation',
    content:
      'Contains sensitive infrastructure access information and credential rotation procedures...',
    fileType: 'pdf',
    fileSize: 89000,
    attributes: {
      department: 'engineering',
      sensitivity: 'restricted',
      region: 'JP',
      tags: ['credentials', 'infrastructure', 'secrets'],
      project: 'project-alpha',
      createdBy: 'user-003',
    },
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    version: 5,
    isArchived: false,
  },
  // Marketing Department Documents
  {
    id: 'doc-004',
    title: 'Q1 2026 Marketing Campaign',
    description: 'Marketing strategy and campaign materials for Q1 2026',
    content:
      'Comprehensive marketing plan including social media strategy, content calendar, and budget allocation...',
    fileType: 'pptx',
    fileSize: 5670000,
    attributes: {
      department: 'marketing',
      sensitivity: 'internal',
      region: 'GLOBAL',
      tags: ['marketing', 'campaign', 'strategy'],
      project: 'project-gamma',
      createdBy: 'user-002',
    },
    createdAt: '2026-01-05T12:00:00Z',
    updatedAt: '2026-03-25T16:00:00Z',
    version: 4,
    isArchived: false,
  },
  {
    id: 'doc-005',
    title: 'Brand Guidelines 2026',
    description: 'Official brand guidelines and assets',
    content:
      'Logo usage, color palettes, typography, and brand voice guidelines...',
    fileType: 'pdf',
    fileSize: 12340000,
    attributes: {
      department: 'marketing',
      sensitivity: 'public',
      region: 'GLOBAL',
      tags: ['brand', 'guidelines', 'design'],
      createdBy: 'user-002',
    },
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
    version: 1,
    isArchived: false,
  },
  // HR Department Documents
  {
    id: 'doc-006',
    title: 'Employee Handbook 2026',
    description: 'Company policies, benefits, and employee guidelines',
    content:
      'Complete employee handbook covering workplace policies, benefits programs, and HR procedures...',
    fileType: 'pdf',
    fileSize: 3450000,
    attributes: {
      department: 'hr',
      sensitivity: 'internal',
      region: 'GLOBAL',
      tags: ['hr', 'policies', 'handbook'],
      createdBy: 'user-004',
    },
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-02-28T15:00:00Z',
    version: 2,
    isArchived: false,
  },
  {
    id: 'doc-007',
    title: 'Salary Structure Japan',
    description: 'Salary bands and compensation structure for Japan region',
    content:
      'Detailed salary bands, bonus structures, and equity compensation guidelines for Japan employees...',
    fileType: 'xlsx',
    fileSize: 234000,
    attributes: {
      department: 'hr',
      sensitivity: 'restricted',
      region: 'JP',
      tags: ['salary', 'compensation', 'japan'],
      createdBy: 'user-004',
    },
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
    version: 1,
    isArchived: false,
  },
  // Finance Department Documents
  {
    id: 'doc-008',
    title: 'Q4 2025 Financial Report',
    description: 'Quarterly financial statements and analysis',
    content:
      'Revenue, expenses, profit margins, and financial projections for Q4 2025...',
    fileType: 'xlsx',
    fileSize: 1890000,
    attributes: {
      department: 'finance',
      sensitivity: 'confidential',
      region: 'GLOBAL',
      tags: ['finance', 'quarterly', 'report'],
      project: 'project-delta',
      createdBy: 'user-005',
    },
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-02-05T14:00:00Z',
    version: 1,
    isArchived: false,
  },
  {
    id: 'doc-009',
    title: 'Budget Planning 2026',
    description: 'Annual budget allocation and planning document',
    content:
      'Department budgets, capital expenditure plans, and resource allocation for 2026...',
    fileType: 'xlsx',
    fileSize: 456000,
    attributes: {
      department: 'finance',
      sensitivity: 'confidential',
      region: 'GLOBAL',
      tags: ['budget', 'planning', 'annual'],
      project: 'project-delta',
      createdBy: 'user-005',
    },
    createdAt: '2025-12-15T09:00:00Z',
    updatedAt: '2026-03-10T11:00:00Z',
    version: 3,
    isArchived: false,
  },
  // Executive Documents
  {
    id: 'doc-010',
    title: 'Board Meeting Minutes - March 2026',
    description: 'Minutes from the monthly board meeting',
    content:
      'Discussion topics, decisions made, and action items from the March 2026 board meeting...',
    fileType: 'docx',
    fileSize: 178000,
    attributes: {
      department: 'executive',
      sensitivity: 'restricted',
      region: 'GLOBAL',
      tags: ['board', 'meeting', 'executive'],
      createdBy: 'user-003',
    },
    createdAt: '2026-03-15T18:00:00Z',
    updatedAt: '2026-03-16T10:00:00Z',
    version: 1,
    isArchived: false,
  },
  // Sales Department Documents
  {
    id: 'doc-011',
    title: 'Enterprise Client List',
    description: 'Active enterprise clients and contract details',
    content:
      'List of enterprise clients, contract values, renewal dates, and account managers...',
    fileType: 'xlsx',
    fileSize: 567000,
    attributes: {
      department: 'sales',
      sensitivity: 'confidential',
      region: 'GLOBAL',
      tags: ['sales', 'clients', 'enterprise'],
      createdBy: 'user-003',
    },
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-03-28T16:00:00Z',
    version: 8,
    isArchived: false,
  },
  {
    id: 'doc-012',
    title: 'Product Pricing Guide',
    description: 'Standard pricing tiers and discount structures',
    content:
      'Pricing models, volume discounts, and enterprise pricing guidelines...',
    fileType: 'pdf',
    fileSize: 234000,
    attributes: {
      department: 'sales',
      sensitivity: 'internal',
      region: 'GLOBAL',
      tags: ['pricing', 'sales', 'guide'],
    },
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-03-01T14:00:00Z',
    version: 2,
    isArchived: false,
  },
];

// Get document by ID
export function getMockDocumentById(
  id: string
): EnterpriseDocument | undefined {
  return mockDocuments.find(doc => doc.id === id);
}

// Get documents by department
export function getMockDocumentsByDepartment(
  department: string
): EnterpriseDocument[] {
  return mockDocuments.filter(doc => doc.attributes.department === department);
}

// Get documents by sensitivity level
export function getMockDocumentsBySensitivity(
  sensitivity: string
): EnterpriseDocument[] {
  return mockDocuments.filter(
    doc => doc.attributes.sensitivity === sensitivity
  );
}
