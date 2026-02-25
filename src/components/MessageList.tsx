import React from 'react';

import { ChatMessage } from '@/types';

interface MessageListProps {
  messages: ChatMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
      {messages.map(message => (
        <div key={message.message_id} className="space-y-4">
          {/* User Message */}
          {message.user_input && (
            <div className="flex justify-end mb-6">
              <div className="max-w-[85%] bg-gray-100 text-gray-800 rounded-3xl rounded-br-md px-5 py-4 shadow-sm border border-gray-200">
                {message.user_input}
              </div>
            </div>
          )}

          {/* Agent Response */}
          {message.agent_response && (
            <div className="mb-6">
              <div className="max-w-[85%] bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-3xl rounded-bl-md px-5 py-4 shadow-sm border border-gray-200 dark:border-gray-600">
                {message.agent_response}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
