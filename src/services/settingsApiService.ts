/**
 * Settings API Service
 * Handles communication with the settings service for chunk configuration
 */

import { BASE_URLS } from '@/constants/apiEndpoints';
import { apiClient } from '@/utils/apiClient';

export interface ChunkSettings {
  id: string;
  chunkSize: number;
  chunkOverlap: number;
  subject?: string;
  week?: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChunkSettingsRequest {
  chunkSize: number;
  chunkOverlap: number;
  subject?: string;
  week?: string;
  title?: string;
}

export interface UpdateChunkSettingsRequest {
  chunkSize?: number;
  chunkOverlap?: number;
  subject?: string;
  week?: string;
  title?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

const settingApi = apiClient;

class SettingsApiService {
  private baseUrl: string;

  constructor(baseUrl: string = `${BASE_URLS.API_GATEWAY}/api`) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get current chunk settings
   */
  async getChunkSettings(): Promise<ChunkSettings> {
    try {
      const response = await settingApi.get<ApiResponse<ChunkSettings>>(
        '/api/settings/chunk'
      );

      // Axios response structure: response.data contains the actual data
      const result = response.data;

      if (!result.success) {
        throw new Error(result.error || result.message);
      }

      return result.data!;
    } catch (error) {
      console.error('❌ Failed to fetch chunk settings:', error);

      // Return default settings if API fails
      const defaultSettings: ChunkSettings = {
        id: 'default',
        chunkSize: 500,
        chunkOverlap: 50,
        subject: '',
        week: '',
        title: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return defaultSettings;
    }
  }

  /**
   * Create or update chunk settings (upsert)
   */
  async upsertChunkSettings(
    settings: CreateChunkSettingsRequest
  ): Promise<ChunkSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/chunk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // credentials: 'include',
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse<ChunkSettings> = await response.json();

      if (!result.success) {
        throw new Error(result.error || result.message);
      }

      return result.data!;
    } catch (error) {
      console.error('❌ Failed to upsert chunk settings:', error);
      throw error;
    }
  }

  /**
   * Update chunk settings (partial update)
   */
  async updateChunkSettings(
    settings: UpdateChunkSettingsRequest
  ): Promise<ChunkSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/chunk`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // credentials: 'include',
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse<ChunkSettings> = await response.json();

      if (!result.success) {
        throw new Error(result.error || result.message);
      }

      return result.data!;
    } catch (error) {
      console.error('❌ Failed to update chunk settings:', error);
      throw error;
    }
  }

  /**
   * Reset chunk settings to default values
   */
  async resetChunkSettings(): Promise<ChunkSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/chunk/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse<ChunkSettings> = await response.json();

      if (!result.success) {
        throw new Error(result.error || result.message);
      }

      return result.data!;
    } catch (error) {
      console.error('❌ Failed to reset chunk settings:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const settingsApiService = new SettingsApiService();
export default settingsApiService;
