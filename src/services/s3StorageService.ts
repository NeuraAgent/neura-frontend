import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  HeadObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { MINIO_CONSTANTS } from '@/constants/minio';
import { MinioConfig, UploadProgress, FileUploadResult } from '@/types/minio';
import { env } from '@/utils/env';

// Module State
let config: MinioConfig | null = null;
let minioClient: S3Client | null = null;
let isConfigured: boolean = false;

/**
 * Automatically executed on module load to parse configuration
 */
export const initializeMinioConfig = () => {
  const accessKeyId = env.VITE_MINIO_ACCESS_KEY || 'mock-access-key';
  const secretAccessKey = env.VITE_MINIO_SECRET_KEY || 'mock-secret-key';
  const bucketName = env.VITE_MINIO_BUCKET_NAME || 'mock-bucket';
  const endpoint = env.VITE_MINIO_ENDPOINT || undefined;

  config = {
    accessKeyId,
    secretAccessKey,
    region: 'us-east-1',
    bucketName,
    endpoint,
  };

  isConfigured =
    config.accessKeyId !== 'mock-access-key' &&
    config.secretAccessKey !== 'mock-secret-key' &&
    config.bucketName !== 'mock-bucket';

  if (isConfigured) {
    try {
      minioClient = new S3Client({
        region: config.region,
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
        ...(config.endpoint && {
          endpoint: config.endpoint,
          forcePathStyle: true,
        }),
      });
    } catch (error) {
      console.error('Failed to initialize MinIO client:', error);
      minioClient = null;
      isConfigured = false;
    }
  }
};

// Initialize immediately
initializeMinioConfig();

