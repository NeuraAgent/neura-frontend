/**
 * Dashboard Types
 * Type definitions for dashboard components
 */

export interface MessageImage {
  url: string;
  status: 'uploading' | 'processing' | 'done' | 'error';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  images?: MessageImage[];
}

export interface ModelOption {
  value: string;
  label: string;
  icon: string;
  enabled: boolean;
}

export interface SendMessageParams {
  content: string;
  displayContent?: string;
  images?: MessageImage[];
  getBackendContent?: () => Promise<string>;
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
