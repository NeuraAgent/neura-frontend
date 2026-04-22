import React from 'react';

import { ChatContainer } from '@/features/chat';
import { DocumentSelectionProvider } from '@/features/documents/DocumentSelectionContext';

export function ChatPage() {
  return (
    <DocumentSelectionProvider>
      <div className="flex flex-col gap-4 h-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Chat</h1>
          <p className="text-sm text-gray-600 mt-1">
            Chat with AI about your documents. Select documents below to use
            them as context.
          </p>
        </div>
        <ChatContainer />
      </div>
    </DocumentSelectionProvider>
  );
}