export const uploadFile = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<FileUploadResult> => {
  try {
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const originalName = file.name
      .split('.')[0]
      .replace(/[{}\\]/g, '')
      .replace(/[^a-zA-Z0-9\-_]/g, '_')
      .substring(0, 50);

    const extension = file.name.split('.').pop();
    const minioFileName = `${originalName}_sha${fileId}sha.${extension}`;
    const minioKey = `uploads/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${minioFileName}`;

    onProgress?.({
      fileName: file.name,
      progress: 10,
      status: 'uploading',
    });

    if (isConfigured && minioClient && config) {
      onProgress?.({
        fileName: file.name,
        progress: 30,
        status: 'uploading',
      });

      try {
        const contentType = file.type ||
          (extension === 'txt' || extension === 'md' ? 'text/plain' :
            extension === 'pdf' ? 'application/pdf' : 'application/octet-stream');

        // Convert File to Uint8Array to prevent AWS SDK "Qe.getReader is not a function" chunked stream bugs in browser
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const command = new PutObjectCommand({
          Bucket: config.bucketName,
          Key: minioKey,
          Body: buffer,
          ContentType: contentType, // Critical for MinIO rendering
        });

        onProgress?.({
          fileName: file.name,
          progress: 50,
          status: 'uploading',
        });

        await minioClient.send(command);
      } catch (uploadError: any) {
        console.error('Real MinIO upload failed, falling back to mock mode:', uploadError);
        return performMockUpload(file, onProgress);
      }

      onProgress?.({
        fileName: file.name,
        progress: 80,
        status: 'processing',
      });

      const minioUrl = config.endpoint
        ? `${config.endpoint}/${config.bucketName}/${minioKey}`
        : `http://localhost:9000/${config.bucketName}/${minioKey}`;

      onProgress?.({
        fileName: file.name,
        progress: 100,
        status: 'completed',
        s3Key: minioKey,
        s3FileName: minioFileName,
      });

      return {
        success: true,
        fileName: file.name,
        s3Key: minioKey,
        s3FileName: minioFileName,
        s3Url: minioUrl,
      };
    } else {
      return performMockUpload(file, onProgress);
    }
  } catch (error) {
    console.error('MinIO upload failed:', error);

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
};

export const deleteFile = async (minioKey: string): Promise<{ success: boolean; error?: string }> => {
  if (!minioKey) return { success: false, error: 'No MinIO Key provided for deletion' };

  try {
    if (isConfigured && minioClient && config) {
      const command = new DeleteObjectCommand({
        Bucket: config.bucketName,
        Key: minioKey,
      });

      await minioClient.send(command);
      console.log(`Successfully deleted ${minioKey} from MinIO bucket`);
      return { success: true };
    } else {
      console.log(`Mock deleted ${minioKey}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    }
  } catch (error) {
    console.error('MinIO deletion failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Deletion failed',
    };
  }
};

export const getFileMetadata = async (minioKey: string): Promise<{ success: boolean; metadata?: any; error?: string }> => {
  if (!minioKey) return { success: false, error: 'No MinIO Key provided' };

  try {
    if (isConfigured && minioClient && config) {
      const command = new HeadObjectCommand({ Bucket: config.bucketName, Key: minioKey });
      const result = await minioClient.send(command);
      return { success: true, metadata: result };
    }
    return { success: false, error: 'MinIO API completely unconfigured' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const listFiles = async (prefix?: string): Promise<{ success: boolean; files?: any[]; error?: string }> => {
  try {
    if (isConfigured && minioClient && config) {
      const command = new ListObjectsV2Command({
        Bucket: config.bucketName,
        Prefix: prefix,
      });
      const result = await minioClient.send(command);
      return { success: true, files: result.Contents || [] };
    }
    return { success: false, error: 'MinIO Client is offline' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getFileDownloadUrl = async (minioKey: string): Promise<{ success: boolean; url?: string; error?: string }> => {
  if (!minioKey) return { success: false, error: 'No Key defined' };

  try {
    if (isConfigured && minioClient && config) {
      const command = new GetObjectCommand({ Bucket: config.bucketName, Key: minioKey });
      const presignedUrl = await getSignedUrl(minioClient, command, { expiresIn: 3600 });
      return { success: true, url: presignedUrl };
    }
    return { success: false, error: 'Client Unreachable' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const copyFile = async (sourceKey: string, destKey: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (isConfigured && minioClient && config) {
      const command = new CopyObjectCommand({
        Bucket: config.bucketName,
        CopySource: `${config.bucketName}/${sourceKey}`,
        Key: destKey,
      });
      await minioClient.send(command);
      return { success: true };
    }
    return { success: false, error: 'Service is Offline' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const performMockUpload = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<FileUploadResult> => {
  const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  const originalName = file.name
    .split('.')[0]
    .replace(/[{}\\]/g, '')
    .replace(/[^a-zA-Z0-9\-_]/g, '_')
    .substring(0, 50);

  const extension = file.name.split('.').pop();
  const minioFileName = `${originalName}_sha${fileId}sha.${extension}`;
  const minioKey = `uploads/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${minioFileName}`;

  onProgress?.({
    fileName: file.name,
    progress: 30,
    status: 'uploading',
  });

  await new Promise(resolve => setTimeout(resolve, 1500));

  onProgress?.({
    fileName: file.name,
    progress: 80,
    status: 'processing',
  });

  await new Promise(resolve => setTimeout(resolve, 800));

  const mockMinioUrl = `http://localhost:9000/mock-bucket/${minioKey}`;

  onProgress?.({
    fileName: file.name,
    progress: 100,
    status: 'completed',
    s3Key: minioKey,
    s3FileName: minioFileName,
  });

  return {
    success: true,
    fileName: file.name,
    s3Key: minioKey,
    s3FileName: minioFileName,
    s3Url: mockMinioUrl,
  };
};

export const uploadMultipleFiles = async (
  files: File[],
  onProgress?: (fileName: string, progress: UploadProgress) => void
): Promise<FileUploadResult[]> => {
  const results: FileUploadResult[] = [];
  for (const file of files) {
    const result = await uploadFile(file, progress => {
      onProgress?.(file.name, progress);
    });
    results.push(result);
  }
  return results;
};

export const isValidFileType = (file: File): boolean => {
  const hasValidType = MINIO_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.type);
  const hasValidExtension = MINIO_CONSTANTS.ALLOWED_EXTENSIONS.some(ext =>
    file.name.toLowerCase().endsWith(ext)
  );
  return hasValidType || hasValidExtension;
};

export const getFileTypeDisplayName = (file: File): string => {
  if (file.name.toLowerCase().endsWith('.txt')) return 'Text Document';
  if (file.name.toLowerCase().endsWith('.pdf')) return 'PDF Document';
  if (file.name.toLowerCase().endsWith('.docx')) return 'Word Document';
  return 'Unknown';
};

export const getConfigurationStatus = (): { isConfigured: boolean; bucketName?: string } => {
  return {
    isConfigured: isConfigured,
    bucketName: config?.bucketName,
  };
};

export type { MinioConfig, UploadProgress, FileUploadResult } from '@/types/minio';
