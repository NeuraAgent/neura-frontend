import React, { useState, useCallback, useMemo } from 'react';

import { useABAC } from '../../abac/ABACContext';
import { useDocumentSelection } from '../../documents/DocumentSelectionContext';
import { generateMockResponse } from '../chatService';
import type { ChatMessage } from '../types';

import { DocumentSelector } from './DocumentSelector';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';

export function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedDocumentIds } = useDocumentSelection();
  const { accessibleDocuments } = useABAC();

  // Get selected documents
  const selectedDocuments = useMemo(
    () =>
      accessibleDocuments.filter(doc => selectedDocumentIds.includes(doc.id)),
    [accessibleDocuments, selectedDocumentIds]
  );

  // Handle sending a message
  const handleSendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isLoading) return;

      // Check if documents are selected
      if (selectedDocumentIds.length === 0) {
        alert('Please select at least one document to chat about');
        return;
      }

      // Add user message
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMsg]);
      setIsLoading(true);

      try {
        // Generate mock response
        const { content, citations } = await generateMockResponse(
          userMessage,
          selectedDocuments
        );

        // Add AI response
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content,
          citations,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMsg]);
      } catch (error) {
        console.error('Chat error:', error);
        const errorMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content:
            'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedDocumentIds, selectedDocuments, isLoading]
  );

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Document Selector */}
      <DocumentSelector selectedCount={selectedDocumentIds.length} />

      {/* Chat Area */}
      <div className="flex flex-1 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>

        {/* Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={selectedDocumentIds.length === 0}
          placeholder={
            selectedDocumentIds.length === 0
              ? 'Select documents first to start chatting...'
              : 'Ask a question about your documents...'
          }
        />
      </div>
    </div>
  );
}
