/**
 * Textarea Utilities
 * Helper functions for textarea operations
 */

import { TEXTAREA_CONFIG } from '../constants';

export const resetTextareaHeight = (
  textarea: HTMLTextAreaElement | null
): void => {
  if (!textarea) return;
  textarea.style.height = `${TEXTAREA_CONFIG.MIN_HEIGHT}px`;
  textarea.style.overflowY = 'hidden';
};

export const adjustTextareaHeight = (
  textarea: HTMLTextAreaElement | null
): void => {
  if (!textarea) return;

  // Reset height to auto to allow shrinking
  textarea.style.height = 'auto';

  // Calculate new height based on content
  const newHeight = Math.min(textarea.scrollHeight, TEXTAREA_CONFIG.MAX_HEIGHT);
  textarea.style.height = `${newHeight}px`;

  // Show scrollbar only when max height is reached
  if (textarea.scrollHeight > TEXTAREA_CONFIG.MAX_HEIGHT) {
    textarea.style.overflowY = 'auto';
  } else {
    textarea.style.overflowY = 'hidden';
  }
};
