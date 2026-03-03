import { X, Upload, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

import { chunkService } from '@/services/chunkService';
import ocrService from '@/services/ocrService';
import {
  s3StorageService,
  UploadProgress,
  FileUploadResult,
} from '@/services/s3StorageService';
import userFileService from '@/services/userFileService';
import { useIntroTourStore } from '@/stores/introTourStore';
import { useUserStore } from '@/stores/userStore';
import {
  formatFileToMarkdown,
  isFileTypeSupported,
} from '@/utils/fileFormatUtils';
import { convertPDFToImages } from '@/utils/pdfToImage';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FileWithProgress {
  file: File;
  progress: UploadProgress;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, isAuthenticated, setFileIds, getFileIds } = useUserStore();
  const { isActive: isTourActive } = useIntroTourStore();
  const [selectedFiles, setSelectedFiles] = useState<FileWithProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<FileUploadResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close modal if tour becomes active
  useEffect(() => {
    if (isTourActive && isOpen && !isUploading) {
      onClose();
    }
  }, [isTourActive, isOpen, isUploading, onClose]);

  // Dispatch modal state events
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new Event('uploadModalOpen'));
    } else {
      window.dispatchEvent(new Event('uploadModalClose'));
    }
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isUploading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, isUploading, onClose]);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      if (!isFileTypeSupported(file)) {
        alert(
          `File ${file.name} is not supported. Only DOCX, PDF, TXT, and MD files are allowed.`
        );
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const filesWithProgress: FileWithProgress[] = validFiles.map(file => ({
      file,
      progress: {
        fileName: file.name,
        progress: 0,
        status: 'uploading' as const,
      },
    }));

    setSelectedFiles(filesWithProgress);
    setUploadResults([]);

    // Auto-start upload
    setTimeout(() => {
      startUpload(filesWithProgress);
    }, 100);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files);
    const validFiles = files.filter(file => {
      if (!isFileTypeSupported(file)) {
        alert(
          `File ${file.name} is not supported. Only DOCX, PDF, TXT, and MD files are allowed.`
        );
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const filesWithProgress: FileWithProgress[] = validFiles.map(file => ({
      file,
      progress: {
        fileName: file.name,
        progress: 0,
        status: 'uploading' as const,
      },
    }));

    setSelectedFiles(filesWithProgress);
    setUploadResults([]);

    // Auto-start upload
    setTimeout(() => {
      startUpload(filesWithProgress);
    }, 100);
  };

  const startUpload = async (filesToUpload: FileWithProgress[]) => {
    if (filesToUpload.length === 0) return;

    setIsUploading(true);
    setUploadResults([]);

    try {
      const results: FileUploadResult[] = [];

      // Process each file
      for (const fileWithProgress of filesToUpload) {
        const file = fileWithProgress.file;
        const isPdf = file.name.toLowerCase().endsWith('.pdf');

        try {
          let fileContent: string;
          let fileId: string;

          if (isPdf) {
            // PDF: Use OCR API
            setSelectedFiles(prev =>
              prev.map(f =>
                f.file.name === file.name
                  ? {
                      ...f,
                      progress: {
                        ...f.progress,
                        progress: 10,
                        status: 'uploading' as const,
                      },
                    }
                  : f
              )
            );

            // Convert PDF to images
            const pdfImages = await convertPDFToImages(
              file,
              150,
              (current, total) => {
                const progress = 10 + Math.floor((current / total) * 30);
                setSelectedFiles(prev =>
                  prev.map(f =>
                    f.file.name === file.name
                      ? {
                          ...f,
                          progress: {
                            ...f.progress,
                            progress,
                            status: 'uploading' as const,
                          },
                        }
                      : f
                  )
                );
              }
            );

            // Extract text using OCR
            setSelectedFiles(prev =>
              prev.map(f =>
                f.file.name === file.name
                  ? {
                      ...f,
                      progress: {
                        ...f.progress,
                        progress: 40,
                        status: 'uploading' as const,
                      },
                    }
                  : f
              )
            );

            const ocrResult = await ocrService.extractTextFromPDF(
              pdfImages.map(img => ({
                page_number: img.pageNumber,
                image_base64: img.imageBase64,
              }))
            );

            if (!ocrResult.success) {
              results.push({
                success: false,
                fileName: file.name,
                s3FileName: '',
                s3Key: '',
                s3Url: '',
                error: ocrResult.error || 'OCR extraction failed',
              });
              continue;
            }

            fileContent = ocrResult.full_text;
          } else {
            // Non-PDF: Use legacy formatFileToMarkdown
            setSelectedFiles(prev =>
              prev.map(f =>
                f.file.name === file.name
                  ? {
                      ...f,
                      progress: {
                        ...f.progress,
                        progress: 20,
                        status: 'uploading' as const,
                      },
                    }
                  : f
              )
            );

            fileContent = await formatFileToMarkdown(file);
          }

          // Upload file to S3
          const uploadProgress = isPdf ? 60 : 40;
          setSelectedFiles(prev =>
            prev.map(f =>
              f.file.name === file.name
                ? {
                    ...f,
                    progress: {
                      ...f.progress,
                      progress: uploadProgress,
                      status: 'uploading' as const,
                    },
                  }
                : f
            )
          );

          const uploadResult = await s3StorageService.uploadFile(
            file,
            progress => {
              const currentProgress =
                uploadProgress + Math.floor((progress.progress / 100) * 20);
              setSelectedFiles(prev =>
                prev.map(f =>
                  f.file.name === file.name
                    ? {
                        ...f,
                        progress: {
                          ...f.progress,
                          progress: currentProgress,
                          status: 'uploading' as const,
                        },
                      }
                    : f
                )
              );
            }
          );

          if (!uploadResult.success) {
            results.push(uploadResult);
            continue;
          }

          // eslint-disable-next-line prefer-const
          fileId =
            uploadResult.s3Key
              .split('/')
              .pop()
              ?.split('_sha')[1]
              ?.split('sha')[0] || uploadResult.s3Key;

          // Chunk and store to VectorDB
          const chunkProgress = isPdf ? 80 : 70;
          setSelectedFiles(prev =>
            prev.map(f =>
              f.file.name === file.name
                ? {
                    ...f,
                    progress: {
                      ...f.progress,
                      progress: chunkProgress,
                      status: 'uploading' as const,
                    },
                  }
                : f
            )
          );

          const chunkResult = await chunkService.chunkAndStoreFile(
            fileContent,
            {
              fileName: uploadResult.s3FileName,
              fileId: fileId,
              userId: user?.id || 'anonymous',
              subject: 'Uploaded File',
              week: 'week01',
              title: file.name,
            }
          );

          if (!chunkResult?.success) {
            console.error(
              `❌ Failed to chunk file ${file.name}:`,
              chunkResult.error
            );
          }

          // Add file to user profile
          setSelectedFiles(prev =>
            prev.map(f =>
              f.file.name === file.name
                ? {
                    ...f,
                    progress: {
                      ...f.progress,
                      progress: 90,
                      status: 'uploading' as const,
                    },
                  }
                : f
            )
          );

          if (isAuthenticated && user) {
            try {
              const getFileType = (file: File): string => {
                const extension = file.name.split('.').pop()?.toLowerCase();
                return extension || 'unknown';
              };

              await userFileService.addFile({
                fileId,
                fileName: uploadResult.s3FileName,
                originalName: file.name,
                fileType: getFileType(file),
                fileSize: file.size,
                s3Key: uploadResult.s3Key,
                s3Url: uploadResult.s3Url,
                metadata: {
                  subject: 'Uploaded File',
                  title: file.name,
                  tags: 'uploaded',
                },
              });
              setFileIds([...getFileIds(), fileId]);
            } catch (userFileError) {
              console.error(
                `⚠️ Failed to add file ${file.name} to user profile:`,
                userFileError
              );
            }
          }

          // Complete
          setSelectedFiles(prev =>
            prev.map(f =>
              f.file.name === file.name
                ? {
                    ...f,
                    progress: {
                      ...f.progress,
                      progress: 100,
                      status: 'completed' as const,
                    },
                  }
                : f
            )
          );

          results.push(uploadResult);
        } catch (error) {
          console.error(`Failed to process file ${file.name}:`, error);
          results.push({
            success: false,
            fileName: file.name,
            s3FileName: '',
            s3Key: '',
            s3Url: '',
            error: error instanceof Error ? error.message : 'Processing failed',
          });
        }
      }

      setUploadResults(results);

      // Show success message and close modal after a delay
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFiles([]);
      setUploadResults([]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Upload Files
          </h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            title="Close (ESC)"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* File Drop Zone */}
        <div
          className="border-2 border-dashed border-gray-200 rounded-2xl p-8 sm:p-12 text-center mb-6 hover:border-gray-300 hover:bg-gray-50/50 transition-all cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload files by clicking or dragging and dropping"
        >
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <p className="text-base sm:text-lg font-medium text-gray-700 mb-1">
              Drag & drop files here
            </p>
            <p className="text-sm text-gray-500 mb-3">or click to browse</p>
            <p className="text-xs text-gray-400">
              Supported: PDF, DOCX, TXT, MD
            </p>
          </div>
          <input
            id="file-upload-input"
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.txt,.md"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
          />
        </div>

        {/* Progress Bars */}
        {isUploading && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">
                Uploading...
              </h3>
              <Loader className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
            <div className="space-y-3">
              {selectedFiles.map((fileWithProgress, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 truncate flex-1 mr-4">
                      {fileWithProgress.file.name}
                    </span>
                    <span className="text-gray-500 font-medium">
                      {fileWithProgress.progress.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${fileWithProgress.progress.progress}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Results */}
        {uploadResults.length > 0 && !isUploading && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {uploadResults.filter(r => r.success).length} of{' '}
              {uploadResults.length} files uploaded
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {uploadResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl flex items-center space-x-3 ${
                    result.success
                      ? 'bg-green-50/50 border border-green-100'
                      : 'bg-red-50/50 border border-red-100'
                  }`}
                >
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        result.success ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      {result.fileName}
                    </p>
                    {result.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {result.error}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          {uploadResults.length > 0 && !isUploading ? (
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 font-medium transition-colors"
            >
              Done
            </button>
          ) : (
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {isUploading ? 'Uploading...' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
