import { apiClient } from '@/utils/apiClient';

import { authService } from './authService';

const api = apiClient;

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
   * Add a new uploaded file to user's file list
   */
  async addFile(fileInfo: AddFileRequest): Promise<ApiResponse<UploadedFile>> {
    try {
      const response = await api.post('/api/files/add', fileInfo);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error adding file to user profile:', error);
      if (error.response?.data) {
        return error.response.data as ApiResponse<UploadedFile>;
      }
      throw error;
    }
  }

  /**
   * Remove a file from user's file list
   */
  async removeFile(fileId: string): Promise<ApiResponse<{ fileId: string }>> {
    try {
      const response = await api.delete('/api/files/remove', {
        data: { fileId },
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Error removing file from user profile:', error);
      if (error.response?.data) {
        return error.response.data as ApiResponse;
      }
      throw error;
    }
  }

  /**
   * Get all uploaded files for the authenticated user
   */
  async getUserFiles(): Promise<UserFilesResponse> {
    try {
      const response = await api.get('/api/files');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching user files:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      if (error.response?.data) {
        return error.response.data as UserFilesResponse;
      }
      throw error;
    }
  }

  /**
   * Get a specific file by ID for the authenticated user
   */
  async getFileById(fileId: string): Promise<ApiResponse<UploadedFile>> {
    try {
      const response = await api.get(`/api/files/${fileId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching file by ID:', error);
      if (error.response?.data) {
        return error.response.data as ApiResponse<UploadedFile>;
      }
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return authService.isAuthenticated();
  }

  /**
   * Get current user info
   */
  getCurrentUser() {
    return authService.getCurrentUser();
  }
}

// Export singleton instance
export const userFileService = new UserFileService();
export default userFileService;
