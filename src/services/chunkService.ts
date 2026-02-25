/**
 * File Chunking Service
 *
 * This service handles the chunking of file content based on configurable settings.
 * It fetches chunk configuration from the settings service and processes files
 * into smaller chunks that can be embedded and stored in the vector database.
 *
 * The chunking logic is based on the AI_system/admin_ui implementation:
 * - Splits text into words using whitespace
 * - Creates overlapping chunks with configurable size and overlap
 * - Maintains context between chunks through overlap
 * - Processes each chunk individually for embedding
 *
 * @author Neura Team
 */

import {
  EmbedAndStoreRequest,
  DocumentPayload,
  DocumentMetadata,
} from '@/types';

import { settingsApiService, ChunkSettings } from './settingsApiService';
import { vectordbService } from './vectordbService';

export interface ChunkResult {
  chunkId: string;
  text: string;
  chunkIndex: number;
  totalChunks: number;
  success: boolean;
  error?: string;
  documentId?: string;
}

export interface ChunkFileOptions {
  fileName: string;
  fileId: string;
  userId: string;
  subject?: string;
  week?: string;
  title?: string;
}

export interface ChunkFileResult {
  success: boolean;
  message: string;
  totalChunks: number;
  successfulChunks: number;
  failedChunks: number;
  chunks: ChunkResult[];
  error?: string;
}

