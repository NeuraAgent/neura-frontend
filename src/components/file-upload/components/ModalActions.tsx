import React from 'react';

interface ModalActionsProps {
  hasResults: boolean;
  isUploading: boolean;
  onClose: () => void;
}

export const ModalActions: React.FC<ModalActionsProps> = ({
  hasResults,
  isUploading,
  onClose,
}) => {
  return (
    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
      {hasResults && !isUploading ? (
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 font-medium transition-colors"
        >
          Done
        </button>
      ) : (
        <button
          onClick={onClose}
          disabled={isUploading}
          className="px-4 py-2 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Cancel'}
        </button>
      )}
    </div>
  );
};
