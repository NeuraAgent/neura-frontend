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
  const scrollHeight = textarea.scrollHeight;
  const newHeight = Math.min(scrollHeight, TEXTAREA_CONFIG.MAX_HEIGHT);

  textarea.style.height = `${newHeight}px`;

  // Show scrollbar only when max height is reached or exceeded
  if (scrollHeight > TEXTAREA_CONFIG.MAX_HEIGHT) {
    textarea.style.overflowY = 'auto';
    // Ensure the scrollbar is visible immediately
    // @ts-ignore
    textarea.style.scrollbarWidth = 'thin';
  } else {
    textarea.style.overflowY = 'hidden';
  }
};
