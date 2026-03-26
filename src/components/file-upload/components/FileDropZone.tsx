import { Upload } from 'lucide-react';
import React from 'react';

import { UPLOAD_CONSTANTS } from '../constants';

interface FileDropZoneProps {
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  onClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onDragOver,
  onDrop,
  onClick,
  fileInputRef,
  onFileSelect,
  isUploading,
}) => {
  return (
    <div
      className="border-2 border-dashed border-gray-200 rounded-2xl p-8 sm:p-12 text-center mb-6 hover:border-gray-300 hover:bg-gray-50/50 transition-all cursor-pointer"
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Upload files by clicking or dragging and dropping"
    >
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
        </div>
        <p className="text-base sm:text-lg font-medium text-gray-700 mb-1">
          Drag & drop files here
        </p>
        <p className="text-sm text-gray-500 mb-3">or click to browse</p>
        <p className="text-xs text-gray-400">
          Supported: {UPLOAD_CONSTANTS.SUPPORTED_FORMATS_TEXT}
        </p>
      </div>
      <input
        id="file-upload-input"
        ref={fileInputRef}
        type="file"
        multiple
        accept={UPLOAD_CONSTANTS.SUPPORTED_FORMATS}
        onChange={onFileSelect}
        disabled={isUploading}
        className="hidden"
      />
    </div>
  );
};
