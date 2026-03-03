/**
 * CreditWarning Component
 * Displays insufficient credits warning
 */

import { AlertCircle } from 'lucide-react';
import React from 'react';

interface CreditWarningProps {
  error: string;
  onDismiss: () => void;
  title: string;
  purchaseLabel: string;
}

export const CreditWarning: React.FC<CreditWarningProps> = ({
  error,
  onDismiss,
  title,
  purchaseLabel,
}) => {
  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-800">{title}</p>
        <p className="text-sm text-red-700 mt-1">{error}</p>
        <button
          onClick={onDismiss}
          className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline cursor-pointer"
        >
          {purchaseLabel} →
        </button>
      </div>
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-600 cursor-pointer"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};
