import { Loader } from 'lucide-react';
import React from 'react';

import { FileWithProgress } from '../types';

interface UploadProgressProps {
  files: FileWithProgress[];
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ files }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Uploading...</h3>
        <Loader className="w-5 h-5 text-gray-400 animate-spin" />
      </div>
      <div className="space-y-3">
        {files.map((fileWithProgress, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700 truncate flex-1 mr-4">
                {fileWithProgress.file.name}
              </span>
              <span className="text-gray-500 font-medium">
                {fileWithProgress.progress.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${fileWithProgress.progress.progress}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
