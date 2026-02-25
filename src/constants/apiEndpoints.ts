/**
 * API Endpoints Constants
 *
 * This file contains all API endpoints used throughout the application.
 * Centralized endpoint management for better maintainability.
 */

import { env } from '@/utils/env';

// Base URLs - use relative path for API Gateway (proxied through nginx)
export const BASE_URLS = {
  API_GATEWAY: env.VITE_API_URL,
} as const;

// API Gateway Endpoints (Port 9999)
export const API_GATEWAY_ENDPOINTS = {
  // Health endpoints

  // API routes (proxied to services)
  FILE: '/api',
  AUTH: '/api/auth',
  AI: '/api/ai',
} as const;

// Authentication Service Endpoints (Port 8006)
export const AUTH_ENDPOINTS = {
  // Health endpoints
  HEALTH: '/health',
  HEALTH_READY: '/health/ready',
  HEALTH_LIVE: '/health/live',

  // Authentication endpoints
  SIGNUP: '/signup',
  LOGIN: '/login',
  LOGOUT: '/logout',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_TOKEN: '/verify-token',
  REFRESH_TOKEN: '/refresh',

  FILES_BY_ID: '/api/files/:fileId',
} as const;

// Settings Service Endpoints (Port 8008)
export const SETTINGS_ENDPOINTS = {
  // Health endpoints
  HEALTH: '/health',

  // Chunk settings endpoints
  CHUNK_SETTINGS_GET: '/api/settings/chunk',
  CHUNK_SETTINGS_UPSERT: '/api/settings/chunk',
  CHUNK_SETTINGS_UPDATE: '/api/settings/chunk',
  CHUNK_SETTINGS_RESET: '/api/settings/chunk/reset',
} as const;

export const AI_CORE_ENDPOINTS = {
  HEALTH: '/health',

  VERSIONS: '/api/versions',
  EXECUTE: '/api/execute',
} as const;

export const VECTORDB_ENDPOINTS = {
  // Health and info endpoints
  HEALTH: '/health',
  COLLECTION_INFO: '/collection-info',
  DEBUG_SERVICES_STATUS: '/debug/services-status',

  // Search endpoints
  SEARCH: '/search',
  HYBRID_SEARCH: '/hybrid-search',

  // Document processing endpoints
  EMBED_AND_STORE: '/embed-and-store',
  BULK_EMBED_AND_STORE: '/bulk-embed-and-store',
} as const;

// Combined endpoints for easy access through API Gateway
export const GATEWAY_API_ENDPOINTS = {
  // Authentication (through API Gateway)
  AUTH_LOGIN: `${API_GATEWAY_ENDPOINTS.AUTH}/login`,
  AUTH_LOGOUT: `${API_GATEWAY_ENDPOINTS.AUTH}/logout`,
  AUTH_SIGNUP: `${API_GATEWAY_ENDPOINTS.AUTH}/signup`,
  AUTH_FORGOT_PASSWORD: `${API_GATEWAY_ENDPOINTS.AUTH}/forgot-password`,
  AUTH_RESET_PASSWORD: `${API_GATEWAY_ENDPOINTS.AUTH}/reset-password`,
  AUTH_VERIFY_TOKEN: `${API_GATEWAY_ENDPOINTS.AUTH}/verify-token`,
  AUTH_REFRESH: `${API_GATEWAY_ENDPOINTS.AUTH}/refresh`,
  AUTH_UPDATE_LANGUAGE: `${API_GATEWAY_ENDPOINTS.AUTH}/language`,
  AUTH_UPDATE_INTRO_STATUS: `${API_GATEWAY_ENDPOINTS.AUTH}/intro-status`,

  AI_EXECUTE: `${API_GATEWAY_ENDPOINTS.AI}/execute`,
} as const;

// Full URL builders
export const buildApiUrl = (
  endpoint: string,
  baseUrl: string = BASE_URLS.API_GATEWAY
): string => {
  return `${baseUrl}${endpoint}`;
};

// Export all endpoints as a single object for convenience
export const ALL_ENDPOINTS = {
  BASE_URLS,
  API_GATEWAY: API_GATEWAY_ENDPOINTS,
  AUTH: AUTH_ENDPOINTS,
  SETTINGS: SETTINGS_ENDPOINTS,
  VECTORDB: VECTORDB_ENDPOINTS,
  GATEWAY_API: GATEWAY_API_ENDPOINTS,
} as const;

export default ALL_ENDPOINTS;
