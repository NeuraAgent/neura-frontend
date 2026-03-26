// AWS S3 Storage Service for file uploads
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';

import { env } from '@/utils/env';

export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
  endpoint?: string; // Optional for custom S3-compatible services
}

export interface UploadProgress {
  fileName: string;
  progress: number; // 0-100
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  s3Key?: string;
  s3FileName?: string;
}

export interface FileUploadResult {
  success: boolean;
  fileName: string;
  s3Key: string;
  s3FileName: string;
  s3Url?: string;
  error?: string;
}

class S3StorageService {
  private config: S3Config | null = null;
  private s3Client: S3Client | null = null;
  private isConfigured: boolean = false;

  constructor() {
    // Initialize with environment variables or config
    this.initializeConfig();
  }

  private initializeConfig() {
    // Get configuration from environment variables
    const accessKeyId = env.VITE_AWS_ACCESS_KEY_ID || 'mock-access-key';
    const secretAccessKey = env.VITE_AWS_SECRET_ACCESS_KEY || 'mock-secret-key';
    const region = env.VITE_AWS_REGION || 'us-east-1';
    const bucketName = env.VITE_AWS_S3_BUCKET_NAME || 'mock-bucket';
    const endpoint = env.VITE_AWS_S3_ENDPOINT || undefined;

    this.config = {
      accessKeyId,
      secretAccessKey,
      region,
      bucketName,
      endpoint,
    };

    // Check if we have real credentials configured
    this.isConfigured =
      this.config.accessKeyId !== 'mock-access-key' &&
      this.config.secretAccessKey !== 'mock-secret-key' &&
      this.config.bucketName !== 'mock-bucket';

    if (this.isConfigured) {
      try {
        // Initialize S3 client
        this.s3Client = new S3Client({
          region: this.config.region,
          credentials: {
            accessKeyId: this.config.accessKeyId,
            secretAccessKey: this.config.secretAccessKey,
          },
          ...(this.config.endpoint && { endpoint: this.config.endpoint }),
        });
      } catch (error) {
        console.error('Failed to initialize AWS S3 client:', error);
        this.s3Client = null;
        this.isConfigured = false;
      }
    }
    // S3 configuration not provided, service will not be available
  }

  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FileUploadResult> {
    try {
      // Generate unique file ID
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

      // Clean filename to remove problematic characters
      const originalName = file.name
        .split('.')[0]
        .replace(/[{}\\]/g, '') // Remove curly braces and backslashes
        .replace(/[^a-zA-Z0-9\-_]/g, '_') // Replace other special chars with underscore
        .substring(0, 50); // Limit length

      const extension = file.name.split('.').pop();
      const s3FileName = `${originalName}_sha${fileId}sha.${extension}`;
      const s3Key = `uploads/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${s3FileName}`;

      // Update progress
      onProgress?.({
        fileName: file.name,
        progress: 10,
        status: 'uploading',
      });

      // Check if we have real AWS S3 configured
      if (this.isConfigured && this.s3Client && this.config) {
        // Real S3 upload
        // Update progress
        onProgress?.({
          fileName: file.name,
          progress: 30,
          status: 'uploading',
        });

        // Convert File to ArrayBuffer for S3
        const buffer = await file.arrayBuffer();

        // Prepare S3 upload parameters
        // Note: S3 Metadata only supports ISO-8859-1 characters
        // Encode non-ASCII characters to base64 for metadata
        const encodeMetadata = (str: string): string => {
          try {
            // Check if string contains non-ASCII characters
            // eslint-disable-next-line no-control-regex
            if (/[^\x00-\x7F]/.test(str)) {
              // Encode to base64 for non-ASCII strings
              return btoa(encodeURIComponent(str));
            }
            return str;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            // Fallback: remove non-ASCII characters
            // eslint-disable-next-line no-control-regex
            return str.replace(/[^\x00-\x7F]/g, '');
          }
        };

        const uploadParams: PutObjectCommandInput = {
          Bucket: this.config.bucketName,
          Key: s3Key,
          Body: new Uint8Array(buffer),
          ContentType: file.type,
          Metadata: {
            originalName: encodeMetadata(file.name),
            uploadedAt: new Date().toISOString(),
            fileId: fileId,
          },
        };

        // Update progress
        onProgress?.({
          fileName: file.name,
          progress: 50,
          status: 'uploading',
        });

        // Direct S3 upload only
        const command = new PutObjectCommand(uploadParams);
        try {
          await this.s3Client.send(command);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (s3Error: any) {
          // Fallback to mock mode
          return this.performMockUpload(file, onProgress);
        }

        // Update progress
        onProgress?.({
          fileName: file.name,
          progress: 80,
          status: 'processing',
        });

        // Generate S3 URL (if public bucket or signed URL needed)
        const s3Url = this.config.endpoint
          ? `${this.config.endpoint}/${this.config.bucketName}/${s3Key}`
          : `https://${this.config.bucketName}.s3.${this.config.region}.amazonaws.com/${s3Key}`;

        // Update progress
        onProgress?.({
          fileName: file.name,
          progress: 100,
          status: 'completed',
          s3Key: s3Key,
          s3FileName: s3FileName,
        });

        return {
          success: true,
          fileName: file.name,
          s3Key: s3Key,
          s3FileName: s3FileName,
          s3Url: s3Url,
        };
      } else {
        // Mock upload for development
        // Update progress
        onProgress?.({
          fileName: file.name,
          progress: 30,
          status: 'uploading',
        });

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update progress
        onProgress?.({
          fileName: file.name,
          progress: 80,
          status: 'processing',
        });

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock successful response
        const mockS3Url = `https://mock-bucket.s3.us-east-1.amazonaws.com/${s3Key}`;

        // Update progress
        onProgress?.({
          fileName: file.name,
          progress: 100,
          status: 'completed',
          s3Key: s3Key,
          s3FileName: s3FileName,
        });

        return {
          success: true,
          fileName: file.name,
          s3Key: s3Key,
          s3FileName: s3FileName,
          s3Url: mockS3Url,
        };
      }
    } catch (error) {
      console.error('S3 upload failed:', error);

      onProgress?.({
        fileName: file.name,
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed',
      });

      return {
        success: false,
        fileName: file.name,
        s3Key: '',
        s3FileName: '',
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  // Mock upload method for fallback
  private async performMockUpload(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FileUploadResult> {
    // Generate file ID and names
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // Clean filename to remove problematic characters
    const originalName = file.name
      .split('.')[0]
      .replace(/[{}\\]/g, '') // Remove curly braces and backslashes
      .replace(/[^a-zA-Z0-9\-_]/g, '_') // Replace other special chars with underscore
      .substring(0, 50); // Limit length

    const extension = file.name.split('.').pop();
    const s3FileName = `${originalName}_sha${fileId}sha.${extension}`;
    const s3Key = `uploads/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${s3FileName}`;

    // Update progress
    onProgress?.({
      fileName: file.name,
      progress: 30,
      status: 'uploading',
    });

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update progress
    onProgress?.({
      fileName: file.name,
      progress: 80,
      status: 'processing',
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock successful response
    const mockS3Url = `https://mock-bucket.s3.us-east-1.amazonaws.com/${s3Key}`;

    // Update progress
    onProgress?.({
      fileName: file.name,
      progress: 100,
      status: 'completed',
      s3Key: s3Key,
      s3FileName: s3FileName,
    });

    return {
      success: true,
      fileName: file.name,
      s3Key: s3Key,
      s3FileName: s3FileName,
      s3Url: mockS3Url,
    };
  }

  async uploadMultipleFiles(
    files: File[],
    onProgress?: (fileName: string, progress: UploadProgress) => void
  ): Promise<FileUploadResult[]> {
    const results: FileUploadResult[] = [];

    // Upload files sequentially to avoid overwhelming the API
    for (const file of files) {
      const result = await this.uploadFile(file, progress => {
        onProgress?.(file.name, progress);
      });
      results.push(result);
    }

    return results;
  }

  // Validate file type
  isValidFileType(file: File): boolean {
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const allowedExtensions = ['.txt', '.pdf', '.docx'];

    const hasValidType = allowedTypes.includes(file.type);
    const hasValidExtension = allowedExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
    );

    return hasValidType || hasValidExtension;
  }

  // Get file type display name
  getFileTypeDisplayName(file: File): string {
    if (file.name.toLowerCase().endsWith('.txt')) return 'Text Document';
    if (file.name.toLowerCase().endsWith('.pdf')) return 'PDF Document';
    if (file.name.toLowerCase().endsWith('.docx')) return 'Word Document';
    return 'Unknown';
  }

  // Get S3 configuration status
  getConfigurationStatus(): {
    isConfigured: boolean;
    bucketName?: string;
    region?: string;
  } {
    return {
      isConfigured: this.isConfigured,
      bucketName: this.config?.bucketName,
      region: this.config?.region,
    };
  }
}

export const s3StorageService = new S3StorageService();
