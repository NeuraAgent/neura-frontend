import { X, Image as ImageIcon, Upload } from 'lucide-react';
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
}

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_MB = 10;

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesChange,
  maxFiles = 5,
  maxSizeMB = MAX_SIZE_MB,
}) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, []);

  // Notify parent of changes
  useEffect(() => {
    const validFiles = images
      .filter(img => !img.error && img.uploaded)
      .map(img => img.file);
    onImagesChange(validFiles);
  }, [images, onImagesChange]);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Invalid file type. Only JPG, PNG, WebP, and GIF are allowed.';
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File too large. Maximum size is ${maxSizeMB}MB.`;
    }
    return null;
  };

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remainingSlots = maxFiles - images.length;

      if (remainingSlots <= 0) {
        return;
      }

      const filesToAdd = fileArray.slice(0, remainingSlots);
      const newImages: ImageFile[] = [];

      filesToAdd.forEach(file => {
        const error = validateFile(file);
        const id = `${Date.now()}-${Math.random()}`;

        newImages.push({
          id,
          file,
          preview: URL.createObjectURL(file),
          uploading: false,
          uploaded: !error,
          error: error || undefined,
        });
      });

      setImages(prev => [...prev, ...newImages]);
    },
    [images.length, maxFiles, maxSizeMB]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleRemove = (id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        processFiles(imageFiles);
      }
    },
    [processFiles]
  );

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50 scale-[1.02]'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${images.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          onChange={handleFileSelect}
          disabled={images.length >= maxFiles}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
            {isDragging ? (
              <Upload className="w-6 h-6 text-blue-600 animate-bounce" />
            ) : (
              <ImageIcon className="w-6 h-6 text-blue-600" />
            )}
          </div>

          <p className="text-sm font-medium text-gray-700 mb-1">
            {isDragging ? 'Drop images here' : 'Click or drag images to upload'}
          </p>
          <p className="text-xs text-gray-500">
            JPG, PNG, WebP, GIF up to {maxSizeMB}MB ({images.length}/{maxFiles})
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Tip: You can also paste images with Ctrl+V
          </p>
        </div>
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map(img => (
            <div
              key={img.id}
              className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white"
            >
              <div className="aspect-square">
                <img
                  src={img.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all">
                <button
                  onClick={() => handleRemove(img.id)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Indicators */}
              {img.uploading && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              )}

              {img.error && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-1 text-center">
                  {img.error}
                </div>
              )}

              {img.uploaded && !img.error && (
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
