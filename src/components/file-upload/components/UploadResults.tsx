import { AlertCircle, CheckCircle } from 'lucide-react';
import React from 'react';

import { FileUploadResult } from '@/services/s3StorageService';

interface UploadResultsProps {
  results: FileUploadResult[];
}

export const UploadResults: React.FC<UploadResultsProps> = ({ results }) => {
  const successCount = results.filter(r => r.success).length;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        {successCount} of {results.length} files uploaded
      </h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl flex items-center space-x-3 ${
              result.success
                ? 'bg-green-50/50 border border-green-100'
                : 'bg-red-50/50 border border-red-100'
            }`}
          >
            {result.success ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium truncate ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {result.fileName}
              </p>
              {result.error && (
                <p className="text-xs text-red-600 mt-1">{result.error}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
