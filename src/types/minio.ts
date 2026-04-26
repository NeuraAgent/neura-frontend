export interface MinioConfig {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucketName: string;
    endpoint?: string;
}

export interface UploadProgress {
    fileName: string;
    progress: number;
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
