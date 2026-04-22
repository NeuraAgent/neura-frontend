/**
 * Message Utilities
 * Helper functions for message operations
 */

import { v4 as uuidv4 } from 'uuid';

import { Message, MessageImage } from '../types';

export const createMessage = (
  role: Message['role'],
  content: string,
  images?: MessageImage[]
): Message => ({
  id: uuidv4(),
  role,
  content,
  timestamp: new Date().toLocaleTimeString(),
  images,
});

export const createUserMessage = (
  content: string,
  images?: MessageImage[]
): Message => createMessage('user', content, images);

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
