import { Send, Image as ImageIcon, X, Plus, MoreHorizontal, ChevronRight } from 'lucide-react';
import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { adjustTextareaHeight } from '../utils/textareaUtils';

import { MODEL_OPTIONS } from '../constants';



interface ChatInputWithImagesProps {
  value: string;
  isLoading: boolean;
  isTourActive: boolean;
  selectedModel: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSend: (message: string, images?: File[]) => void;
  onModelChange: (model: string) => void;
  droppedFiles?: File[];
  onDroppedFilesHandled?: () => void;
}

export const ChatInputWithImages = forwardRef<
  HTMLTextAreaElement,
  ChatInputWithImagesProps
>(
  (
    {
      value,
      isLoading,
      isTourActive,
      selectedModel,
      placeholder,
      onChange,
      onSend,
      onModelChange,
      droppedFiles,
      onDroppedFilesHandled,
    },
    ref
  ) => {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
    const plusMenuRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Close menu on outside click
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (plusMenuRef.current && !plusMenuRef.current.contains(e.target as Node)) {
          setIsPlusMenuOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cleanup previews
    useEffect(() => {
      return () => {
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
      };
    }, []);

    // Adjust height on value change
    useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        adjustTextareaHeight(ref.current);
      }
    }, [value, ref]);

    const handleImagesChange = (files: File[]) => {
      // Cleanup old previews
      imagePreviews.forEach(url => URL.revokeObjectURL(url));

      // Create new previews
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
      setSelectedImages(files);
    };

    useEffect(() => {
      if (droppedFiles && droppedFiles.length > 0) {
        // filter images
        const imageFiles = droppedFiles.filter(f => f.type.startsWith('image/'));
        if (imageFiles.length > 0) {
          const newImages = [...selectedImages, ...imageFiles].slice(0, 3); // max 3
          handleImagesChange(newImages);
        }
        if (onDroppedFilesHandled) onDroppedFilesHandled();
      }
    }, [droppedFiles, onDroppedFilesHandled]);

    const handleRemoveImage = (index: number) => {
      URL.revokeObjectURL(imagePreviews[index]);
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
      setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = () => {
      if ((!value.trim() && selectedImages.length === 0) || isLoading) {
        return;
      }

      onSend(value.trim(), selectedImages.length > 0 ? selectedImages : undefined);

      // Cleanup
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImagePreviews([]);
      setSelectedImages([]);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        const imageFiles = files.filter(f => f.type.startsWith('image/'));
        if (imageFiles.length > 0) {
          const newImages = [...selectedImages, ...imageFiles].slice(0, 3); // max 3
          handleImagesChange(newImages);
        }
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    return (
      <div className="space-y-3">
        {/* Selected Images Preview (Compact) */}
        {imagePreviews.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {imagePreviews.map((preview, index) => (
              <div
                key={index}
                className="relative group w-16 h-16 rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div
          className={`
            bg-[#f4f4f4] rounded-[24px] border border-transparent transition-all relative
            ${isTourActive ? 'ring-4 ring-blue-500 ring-opacity-50' : ''}
            ${isLoading ? 'opacity-70' : ''}
          `}
        >
          <div className="flex items-end p-2 relative min-h-[60px]">
            {/* Plus Button with Menu (Absolute Positioned Left) */}
            <div className="absolute left-2 bottom-[10px] z-20 flex-shrink-0" ref={plusMenuRef}>
              {/* Hidden File Input outside conditional render */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                disabled={isLoading}
                className={`
                  p-2 w-10 h-10 flex items-center justify-center rounded-full transition-colors
                  ${isPlusMenuOpen || imagePreviews.length > 0
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                title="Add photos & files"
              >
                <Plus className="w-6 h-6" />
              </button>

              {/* Popover Menu */}
              {isPlusMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden text-sm">
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setIsPlusMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <ImageIcon className="w-5 h-5 text-gray-500" />
                    Add photos & files
                  </button>
                  <div className="my-1 border-t border-gray-200"></div>
                  <button className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                    <span className="flex items-center gap-3">
                      <MoreHorizontal className="w-5 h-5 text-gray-500" />
                      More
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Spacer for Plus Button Flow */}
            <div className="w-11 h-10 flex-shrink-0" aria-hidden="true" />

            {/* Textarea (Flex-1 for scrollbar at far right) */}
            <textarea
              ref={ref}
              value={value}
              onChange={e => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-gray-800 placeholder-gray-500 disabled:opacity-50 py-[10px] px-2 pr-[11.5rem]"
              style={{
                minHeight: '44px',
              }}
            />

            {/* Right Icons: Model Selector, Send Button (Absolute Positioned Right) */}
            <div className="absolute right-2 bottom-[10px] z-20 flex items-center gap-1">

              <select
                value={selectedModel}
                onChange={e => onModelChange(e.target.value)}
                disabled={isLoading}
                className="flex-shrink-0 text-sm font-medium text-gray-700 bg-white ring-1 ring-gray-200 rounded-full px-3 py-1.5 mx-1 outline-none hover:bg-gray-50 cursor-pointer transition-colors"
                title="Select Model"
              >
                {MODEL_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                onClick={handleSend}
                disabled={isLoading || (!value.trim() && selectedImages.length === 0)}
                className="flex-shrink-0 p-2 w-10 h-10 flex items-center justify-center bg-black text-white rounded-full hover:opacity-80 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                title="Send message"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-currentColor border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        {imagePreviews.length > 0 && (
          <p className="text-xs text-gray-500 text-center">
            {imagePreviews.length} image{imagePreviews.length > 1 ? 's' : ''} selected
          </p>
        )}
      </div>
    );
  }
);

ChatInputWithImages.displayName = 'ChatInputWithImages';
