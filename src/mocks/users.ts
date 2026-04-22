import type { EnterpriseUser } from '@/features/abac/types';

export const mockUsers: EnterpriseUser[] = [
  {
    id: 'user-001',
    firstName: 'Yuki',
    lastName: 'Tanaka',
    email: 'yuki.tanaka@neura.ai',
    avatar: undefined,
    attributes: {
      department: 'engineering',
      role: 'manager',
      clearance: 'confidential',
      region: 'JP',
      managedDepartments: ['engineering'],
      allowedProjects: ['project-alpha', 'project-beta'],
    },
    isActive: true,
    lastLoginAt: '2026-03-30T09:00:00Z',
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'user-002',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@neura.ai',
    avatar: undefined,
    attributes: {
      department: 'marketing',
      role: 'employee',
      clearance: 'internal',
      region: 'US',
      allowedProjects: ['project-gamma'],
    },
    isActive: true,
    lastLoginAt: '2026-03-29T14:30:00Z',
    createdAt: '2025-03-01T00:00:00Z',
  },
  {
    id: 'user-003',
    firstName: 'Kenji',
    lastName: 'Yamamoto',
    email: 'kenji.yamamoto@neura.ai',
    avatar: undefined,
    attributes: {
      department: 'executive',
      role: 'director',
      clearance: 'restricted',
      region: 'JP',
      managedDepartments: ['engineering', 'marketing', 'sales'],
      allowedProjects: [
        'project-alpha',
        'project-beta',
        'project-gamma',
        'project-delta',
      ],
    },
    isActive: true,
    lastLoginAt: '2026-03-30T08:00:00Z',
    createdAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'user-004',
    firstName: 'Emma',
    lastName: 'Johnson',
    email: 'emma.johnson@neura.ai',
    avatar: undefined,
    attributes: {
      department: 'hr',
      role: 'manager',
      clearance: 'confidential',
      region: 'EU',
      managedDepartments: ['hr'],
      allowedProjects: [],
    },
    isActive: true,
    lastLoginAt: '2026-03-28T11:00:00Z',
    createdAt: '2025-02-01T00:00:00Z',
  },
  {
    id: 'user-005',
    firstName: 'Alex',
    lastName: 'Kim',
    email: 'alex.kim@neura.ai',
    avatar: undefined,
    attributes: {
      department: 'finance',
      role: 'employee',
      clearance: 'confidential',
      region: 'APAC',
      allowedProjects: ['project-delta'],
    },
    isActive: true,
    lastLoginAt: '2026-03-30T07:00:00Z',
    createdAt: '2025-05-15T00:00:00Z',
  },
];

// Default mock user for demo
export const defaultMockUser = mockUsers[0];

// Get user by ID
export function getMockUserById(id: string): EnterpriseUser | undefined {
  return mockUsers.find(user => user.id === id);
}

// Get users by department
export function getMockUsersByDepartment(department: string): EnterpriseUser[] {
  return mockUsers.filter(user => user.attributes.department === department);
}
