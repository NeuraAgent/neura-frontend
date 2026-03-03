/**
 * useClipboard Hook
 * Manages clipboard operations with temporary success state
 */

import { useState } from 'react';

import { COPY_TIMEOUT_MS } from '../constants';

export const useClipboard = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (
    content: string,
    index: number
  ): Promise<void> => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex(null);
      }, COPY_TIMEOUT_MS);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  return { copiedIndex, copyToClipboard };
};
