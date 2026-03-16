/**
 * Error Codes Constants
 * Centralized error codes from backend services
 */

// Authentication Error Codes (401) - Trigger Logout
export const AUTH_ERROR_CODES = [
  'TOKEN_EXPIRED',
  'INVALID_TOKEN',
  'MISSING_TOKEN',
  'INVALID_TOKEN_TYPE',
  'UNAUTHORIZED',
  'NOT_AUTHENTICATED',
  'AUTH_ERROR',
] as const;

// Authorization Error Codes (403) - No Logout
export const FORBIDDEN_ERROR_CODES = [
  'INVALID_FRONTEND_TOKEN',
  'MISSING_FRONTEND_TOKEN',
  'FORBIDDEN',
  'INSUFFICIENT_PERMISSIONS',
] as const;

// Validation Error Codes (400)
export const VALIDATION_ERROR_CODES = [
  'VALIDATION_ERROR',
  'DATABASE_VALIDATION_ERROR',
] as const;

// Resource Error Codes (404)
export const RESOURCE_ERROR_CODES = [
  'NOT_FOUND',
  'USER_NOT_FOUND',
  'FILE_NOT_FOUND',
] as const;

// Conflict Error Codes (409)
export const CONFLICT_ERROR_CODES = [
  'DUPLICATE_RESOURCE',
  'FILE_ALREADY_EXISTS',
] as const;

// Rate Limit Error Codes (429)
export const RATE_LIMIT_ERROR_CODES = ['RATE_LIMIT_EXCEEDED'] as const;

// Server Error Codes (500)
export const SERVER_ERROR_CODES = [
  'INTERNAL_ERROR',
  'LOGIN_FAILED',
  'LOGOUT_FAILED',
  'VERIFICATION_FAILED',
] as const;

// Type exports
export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[number];
export type ForbiddenErrorCode = (typeof FORBIDDEN_ERROR_CODES)[number];
export type ValidationErrorCode = (typeof VALIDATION_ERROR_CODES)[number];
export type ResourceErrorCode = (typeof RESOURCE_ERROR_CODES)[number];
export type ConflictErrorCode = (typeof CONFLICT_ERROR_CODES)[number];
export type RateLimitErrorCode = (typeof RATE_LIMIT_ERROR_CODES)[number];
export type ServerErrorCode = (typeof SERVER_ERROR_CODES)[number];

export type ErrorCode =
  | AuthErrorCode
  | ForbiddenErrorCode
  | ValidationErrorCode
  | ResourceErrorCode
  | ConflictErrorCode
  | RateLimitErrorCode
  | ServerErrorCode;

// Helper functions
export const isAuthError = (errorCode: string): boolean => {
  return AUTH_ERROR_CODES.includes(errorCode as AuthErrorCode);
};

export const isForbiddenError = (errorCode: string): boolean => {
  return FORBIDDEN_ERROR_CODES.includes(errorCode as ForbiddenErrorCode);
};

export const isValidationError = (errorCode: string): boolean => {
  return VALIDATION_ERROR_CODES.includes(errorCode as ValidationErrorCode);
};

export const isResourceError = (errorCode: string): boolean => {
  return RESOURCE_ERROR_CODES.includes(errorCode as ResourceErrorCode);
};

export const isConflictError = (errorCode: string): boolean => {
  return CONFLICT_ERROR_CODES.includes(errorCode as ConflictErrorCode);
};

export const isRateLimitError = (errorCode: string): boolean => {
  return RATE_LIMIT_ERROR_CODES.includes(errorCode as RateLimitErrorCode);
};

export const isServerError = (errorCode: string): boolean => {
  return SERVER_ERROR_CODES.includes(errorCode as ServerErrorCode);
};
