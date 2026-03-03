/**
 * Dashboard Constants
 * Centralized configuration for the dashboard
 */

export const MODEL_OPTIONS = [
  {
    value: 'neura-2.0-flash',
    label: 'Neura 2.0 Flash',
    icon: '⚡',
    enabled: true,
  },
] as const;

export const TEXTAREA_CONFIG = {
  MIN_HEIGHT: 24,
  MAX_HEIGHT: 200,
  LINE_HEIGHT: 24,
} as const;

export const CREDIT_CHECK_ESTIMATE = 5;

export const COPY_TIMEOUT_MS = 2000;

export const SIDEBAR_WIDTH = {
  OPEN: 'w-70 sm:w-80',
  CLOSED: 'w-16',
} as const;

export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
} as const;
