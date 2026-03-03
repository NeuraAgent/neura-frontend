/**
 * EmptyState Component
 * Displays when no messages exist
 */

import { FileText } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="text-gray-500 mb-4">
          <FileText className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-40" />
          <p className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
            {title}
          </p>
          <p className="text-sm sm:text-base text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};
