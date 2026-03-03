/**
 * Message Utilities
 * Helper functions for message operations
 */

import { Message } from '../types';

export const createMessage = (
  role: Message['role'],
  content: string
): Message => ({
  role,
  content,
  timestamp: new Date().toLocaleTimeString(),
});

export const createUserMessage = (content: string): Message =>
  createMessage('user', content);

export const createAssistantMessage = (content: string): Message =>
  createMessage('assistant', content);

export const createErrorMessage = (error: unknown): Message =>
  createMessage('assistant', `Error: ${String(error)}`);

export const isCreditError = (error: unknown): boolean => {
  const errorMessage = String(error).toLowerCase();
  return (
    errorMessage.includes('credit') || errorMessage.includes('insufficient')
  );
};
