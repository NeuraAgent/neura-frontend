import React from 'react';

import { useIntroTourStore } from '@/stores/introTourStore';
import { useUserStore } from '@/stores/userStore';

import {
  FileDropZone,
  ModalActions,
  ModalHeader,
  UploadProgress,
  UploadResults,
} from './file-upload/components';
import { UPLOAD_CONSTANTS } from './file-upload/constants';
import {
  useFileSelection,
  useFileUpload,
  useModalEffects,
} from './file-upload/hooks';
import { FileUploadModalProps } from './file-upload/types';

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, isAuthenticated } = useUserStore();
  const { isActive: isTourActive } = useIntroTourStore();

  const {
    selectedFiles,
    setSelectedFiles,
    isUploading,
    uploadResults,
    startUpload,
    handleClose,
  } = useFileUpload(
    user?.id || 'anonymous',
    isAuthenticated,
    onSuccess,
    onClose
  );

  const {
    fileInputRef,
    handleFileSelect,
    handleDragOver,
    handleDrop,
    triggerFileInput,
  } = useFileSelection({
    isUploading,
    onFilesSelected: files => {
      setSelectedFiles(files);
      setTimeout(() => startUpload(files), UPLOAD_CONSTANTS.AUTO_UPLOAD_DELAY);
    },
  });

  useModalEffects(isOpen, isUploading, isTourActive, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <ModalHeader onClose={handleClose} isUploading={isUploading} />

        <FileDropZone
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          fileInputRef={fileInputRef}
          onFileSelect={handleFileSelect}
          isUploading={isUploading}
        />

        {isUploading && <UploadProgress files={selectedFiles} />}

        {uploadResults.length > 0 && !isUploading && (
          <UploadResults results={uploadResults} />
        )}

        <ModalActions
          hasResults={uploadResults.length > 0}
          isUploading={isUploading}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};

export default FileUploadModal;
