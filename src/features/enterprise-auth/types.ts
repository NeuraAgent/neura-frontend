// Enterprise Authentication Types
// Separate from main Neura auth system

export interface EnterpriseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: EnterpriseRole;
  department: string;
  permissions: string[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type EnterpriseRole = 'admin' | 'manager' | 'analyst' | 'viewer';

export interface EnterpriseLoginRequest {
  email: string;
  password: string;
}

export interface EnterpriseLoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: EnterpriseUser;
    accessToken: string;
    expiresIn: number;
  };
}

export interface EnterpriseAuthState {
  user: EnterpriseUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface EnterpriseAuthContextValue extends EnterpriseAuthState {
  login: (email: string, password: string) => Promise<EnterpriseLoginResponse>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<EnterpriseUser | null>;
}
