import React, { useRef } from 'react';

import { FileWithProgress } from '../types';
import { validateFiles, createFilesWithProgress } from '../utils';

interface UseFileSelectionProps {
  isUploading: boolean;
  onFilesSelected: (files: FileWithProgress[]) => void;
}

export const useFileSelection = ({
  isUploading,
  onFilesSelected,
}: UseFileSelectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    processFiles(files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const validFiles = validateFiles(files);
    if (validFiles.length === 0) return;

    const filesWithProgress = createFilesWithProgress(validFiles);
    onFilesSelected(filesWithProgress);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return {
    fileInputRef,
    handleFileSelect,
    handleDragOver,
    handleDrop,
    triggerFileInput,
  };
};
