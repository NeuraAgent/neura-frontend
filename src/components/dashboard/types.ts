/**
 * Dashboard Types
 * Type definitions for dashboard components
 */

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface ModelOption {
  value: string;
  label: string;
  icon: string;
  enabled: boolean;
}

export interface SendMessageParams {
  content: string;
  userId: string;
  sessionId: string;
  fileIds: string[];
  model: string;
  userInfo: {
    firstName: string;
    lastName: string;
  };
}

export interface CreditCheckResult {
  hasCredits: boolean;
  available: number;
  required: number;
}
