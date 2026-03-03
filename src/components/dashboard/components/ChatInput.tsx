import { Send } from 'lucide-react';
import React, { forwardRef } from 'react';

import { MODEL_OPTIONS, TEXTAREA_CONFIG } from '../constants';
import { adjustTextareaHeight } from '../utils/textareaUtils';

interface ChatInputProps {
  value: string;
  isLoading: boolean;
  isTourActive: boolean;
  selectedModel: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onModelChange: (model: string) => void;
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
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
    },
    ref
  ) => {
    const [showModelDropdown, setShowModelDropdown] = React.useState(false);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (showModelDropdown) {
          const target = event.target as HTMLElement;
          if (!target.closest('.model-dropdown')) {
            setShowModelDropdown(false);
          }
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showModelDropdown]);

    const handleModelSelect = (modelValue: string) => {
      onModelChange(modelValue);
      setShowModelDropdown(false);
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
          <textarea
            ref={ref}
            data-tour="chat-input"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={1}
            disabled={isTourActive}
            className={`flex-1 px-0 py-0 bg-transparent focus:outline-none resize-none overflow-y-auto text-sm sm:text-base transition-all duration-150 ease-in-out ${isTourActive ? 'cursor-not-allowed opacity-70' : ''}`}
            style={{
              minHeight: `${TEXTAREA_CONFIG.MIN_HEIGHT}px`,
              maxHeight: `${TEXTAREA_CONFIG.MAX_HEIGHT}px`,
              lineHeight: `${TEXTAREA_CONFIG.LINE_HEIGHT}px`,
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                e.preventDefault();
                onSend();
              }
            }}
            onInput={e => {
              adjustTextareaHeight(e.target as HTMLTextAreaElement);
            }}
          />

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative model-dropdown">
              <button
                onClick={() =>
                  !isTourActive && setShowModelDropdown(!showModelDropdown)
                }
                disabled={isTourActive}
                className={`p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors ${isTourActive ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  <path d="M19 3v4" />
                  <path d="M21 5h-4" />
                </svg>
              </button>

              {showModelDropdown && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    {MODEL_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        disabled={!option?.enabled}
                        onClick={() => handleModelSelect(option.value)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 cursor-pointer ${
                          selectedModel === option.value
                            ? 'bg-gray-100 text-gray-800'
                            : 'text-gray-700'
                        }`}
                      >
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                        {selectedModel === option.value && (
                          <span className="ml-auto text-gray-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onSend}
              disabled={isLoading || isTourActive || !value.trim()}
              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                isLoading || isTourActive || !value.trim()
                  ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                  : 'bg-[#6B6B6B] hover:bg-gray-800 text-white cursor-pointer'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 rounded-full border-gray-400 border-t-transparent animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';