class ChunkService {
  /**
   * Chunk a file's content and store each chunk in the vector database
   *
   * This function:
   * 1. Fetches chunk settings from the settings service
   * 2. Splits the file content into chunks based on word count
   * 3. Creates overlapping chunks to maintain context
   * 4. Embeds and stores each chunk in the vector database
   *
   * @param content - The text content of the file to chunk
   * @param options - File metadata and chunking options
   * @returns Promise<ChunkFileResult> - Results of the chunking operation
   */
  async chunkAndStoreFile(
    content: string,
    options: ChunkFileOptions
  ): Promise<ChunkFileResult> {
    try {
      const settings = await settingsApiService.getChunkSettings();
      const chunks = this.createChunks(
        content,
        settings.chunkSize,
        settings.chunkOverlap
      );
      const results: ChunkResult[] = [];
      let successfulChunks = 0;
      let failedChunks = 0;

      if (chunks.length === 1) {
        const chunk = chunks[0];
        const chunkId = `${options.fileName}_chunk_0`;

        try {
          const metadata: DocumentMetadata = {
            file_name: options.fileName,
            file_type: options.fileName.split('.').pop() || 'unknown',
            upload_timestamp: new Date().toISOString(),
            embedding_model: 'sentence-transformers/all-MiniLM-L6-v2',
            tags: [
              options.subject || settings.subject || 'general',
              options.week || settings.week || 'week01',
              options.title || settings.title || options.fileName,
            ]
              .filter(Boolean)
              .join(','),
          };

          const documentPayload: DocumentPayload = {
            text: chunk,
            chunk_id: 'chunk-0', // Simple chunk index format
            chunk_index: 0, // Numeric index for sorting
            file_id: options.fileId, // UUID string for filtering
            user_id: options.userId,
            metadata,
            created_at: new Date().toISOString(),
            last_updated_at: new Date().toISOString(),
          };

          const embedRequest: EmbedAndStoreRequest = {
            text: chunk,
            payload: documentPayload,
          };

          const embedResponse =
            await vectordbService.embedAndStore(embedRequest);

          if (embedResponse.success) {
            results.push({
              chunkId,
              text: chunk.substring(0, 100) + '...',
              chunkIndex: 0,
              totalChunks: 1,
              success: true,
              documentId: embedResponse.document_id,
            });
            successfulChunks++;
          } else {
            throw new Error(embedResponse.message || 'Embed and store failed');
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          console.error(`❌ Single chunk failed:`, errorMessage);

          results.push({
            chunkId,
            text: chunk.substring(0, 100) + '...',
            chunkIndex: 0,
            totalChunks: 1,
            success: false,
            error: errorMessage,
          });
          failedChunks++;
        }
      } else {
        const BATCH_SIZE = 10; // Process 10 chunks per batch
        const totalBatches = Math.ceil(chunks.length / BATCH_SIZE);

        try {
          // Process chunks in batches
          for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            const startIndex = batchIndex * BATCH_SIZE;
            const endIndex = Math.min(startIndex + BATCH_SIZE, chunks.length);
            const batchChunks = chunks.slice(startIndex, endIndex);

            // Prepare bulk request items for this batch
            const bulkItems = batchChunks.map((chunk, localIndex) => {
              const globalIndex = startIndex + localIndex;

              // Create chunk metadata using settings and options
              const metadata: DocumentMetadata = {
                file_name: options.fileName,
                file_type: options.fileName.split('.').pop() || 'unknown',
                upload_timestamp: new Date().toISOString(),
                embedding_model: 'sentence-transformers/all-MiniLM-L6-v2',
                tags: [
                  options.subject || settings.subject || 'general',
                  options.week || settings.week || 'week01',
                  options.title || settings.title || options.fileName,
                ]
                  .filter(Boolean)
                  .join(','),
              };

              // Create document payload for vector database
              const documentPayload: DocumentPayload = {
                text: chunk,
                chunk_id: `chunk-${globalIndex}`, // Simple chunk index format
                chunk_index: globalIndex, // Numeric index for sorting
                file_id: options.fileId, // UUID string for filtering
                user_id: options.userId,
                metadata,
                created_at: new Date().toISOString(),
                last_updated_at: new Date().toISOString(),
              };

              return {
                text: chunk,
                payload: documentPayload,
                // Don't send 'id' - let VectorDB generate UUID
              };
            });

            // Execute bulk embed and store for this batch
            const bulkResponse = await vectordbService.bulkEmbedAndStore({
              items: bulkItems,
            });

            if (bulkResponse.success && bulkResponse.results) {
              // Process bulk results for this batch
              bulkResponse.results.forEach((result, localIndex) => {
                const globalIndex = startIndex + localIndex;
                const chunkId = `${options.fileName}_chunk_${globalIndex}`;
                const chunk = batchChunks[localIndex];

                if (result.success) {
                  results.push({
                    chunkId,
                    text: chunk.substring(0, 100) + '...',
                    chunkIndex: globalIndex,
                    totalChunks: chunks.length,
                    success: true,
                    documentId: result.document_id,
                  });
                  successfulChunks++;
                } else {
                  results.push({
                    chunkId,
                    text: chunk.substring(0, 100) + '...',
                    chunkIndex: globalIndex,
                    totalChunks: chunks.length,
                    success: false,
                    error: result.message || 'Bulk embed and store failed',
                  });
                  failedChunks++;
                  console.error(
                    `❌ Chunk ${globalIndex + 1} failed:`,
                    result.message
                  );
                }
              });
            } else {
              // Mark all chunks in this batch as failed
              batchChunks.forEach((chunk, localIndex) => {
                const globalIndex = startIndex + localIndex;
                const chunkId = `${options.fileName}_chunk_${globalIndex}`;
                results.push({
                  chunkId,
                  text: chunk.substring(0, 100) + '...',
                  chunkIndex: globalIndex,
                  totalChunks: chunks.length,
                  success: false,
                  error: bulkResponse.message || 'Bulk embed and store failed',
                });
                failedChunks++;
              });

              console.error(
                `❌ Batch ${batchIndex + 1}/${totalBatches} failed:`,
                bulkResponse.message
              );
            }
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          console.error(`❌ Bulk processing failed:`, errorMessage);

          // Mark all remaining chunks as failed
          for (let i = results.length; i < chunks.length; i++) {
            const chunkId = `${options.fileName}_chunk_${i}`;
            const chunk = chunks[i];
            results.push({
              chunkId,
              text: chunk.substring(0, 100) + '...',
              chunkIndex: i,
              totalChunks: chunks.length,
              success: false,
              error: errorMessage,
            });
            failedChunks++;
          }
        }
      }

      const result: ChunkFileResult = {
        success: successfulChunks > 0,
        message: `Processed ${chunks.length} chunks: ${successfulChunks} successful, ${failedChunks} failed`,
        totalChunks: chunks.length,
        successfulChunks,
        failedChunks,
        chunks: results,
      };

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Chunk processing failed:', errorMessage);

      return {
        success: false,
        message: 'Failed to chunk and store file',
        totalChunks: 0,
        successfulChunks: 0,
        failedChunks: 0,
        chunks: [],
        error: errorMessage,
      };
    }
  }

  /**
   * Clean text content by removing problematic characters
   * Removes single curly braces that can cause format string errors
   *
   * @param text - The text content to clean
   * @returns Cleaned text content
   */
  private cleanTextContent(text: string): string {
    return (
      text
        // Remove all single curly braces (both { and })
        // This is safer than trying to preserve paired braces
        .replace(/[{}]/g, '')
        .trim()
    );
  }

  /**
   * Create chunks from text content
   *
   * This method implements the same chunking logic as AI_system/admin_ui/app.js:
   * - Splits text into words using whitespace
   * - Creates chunks with specified size and overlap
   * - Maintains context between chunks through overlap
   *
   * @param text - The text content to chunk
   * @param chunkSize - Number of words per chunk
   * @param overlap - Number of words to overlap between chunks
   * @returns Array of text chunks
   */
  private createChunks(
    text: string,
    chunkSize: number,
    overlap: number
  ): string[] {
    // Clean the text content first
    const cleanedText = this.cleanTextContent(text);

    // Split text into words using whitespace (same as AI_system/admin_ui)
    const words = cleanedText.split(/\s+/);
    const chunks: string[] = [];

    // Create chunks with overlap (same logic as AI_system/admin_ui)
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      if (chunk.trim()) {
        // Apply additional cleaning to each chunk
        const cleanedChunk = this.cleanTextContent(chunk.trim());
        if (cleanedChunk) {
          chunks.push(cleanedChunk);
        }
      }
    }

    return chunks;
  }

  /**
   * Validate chunk settings
   */
  public validateChunkSettings(settings: ChunkSettings): boolean {
    if (settings.chunkSize < 50 || settings.chunkSize > 2000) {
      console.error('❌ Invalid chunk size:', settings.chunkSize);
      return false;
    }

    if (settings.chunkOverlap < 0 || settings.chunkOverlap > 500) {
      console.error('❌ Invalid chunk overlap:', settings.chunkOverlap);
      return false;
    }

    if (settings.chunkOverlap >= settings.chunkSize) {
      console.error('❌ Chunk overlap must be less than chunk size');
      return false;
    }

    return true;
  }
}

// Export singleton instance
export const chunkService = new ChunkService();
export default chunkService;
