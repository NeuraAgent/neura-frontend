import { FILE_ENDPOINTS } from '@/constants/api';
import { ApiMiddleware } from '@/utils/api';
import type { ApiMiddlewareResult } from '@/utils/api';

// Types for user file management
export interface UploadedFile {
  fileId: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  s3Key?: string;
  s3Url?: string;
  uploadedAt: Date;
  metadata?: {
    subject?: string;
    title?: string;
    week?: string;
    tags?: string;
    [key: string]: any;
  };
}

export interface AddFileRequest {
  fileId: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  s3Key?: string;
  s3Url?: string;
  metadata?: {
    subject?: string;
    title?: string;
    week?: string;
    tags?: string;
    [key: string]: any;
  };
}

export interface RemoveFileRequest {
  fileId: string;
}

export interface UserFilesResponse {
  success: boolean;
  message: string;
  data?: {
    files: UploadedFile[];
    totalFiles: number;
  };
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  details?: any[];
}

class UserFileService {
  /**
   * Add file - NO TRY-CATCH NEEDED
   */
  async addFile(
    fileInfo: AddFileRequest
  ): Promise<ApiMiddlewareResult<UploadedFile>> {
    return ApiMiddleware.post<UploadedFile>(
      FILE_ENDPOINTS.FILES_ADD,
      fileInfo,
      undefined,
      {
        requiresAuth: true,
        showErrorToast: true,
      }
    );
  }

  /**
   * Remove file - NO TRY-CATCH NEEDED
   */
  async removeFile(
    fileId: string
  ): Promise<ApiMiddlewareResult<{ fileId: string }>> {
    return ApiMiddleware.delete<{ fileId: string }>(
      FILE_ENDPOINTS.FILES_REMOVE,
      {
        data: { fileId },
      },
      {
        requiresAuth: true,
        showErrorToast: true,
      }
    );
  }

  /**
   * Get all user files - NO TRY-CATCH NEEDED
   */
  async getUserFiles(): Promise<ApiMiddlewareResult<UserFilesResponse>> {
    return ApiMiddleware.get<UserFilesResponse>(
      FILE_ENDPOINTS.FILES,
      undefined,
      {
        requiresAuth: true,
        showErrorToast: false,
      }
    );
  }

  /**
   * Get file by ID - NO TRY-CATCH NEEDED
   */
  async getFileById(
    fileId: string
  ): Promise<ApiMiddlewareResult<UploadedFile>> {
    return ApiMiddleware.get<UploadedFile>(
      FILE_ENDPOINTS.FILES_BY_ID(fileId),
      undefined,
      {
        requiresAuth: true,
        showErrorToast: true,
      }
    );
  }
}

// Export singleton instance
export const userFileService = new UserFileService();
export default userFileService;
