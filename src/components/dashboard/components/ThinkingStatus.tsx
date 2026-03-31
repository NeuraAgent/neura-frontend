/**
 * ThinkingStatus Component
 * Displays AI thinking steps with animated indicators
 */

import React from 'react';

interface ThinkingStatusProps {
  message: string;
}

export const ThinkingStatus: React.FC<ThinkingStatusProps> = ({ message }) => {
  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 shadow-sm">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="flex-1">
            <div className="bg-indigo-50 rounded-xl px-4 py-2 border border-indigo-100">
              <p className="text-sm text-indigo-700 font-medium">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
