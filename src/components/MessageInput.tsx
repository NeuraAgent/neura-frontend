import { Send } from 'lucide-react';
import React, { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [messageInput, setMessageInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && !disabled) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  return (
    <div className="p-4 mx-4 mb-6 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          placeholder="Ask me anything! I can solve math, write poems, explain concepts..."
          className="flex-1 px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 outline-none text-base transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !messageInput.trim()}
          className="px-6 py-3 bg-blue-500 text-white border-none rounded-lg cursor-pointer font-medium transition-colors flex items-center justify-center hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
