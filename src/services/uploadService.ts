import axios from 'axios';

import { env } from '@/utils/env';

/**
 * Upload images to backend/S3
 * Mock implementation - replace with actual API endpoint
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData();

  files.forEach((file, index) => {
    formData.append(`image_${index}`, file);
  });

  try {
    const response = await axios.post(
      `${env.VITE_API_URL}/api/upload/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    return response.data.urls || [];
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error('Failed to upload images');
  }
}

/**
 * Upload single image with progress tracking
 */
export async function uploadImageWithProgress(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(
      `${env.VITE_API_URL}/api/upload/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        onUploadProgress: progressEvent => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      }
    );

    return response.data.url;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error('Failed to upload image');
  }
}
