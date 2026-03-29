// Enterprise Auth Service - Mock API (Simulates external backend)
// This service is separate from the main Neura auth service

import type {
  EnterpriseUser,
  EnterpriseLoginRequest,
  EnterpriseLoginResponse,
  EnterpriseRole,
} from './types';

// Mock users for enterprise application - matches ABAC users
const MOCK_ENTERPRISE_USERS: Array<
  EnterpriseUser & { password: string }
> = [
  {
    id: 'ent-001',
    email: 'admin@enterprise.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    department: 'IT',
    permissions: ['read', 'write', 'delete', 'admin', 'manage_users', 'view_analytics'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ent-002',
    email: 'manager@enterprise.com',
    password: 'manager123',
    firstName: 'Manager',
    lastName: 'User',
    role: 'manager',
    department: 'Operations',
    permissions: ['read', 'write', 'view_analytics', 'manage_team'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ent-003',
    email: 'analyst@enterprise.com',
    password: 'analyst123',
    firstName: 'Analyst',
    lastName: 'User',
    role: 'analyst',
    department: 'Data',
    permissions: ['read', 'view_analytics', 'export_data'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ent-004',
    email: 'viewer@enterprise.com',
    password: 'viewer123',
    firstName: 'Viewer',
    lastName: 'User',
    role: 'viewer',
    department: 'Sales',
    permissions: ['read'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Token generation (mock JWT-like)
const generateMockToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })
  );
  const signature = btoa(`mock-signature-${userId}`);
  return `${header}.${payload}.${signature}`;
};

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'enterprise_access_token',
  USER: 'enterprise_user',
} as const;

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class EnterpriseAuthService {
  /**
   * POST /auth/login - Authenticate user
   */
  async login(credentials: EnterpriseLoginRequest): Promise<EnterpriseLoginResponse> {
    await delay(500); // Simulate network latency

    const { email, password } = credentials;

    const user = MOCK_ENTERPRISE_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        message: 'Account is deactivated. Please contact administrator.',
      };
    }

    // Generate token
    const accessToken = generateMockToken(user.id);

    // Create user object without password
    const { password: _, ...userWithoutPassword } = user;
    const enterpriseUser: EnterpriseUser = {
      ...userWithoutPassword,
      lastLoginAt: new Date().toISOString(),
    };

    // Persist to localStorage
    localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(enterpriseUser));

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: enterpriseUser,
        accessToken,
        expiresIn: 24 * 60 * 60, // 24 hours in seconds
      },
    };
  }

  /**
   * GET /auth/me - Get current user from token
   */
  async getCurrentUser(token: string): Promise<EnterpriseUser | null> {
    await delay(200); // Simulate network latency

    if (!token) return null;

    try {
      // Parse mock token to get user ID
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));

      // Check if token is expired
      if (payload.exp < Date.now()) {
        this.clearSession();
        return null;
      }

      const user = MOCK_ENTERPRISE_USERS.find((u) => u.id === payload.sub);
      if (!user) return null;

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch {
      return null;
    }
  }

  /**
   * POST /auth/logout - Clear session
   */
  async logout(): Promise<void> {
    await delay(200); // Simulate network latency
    this.clearSession();
  }

  /**
   * Restore session from localStorage
   */
  async restoreSession(): Promise<{ user: EnterpriseUser | null; token: string | null }> {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);

    if (!token || !userStr) {
      return { user: null, token: null };
    }

    // Validate token is still valid
    const user = await this.getCurrentUser(token);

    if (!user) {
      this.clearSession();
      return { user: null, token: null };
    }

    return { user, token };
  }

  /**
   * Clear all session data
   */
  private clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  /**
   * Get role permissions mapping for ABAC
   */
  getRolePermissions(role: EnterpriseRole): string[] {
    const rolePermissions: Record<EnterpriseRole, string[]> = {
      admin: ['read', 'write', 'delete', 'admin', 'manage_users', 'view_analytics'],
      manager: ['read', 'write', 'view_analytics', 'manage_team'],
      analyst: ['read', 'view_analytics', 'export_data'],
      viewer: ['read'],
    };
    return rolePermissions[role] || [];
  }
}

// Export singleton instance
export const enterpriseAuthService = new EnterpriseAuthService();
export default enterpriseAuthService;
