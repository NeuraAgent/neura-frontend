/**
 * useModelSelector Hook
 * Manages model selection with localStorage persistence
 */

import { useEffect, useState } from 'react';

import { MODEL_OPTIONS } from '../constants';

const MODEL_STORAGE_KEY = 'selectedModel';

export const useModelSelector = () => {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return localStorage.getItem(MODEL_STORAGE_KEY) || MODEL_OPTIONS[0].value;
  });

  // Validate cached model on first load
  useEffect(() => {
    const cachedModel = localStorage.getItem(MODEL_STORAGE_KEY);
    if (cachedModel) {
      const isValidModel = MODEL_OPTIONS.some(
        option => option.value === cachedModel
      );
      if (!isValidModel) {
        const defaultModel = MODEL_OPTIONS[0].value;
        setSelectedModel(defaultModel);
        localStorage.setItem(MODEL_STORAGE_KEY, defaultModel);
      }
    }
  }, []);

  // Save selected model to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(MODEL_STORAGE_KEY, selectedModel);
  }, [selectedModel]);

  return { selectedModel, setSelectedModel };
};
