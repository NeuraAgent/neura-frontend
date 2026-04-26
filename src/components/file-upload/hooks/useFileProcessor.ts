import { chunkService } from '@/services/chunkService';
import ocrService from '@/services/ocrService';
import {
  uploadFile,
  FileUploadResult,
} from '@/services/s3StorageService';
import userFileService from '@/services/userFileService';
import { useUserStore } from '@/stores/userStore';
import { formatFileToMarkdown } from '@/utils/fileFormatUtils';
import { convertPDFToImages } from '@/utils/pdfToImage';

import { PROGRESS_STAGES, FILE_METADATA, UPLOAD_CONSTANTS } from '../constants';
import { extractFileId, getFileType, isPdfFile } from '../utils';

interface FileProcessorCallbacks {
  userId: string;
  isAuthenticated: boolean;
  onProgressUpdate: (fileName: string, progress: number) => void;
}

export const useFileProcessor = ({
  userId,
  isAuthenticated,
  onProgressUpdate,
}: FileProcessorCallbacks) => {
  const { setFileIds, getFileIds } = useUserStore();

  const processFile = async (file: File): Promise<FileUploadResult> => {
    const isPdf = isPdfFile(file);

    try {
      const fileContent = isPdf
        ? await processPdfFile(file, onProgressUpdate)
        : await processNonPdfFile(file, onProgressUpdate);

      const uploadResult = await uploadToS3(file, isPdf, onProgressUpdate);

      if (!uploadResult.success) {
        return uploadResult;
      }

      const fileId = extractFileId(uploadResult.s3Key);

      await chunkAndStore(
        file,
        fileContent,
        fileId,
        uploadResult,
        isPdf,
        onProgressUpdate
      );

      if (isAuthenticated) {
        await addToUserProfile(file, fileId, uploadResult, onProgressUpdate);
      }

      onProgressUpdate(file.name, PROGRESS_STAGES.PDF.COMPLETE);

      return uploadResult;
    } catch (error) {
      return {
        success: false,
        fileName: file.name,
        s3FileName: '',
        s3Key: '',
        s3Url: '',
        error: error instanceof Error ? error.message : 'Processing failed',
      };
    }
  };

  const processPdfFile = async (
    file: File,
    onProgress: (fileName: string, progress: number) => void
  ): Promise<string> => {
    onProgress(file.name, PROGRESS_STAGES.PDF.START);

    const pdfImages = await convertPDFToImages(
      file,
      UPLOAD_CONSTANTS.PDF_DPI,
      (current, total) => {
        const progress =
          PROGRESS_STAGES.PDF.START +
          Math.floor((current / total) * PROGRESS_STAGES.PDF.CONVERSION);
        onProgress(file.name, progress);
      }
    );

    onProgress(file.name, PROGRESS_STAGES.PDF.OCR_COMPLETE);

    const ocrResult = await ocrService.extractTextFromPDF(
      pdfImages.map(img => ({
        page_number: img.pageNumber,
        image_base64: img.imageBase64,
      }))
    );

    if (!ocrResult.success) {
      throw new Error(ocrResult.error || 'OCR extraction failed');
    }

    return ocrResult.full_text;
  };

  const processNonPdfFile = async (
    file: File,
    onProgress: (fileName: string, progress: number) => void
  ): Promise<string> => {
    onProgress(file.name, PROGRESS_STAGES.NON_PDF.START);
    return await formatFileToMarkdown(file);
  };

  const uploadToS3 = async (
    file: File,
    isPdf: boolean,
    onProgress: (fileName: string, progress: number) => void
  ): Promise<FileUploadResult> => {
    const uploadStart = isPdf
      ? PROGRESS_STAGES.PDF.UPLOAD_START
      : PROGRESS_STAGES.NON_PDF.UPLOAD_START;
    const uploadRange = isPdf
      ? PROGRESS_STAGES.PDF.UPLOAD_RANGE
      : PROGRESS_STAGES.NON_PDF.UPLOAD_RANGE;

    onProgress(file.name, uploadStart);

    return await uploadFile(file, progress => {
      const currentProgress =
        uploadStart + Math.floor((progress.progress / 100) * uploadRange);
      onProgress(file.name, currentProgress);
    });
  };

  const chunkAndStore = async (
    file: File,
    fileContent: string,
    fileId: string,
    uploadResult: FileUploadResult,
    isPdf: boolean,
    onProgress: (fileName: string, progress: number) => void
  ): Promise<void> => {
    const chunkProgress = isPdf
      ? PROGRESS_STAGES.PDF.CHUNKING
      : PROGRESS_STAGES.NON_PDF.CHUNKING;

    onProgress(file.name, chunkProgress);

    await chunkService.chunkAndStoreFile(fileContent, {
      fileName: uploadResult.s3FileName,
      fileId,
      userId,
      subject: FILE_METADATA.DEFAULT_SUBJECT,
      week: FILE_METADATA.DEFAULT_WEEK,
      title: file.name,
    });
  };

  const addToUserProfile = async (
    file: File,
    fileId: string,
    uploadResult: FileUploadResult,
    onProgress: (fileName: string, progress: number) => void
  ): Promise<void> => {
    onProgress(file.name, PROGRESS_STAGES.PDF.USER_PROFILE);

    try {
      await userFileService.addFile({
        fileId,
        fileName: uploadResult.s3FileName,
        originalName: file.name,
        fileType: getFileType(file),
        fileSize: file.size,
        s3Key: uploadResult.s3Key,
        s3Url: uploadResult.s3Url,
        metadata: {
          subject: FILE_METADATA.DEFAULT_SUBJECT,
          title: file.name,
          tags: FILE_METADATA.DEFAULT_TAGS,
        },
      });
      setFileIds([...getFileIds(), fileId]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      /* empty */
    }
  };

  return { processFile };
};
