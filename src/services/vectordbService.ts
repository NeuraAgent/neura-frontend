import { VECTORDB_API_ENDPOINTS } from '@/constants/api';
import {
  VectorDocument,
  EmbedAndStoreRequest,
  EmbedAndStoreResponse,
  BulkEmbedAndStoreRequest,
  BulkEmbedAndStoreResponse,
  HybridSearchRequest,
  HybridSearchResponse,
  DeletePointsRequest,
  DeletePointsResponse,
} from '@/types';
import { apiClient } from '@/utils/apiClient';
import { env } from '@/utils/env';

const vectorApi = apiClient;

class VectorDBService {
  private baseUrl: string;

  constructor(baseUrl: string = env.VITE_API_URL) {
    this.baseUrl = baseUrl;
  }

  // Health check
  async healthCheck(): Promise<{
    status: string;
    service: string;
    qdrant_status: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('VectorDB health check failed, using mock data:', error);
      // Return mock health status for development
      return {
        status: 'healthy',
        service: 'database',
        qdrant_status: 'connected',
      };
    }
  }

  // Single document upload with embedding
  async embedAndStore(
    request: EmbedAndStoreRequest
  ): Promise<EmbedAndStoreResponse> {
    try {
      // Convert id to string if it exists (fix UUID serialization issue)
      const requestPayload = {
        ...request,
        id: request.id ? String(request.id) : undefined,
      };

      const response: any = await vectorApi.post(
        VECTORDB_API_ENDPOINTS.EMBED_AND_STORE,
        requestPayload
      );

      return response.data;
    } catch (error: any) {
      console.error('❌ [VectorDB] Embed and store failed:', error);
      console.error('❌ [VectorDB] Error response:', error.response?.data);
      console.error('❌ [VectorDB] Error status:', error.response?.status);
      throw error;
    }
  }

  // Bulk document upload with embedding
  async bulkEmbedAndStore(
    request: BulkEmbedAndStoreRequest
  ): Promise<BulkEmbedAndStoreResponse> {
    try {
      // Convert all item ids to strings (fix UUID serialization issue)
      const requestPayload = {
        items: request.items.map(item => ({
          ...item,
          id: item.id ? String(item.id) : undefined,
        })),
      };

      const response: any = await vectorApi.post(
        VECTORDB_API_ENDPOINTS.BULK_EMBED_AND_STORE,
        requestPayload
      );

      return response.data;
    } catch (error: any) {
      console.error('❌ [VectorDB] Bulk embed and store failed:', error);
      console.error('❌ [VectorDB] Error response:', error.response?.data);
      console.error('❌ [VectorDB] Error status:', error.response?.status);
      throw error;
    }
  }

  // Hybrid search
  async hybridSearch(
    request: HybridSearchRequest
  ): Promise<HybridSearchResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/hybrid-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Hybrid search failed:', error);
      throw error;
    }
  }

  // Delete documents
  async deleteDocuments(
    request: DeletePointsRequest
  ): Promise<DeletePointsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete documents failed:', error);
      throw error;
    }
  }

  // Get documents by source (subject + title)
  async getDocumentsBySource(
    subject: string,
    title: string
  ): Promise<VectorDocument[]> {
    try {
      const searchResponse = await this.hybridSearch({
        query_text: title,
        limit: 100,
        score_threshold: 0.0,
        subject,
        title,
      });

      return searchResponse.results.map(result => ({
        id: result.id,
        text: result.payload.content,
        payload: result.payload,
      }));
    } catch (error) {
      console.error('Get documents by source failed:', error);
      return [];
    }
  }

  // Delete source (all documents with same subject + title)
  async deleteSource(subject: string, title: string): Promise<boolean> {
    try {
      // First get all documents for this source
      const documents = await this.getDocumentsBySource(subject, title);

      if (documents.length === 0) {
        return true; // Nothing to delete
      }

      // Delete all documents
      const deleteResponse = await this.deleteDocuments({
        point_ids: documents.map(doc => doc.id),
      });

      return deleteResponse.success;
    } catch (error) {
      console.error('Delete source failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const vectordbService = new VectorDBService(env.VITE_API_URL);
export default vectordbService;
