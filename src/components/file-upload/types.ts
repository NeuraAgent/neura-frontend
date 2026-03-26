import { UploadProgress, FileUploadResult } from '@/services/s3StorageService';

export interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface FileWithProgress {
  file: File;
  progress: UploadProgress;
}

export interface FileProcessingContext {
  file: File;
  userId: string;
  isAuthenticated: boolean;
}

export interface UploadCallbacks {
  onProgressUpdate: (fileName: string, progress: number) => void;
  onFileComplete: (result: FileUploadResult) => void;
}
