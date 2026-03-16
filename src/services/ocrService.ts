import { OCR_ENDPOINTS } from '@/constants/api';
import { apiClient } from '@/utils/apiClient';

export interface PDFImageData {
  page_number: number;
  image_base64: string;
}

export interface OCRPageResult {
  page_number: number;
  extracted_text: string;
  tokens_used: number;
  error?: string;
}

export interface OCRResponse {
  success: boolean;
  total_pages: number;
  processed_pages: number;
  total_tokens_used: number;
  full_text: string;
  pages: OCRPageResult[];
  error?: string;
}

class OCRService {
  async extractTextFromPDF(
    pdfImages: PDFImageData[],
    prompt: string = 'Extract all the text from this document page:',
    maxTokens: number = 2000
  ): Promise<OCRResponse> {
    try {
      const results: OCRPageResult[] = [];
      let totalTokens = 0;

      // Process pages one by one to avoid 413 Payload Too Large
      for (const pdfImage of pdfImages) {
        try {
          const response = await apiClient.post(OCR_ENDPOINTS.EXTRACT_TEXT, {
            image_base64: pdfImage.image_base64,
            prompt: `${prompt} (Page ${pdfImage.page_number})`,
            max_tokens: maxTokens,
          });

          if (response.data.success) {
            results.push({
              page_number: pdfImage.page_number,
              extracted_text: response.data.extracted_text,
              tokens_used: response.data.tokens_used || 0,
            });
            totalTokens += response.data.tokens_used || 0;
          } else {
            console.error(
              `❌ [OCR] Page ${pdfImage.page_number} failed:`,
              response.data.error
            );
            results.push({
              page_number: pdfImage.page_number,
              extracted_text: '',
              tokens_used: 0,
              error: response.data.error || 'Extraction failed',
            });
          }
        } catch (pageError: any) {
          console.error(
            `❌ [OCR] Page ${pdfImage.page_number} error:`,
            pageError
          );
          results.push({
            page_number: pdfImage.page_number,
            extracted_text: '',
            tokens_used: 0,
            error:
              pageError.response?.data?.detail ||
              pageError.message ||
              'Page extraction failed',
          });
        }
      }

      // Combine all pages
      const fullText = results
        .filter(r => r.extracted_text)
        .map(r => `--- Page ${r.page_number} ---\n${r.extracted_text}`)
        .join('\n\n');

      const successfulPages = results.filter(r => r.extracted_text).length;
      return {
        success: successfulPages > 0,
        total_pages: pdfImages.length,
        processed_pages: successfulPages,
        total_tokens_used: totalTokens,
        full_text: fullText,
        pages: results,
      };
    } catch (error: any) {
      console.error('❌ [OCR] Extraction failed:', error);
      console.error(
        '❌ [OCR] Error details:',
        error.response?.data || error.message
      );
      return {
        success: false,
        total_pages: pdfImages.length,
        processed_pages: 0,
        total_tokens_used: 0,
        full_text: '',
        pages: [],
        error:
          error.response?.data?.detail ||
          error.message ||
          'OCR extraction failed',
      };
    }
  }

  async extractTextFromImage(
    imageBase64: string,
    prompt: string = 'Extract all the text from this image:',
    maxTokens: number = 2000
  ): Promise<{
    success: boolean;
    extracted_text: string;
    tokens_used: number;
    error?: string;
  }> {
    try {
      const response = await apiClient.post(OCR_ENDPOINTS.EXTRACT_TEXT, {
        image_base64: imageBase64,
        prompt,
        max_tokens: maxTokens,
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ [OCR] Image extraction failed:', error);
      return {
        success: false,
        extracted_text: '',
        tokens_used: 0,
        error:
          error.response?.data?.detail ||
          error.message ||
          'OCR extraction failed',
      };
    }
  }

  async checkHealth(): Promise<{
    status: string;
    service: string;
    model: string;
    endpoint: string;
  }> {
    try {
      const response = await apiClient.get(OCR_ENDPOINTS.HEALTH);
      return response.data;
    } catch (error) {
      console.error('❌ [OCR] Health check failed:', error);
      throw error;
    }
  }
}

export const ocrService = new OCRService();
export default ocrService;
