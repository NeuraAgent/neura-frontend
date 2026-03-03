import type {
  LoginResponse,
  ForgotPasswordResponse,
  SignUpRequest,
  SignUpResponse,
  User,
} from '@/types';

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<ForgotPasswordResponse>;
  signUp: (signUpData: SignUpRequest) => Promise<SignUpResponse>;
  setOAuthUser: (oauthUser: unknown) => Promise<void>;
  isOAuthAuthenticated: () => Promise<boolean>;
}

export interface OAuthProfile {
  sub?: string;
  id?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email_verified?: boolean;
  isEmailVerified?: boolean;
  roles?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  provider?: string;
  providerId?: string;
  picture?: string;
  hasCompletedIntro?: boolean;
  preferredLanguage?: string;
}

export interface OAuthUser {
  profile: OAuthProfile;
  access_token: string;
  expired?: boolean;
}
