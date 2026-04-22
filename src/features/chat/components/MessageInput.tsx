import React, { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSendMessage,
  isLoading,
  disabled = false,
  placeholder = 'Ask a question about your documents...',
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      {/* Input Textarea */}
      <textarea
        ref={textareaRef}
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading || disabled}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none border-0 bg-transparent text-sm placeholder-gray-500 focus:ring-0 outline-none"
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={isLoading || disabled || !message.trim()}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        title="Send message (Ctrl+Enter)"
      >
        {isLoading ? (
          <span className="text-xs animate-spin">⟳</span>
        ) : (
          <span>↑</span>
        )}
      </button>
    </div>
  );
}
