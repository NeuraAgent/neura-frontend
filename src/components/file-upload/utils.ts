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
  if (!s3Key) return `fallback-${Date.now()}`;
  // Key pattern: uploads/YYYY/MM/{originalName}_sha{fileId}sha.{ext}
  const segment = s3Key.split('/').pop() || s3Key;
  const shaMatch = segment.match(/_sha([^_]+)sha\./);
  if (shaMatch && shaMatch[1]) return shaMatch[1];
  // Fallback: use the whole segment minus extension as a stable identifier
  return segment.replace(/\.[^/.]+$/, '') || `fallback-${Date.now()}`;
};

export const getFileType = (file: File): string => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension || 'unknown';
};

export const isPdfFile = (file: File): boolean => {
  return file.name.toLowerCase().endsWith('.pdf');
};
