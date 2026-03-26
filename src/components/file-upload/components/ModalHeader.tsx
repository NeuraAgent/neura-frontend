import { X } from 'lucide-react';
import React from 'react';

interface ModalHeaderProps {
  onClose: () => void;
  isUploading: boolean;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  onClose,
  isUploading,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
        Upload Files
      </h2>
      <button
        onClick={onClose}
        disabled={isUploading}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
        title="Close (ESC)"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
};
