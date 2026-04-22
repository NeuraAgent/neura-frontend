import type { EnterpriseUser } from '@/features/abac/types';
import { mockUsers } from '@/mocks/users';

// Mock auth token structure
export interface AuthToken {
  accessToken: string;
  expiresAt: number;
  refreshToken?: string;
}

// Login response
export interface LoginResponse {
  accessToken: string;
  expiresAt: number;
  user: EnterpriseUser;
}

// Auth user from service
export interface AuthUser extends EnterpriseUser {
  token: string;
  tokenExpiresAt: number;
}

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const MOCK_DELAY_MS = 500; // Simulate network delay

// Generate mock JWT-like token
function generateToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + TOKEN_EXPIRY_MS) / 1000),
    })
  );
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

// Decode mock token to extract user ID
function decodeToken(
  token: string
): { userId: string; isExpired: boolean } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < now;

    return {
      userId: payload.sub,
      isExpired,
    };
  } catch {
    return null;
  }
}

/**
 * Enterprise Auth Service
 * Simulates backend authentication API
 */
export const enterpriseAuthService = {
  /**
   * Login with email and password
   * @param email User email
   * @param password User password
   * @returns LoginResponse with token and user info
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));

    // Find user by email (mock validation - no real password check)
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // For demo: accept any password (in real system, validate with bcrypt)
    if (!password || password.length === 0) {
      throw new Error('Password is required');
    }

    const token = generateToken(user.id);
    const expiresAt = Date.now() + TOKEN_EXPIRY_MS;

    return {
      accessToken: token,
      expiresAt,
      user,
    };
  },

  /**
   * Get current user from token
   * @param token Access token
   * @returns User info if valid token
   */
  async getCurrentUser(token: string): Promise<EnterpriseUser | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const decoded = decodeToken(token);

    if (!decoded || decoded.isExpired) {
      return null;
    }

    const user = mockUsers.find(u => u.id === decoded.userId);
    return user || null;
  },

  /**
   * Logout user (clear token)
   */
  async logout(): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    // No-op in mock service
  },

  /**
   * Refresh token (extend expiration)
   * @param token Current access token
   * @returns New token
   */
  async refreshToken(token: string): Promise<string | null> {
    const user = await this.getCurrentUser(token);
    if (!user) return null;

    return generateToken(user.id);
  },

  /**
   * Validate token expiration
   */
  isTokenExpired(token: string): boolean {
    const decoded = decodeToken(token);
    return !decoded || decoded.isExpired;
  },

  /**
   * Get mock users for demo/testing
   */
  getMockUsers(): EnterpriseUser[] {
    return mockUsers;
  },
};

export default enterpriseAuthService;
