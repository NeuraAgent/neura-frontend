/**
 * API Types - Shared between frontend and backend
 * Used for request/response validation and TypeScript safety
 */

import type { EnterpriseDocument, EnterpriseUser } from '@/features/abac/types';

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Documents API
export interface CreateDocumentRequest {
  title: string;
  description: string;
  content: string;
  fileType: string;
  fileSize: number;
  department: string;
  sensitivity: string;
  region: string;
  tags?: string[];
  project?: string;
}

export interface ListDocumentsRequest {
  department?: string;
  sensitivity?: string;
  region?: string;
  project?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListDocumentsResponse {
  documents: EnterpriseDocument[];
  total: number;
  limit: number;
  offset: number;
}

// Chat API
export interface ChatRequest {
  query: string;
  documentIds: string[];
  conversationId?: string;
  userId: string;
  maxResults?: number;
}

export interface ChatResponse {
  conversationId: string;
  response: string;
  citations: ChatCitation[];
  generationTime: number;
  tokensUsed: number;
  model: string;
}

export interface ChatCitation {
  documentId: string;
  title: string;
  preview: string;
  relevanceScore: number;
  pageNumber?: number;
  chunkIndex?: number;
}

export interface ChatConversation {
  id: string;
  userId: string;
  title: string;
  documentIds: string[];
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: ChatCitation[];
  createdAt: string;
}

// ABAC API
export interface CheckAccessRequest {
  documentId: string;
  action: 'view' | 'download' | 'edit' | 'delete' | 'share';
}

export interface CheckAccessResponse {
  allowed: boolean;
  reason: string;
  reasons: string[];
  matchedRule?: string;
  evaluatedAt: string;
}

export interface AccessLogEntry {
  id: string;
  userId: string;
  documentId: string;
  action: string;
  allowed: boolean;
  reason: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface ListAccessLogsRequest {
  userId?: string;
  documentId?: string;
  action?: string;
  allowed?: boolean;
  limit?: number;
  offset?: number;
  fromDate?: string;
  toDate?: string;
}

export interface ListAccessLogsResponse {
  logs: AccessLogEntry[];
  total: number;
  limit: number;
  offset: number;
}

// Users API
export interface UpdateUserAttributesRequest {
  department?: string;
  role?: string;
  clearance?: string;
  region?: string;
  managedDepartments?: string[];
  allowedProjects?: string[];
}

export interface UserProfile extends EnterpriseUser {
  lastLoginAt?: string;
  accessibleDocumentCount?: number;
}

// Search API
export interface SemanticSearchRequest {
  query: string;
  documentIds?: string[];
  limit?: number;
  minSimilarity?: number;
}

export interface SemanticSearchResult {
  documentId: string;
  title: string;
  chunkIndex: number;
  content: string;
  similarity: number;
  preview: string;
}

export interface SemanticSearchResponse {
  results: SemanticSearchResult[];
  generationTime: number;
  modelUsed: string;
}

// Batch Operations
export interface BatchCheckAccessRequest {
  documentIds: string[];
  action?: 'view' | 'download' | 'edit' | 'delete' | 'share';
}

export interface BatchCheckAccessResponse {
  results: Record<string, CheckAccessResponse>;
  summary: {
    total: number;
    allowed: number;
    denied: number;
  };
}

// Error Codes
export enum ApiErrorCode {
  // Authentication
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Authorization
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_CLEARANCE = 'INSUFFICIENT_CLEARANCE',
  DEPARTMENT_MISMATCH = 'DEPARTMENT_MISMATCH',
  REGION_RESTRICTED = 'REGION_RESTRICTED',

  // Resource
  NOT_FOUND = 'NOT_FOUND',
  DOCUMENT_NOT_FOUND = 'DOCUMENT_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  CONVERSATION_NOT_FOUND = 'CONVERSATION_NOT_FOUND',

  // Validation
  INVALID_REQUEST = 'INVALID_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_ATTRIBUTE = 'INVALID_ATTRIBUTE',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',

  // Server
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  OPERATION_TIMEOUT = 'OPERATION_TIMEOUT',
}
