/**
 * LoadingIndicator Component
 * Displays animated loading dots for AI responses
 */

import React from 'react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
            <span className="text-xs text-white font-bold">AI</span>
          </div>
          <div className="flex-1 min-w-0 max-w-[85%]">
            <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm border border-gray-100 text-gray-800">
              <div className="flex items-center h-6">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
