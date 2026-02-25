export interface ChatMessage {
  message_id: string;
  session_id: string;
  user_id: string;
  user_input: string;
  agent_response?: string;
  processing_time?: number;
  success: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ChatSession {
  session_id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  total_messages: number;
  is_active: boolean;
}

// Authentication Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  isEmailVerified: boolean;
  roles: string[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  // OAuth specific fields
  provider?: 'local' | 'google' | 'oauth';
  providerId?: string;
  picture?: string;
  // Onboarding
  hasCompletedIntro?: boolean;
  preferredLanguage?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    refresh_token?: string;
    expires_in: number;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  acceptTerms: boolean;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    refresh_token?: string;
    expires_in: number;
  };
  error?: string;
  details?: Array<{
    type: string;
    value: string;
    msg: string;
    path: string;
    location: string;
  }>;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<ForgotPasswordResponse>;
  signUp: (signUpData: SignUpRequest) => Promise<SignUpResponse>;
  // OAuth methods
  setOAuthUser: (oauthUser: any) => Promise<void>;
  isOAuthAuthenticated: () => Promise<boolean>;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// VectorDB Document Types
export interface DocumentMetadata {
  file_name: string;
  file_type: string;
  upload_timestamp: string;
  embedding_model: string;
  tags: string;
}

export interface DocumentPayload {
  chunk_id: string; // Format: "chunk-0", "chunk-1", etc.
  chunk_index: number; // Numeric index for sorting: 0, 1, 2, etc.
  file_id: string; // UUID string for filtering by file
  user_id: string;
  text: string;
  content?: any;
  metadata: DocumentMetadata;
  created_at: string;
  last_updated_at: string;
}

export interface VectorDocument {
  id: string;
  text: string;
  payload: DocumentPayload;
}

export interface EmbedAndStoreRequest {
  text: string;
  payload: DocumentPayload;
  id?: string;
}

export interface EmbedAndStoreResponse {
  success: boolean;
  message: string;
  document_id: string;
  embedding_dimension: number;
}

export interface BulkEmbedAndStoreRequest {
  items: EmbedAndStoreRequest[];
}

export interface BulkEmbedAndStoreResponse {
  success: boolean;
  message: string;
  processed_count: number;
  failed_count: number;
  results: EmbedAndStoreResponse[];
}

export interface HybridSearchRequest {
  query_text: string;
  limit?: number;
  score_threshold?: number;
  subject?: string;
  title?: string;
  week?: string;
}

export interface SearchResult {
  id: string;
  score: number;
  payload: DocumentPayload;
}

export interface HybridSearchResponse {
  results: SearchResult[];
  total_found: number;
  search_type: string;
}

export interface DeletePointsRequest {
  point_ids: string[];
}

export interface DeletePointsResponse {
  success: boolean;
  message: string;
  deleted_count: number;
}

// UI Source Types
export interface Source {
  id: string;
  name: string;
  type: 'file' | 'folder';
  checked: boolean;
  subject?: string;
  week?: string;
  chunk_count?: number;
  created_at?: string;
  updated_at?: string;
  file_name?: string;
  upload_date?: string;
  file_type?: string;
  file_size?: number;
  s3Key?: string;
  s3Url?: string;
  metadata?: {
    subject?: string;
    title?: string;
    week?: string;
    tags?: string;
    [key: string]: any;
  };
}
