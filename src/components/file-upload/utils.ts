import { isFileTypeSupported } from '@/utils/fileFormatUtils';

import { FileWithProgress } from './types';

export const validateFiles = (files: File[]): File[] => {
  return files.filter(file => {
    if (!isFileTypeSupported(file)) {
      alert(
        `File ${file.name} is not supported. Only DOCX, PDF, TXT, and MD files are allowed.`
      );
      return false;
    }
    return true;
  });
};

export const createFilesWithProgress = (files: File[]): FileWithProgress[] => {
  return files.map(file => ({
    file,
    progress: {
      fileName: file.name,
      progress: 0,
      status: 'uploading' as const,
    },
  }));
};

export const extractFileId = (s3Key: string): string => {
  return s3Key.split('/').pop()?.split('_sha')[1]?.split('sha')[0] || s3Key;
};

export const getFileType = (file: File): string => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension || 'unknown';
};

export const isPdfFile = (file: File): boolean => {
  return file.name.toLowerCase().endsWith('.pdf');
};
