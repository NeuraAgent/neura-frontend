import { useState } from 'react';

import { FileUploadResult } from '@/services/s3StorageService';

import { FileWithProgress } from '../types';

import { useFileProcessor } from './useFileProcessor';

export const useFileUpload = (
  userId: string,
  isAuthenticated: boolean,
  onSuccess: () => void,
  onClose: () => void
) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<FileUploadResult[]>([]);

  const { processFile } = useFileProcessor({
    userId,
    isAuthenticated,
    onProgressUpdate: (fileName, progress) => {
      setSelectedFiles(prev =>
        prev.map(f =>
          f.file.name === fileName
            ? {
                ...f,
                progress: {
                  ...f.progress,
                  progress,
                  status: 'uploading' as const,
                },
              }
            : f
        )
      );
    },
  });

  const startUpload = async (filesToUpload: FileWithProgress[]) => {
    if (filesToUpload.length === 0) return;

    setIsUploading(true);
    setUploadResults([]);

    try {
      const results: FileUploadResult[] = [];

      for (const fileWithProgress of filesToUpload) {
        const result = await processFile(fileWithProgress.file);
        results.push(result);
      }

      setUploadResults(results);

      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFiles([]);
      setUploadResults([]);
      onClose();
    }
  };

  return {
    selectedFiles,
    setSelectedFiles,
    isUploading,
    uploadResults,
    startUpload,
    handleClose,
  };
};
