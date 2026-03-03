/**
 * Dashboard Component (Refactored)
 * Main dashboard with chat interface following SOLID principles
 *
 * This is a refactored version - to use it, rename this file to Dashboard.tsx
 * and backup the original Dashboard.tsx
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import 'katex/dist/katex.min.css';

import { FloatingCreditIndicator } from '@/components/FloatingCreditIndicator';
import IntroTour from '@/components/IntroTour';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { useIntroTourStore } from '@/stores/introTourStore';
import { useUserStore } from '@/stores/userStore';

import { ChatInput } from './dashboard/components/ChatInput';
import { ChatMessage } from './dashboard/components/ChatMessage';
import { CreditWarning } from './dashboard/components/CreditWarning';
import { DashboardSidebar } from './dashboard/components/DashboardSidebar';
import { EmptyState } from './dashboard/components/EmptyState';
import { LoadingIndicator } from './dashboard/components/LoadingIndicator';
import { MobileOverlay } from './dashboard/components/MobileOverlay';
import { StreamingMessage } from './dashboard/components/StreamingMessage';
import { useClipboard } from './dashboard/hooks/useClipboard';
import { useMessageSender } from './dashboard/hooks/useMessageSender';
import { useModelSelector } from './dashboard/hooks/useModelSelector';
import { useSidebar } from './dashboard/hooks/useSidebar';
import { useSocket } from './dashboard/hooks/useSocket';
import { Message } from './dashboard/types';
import { resetTextareaHeight } from './dashboard/utils/textareaUtils';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLocale();
  const { isActive: isTourActive } = useIntroTourStore();
  const { getFileIds } = useUserStore();

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [insufficientCredits, setInsufficientCredits] = useState(false);
  const [creditError, setCreditError] = useState<string | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Refs
  const sessionIdRef = useRef(`frontend_${uuidv4()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Custom hooks
  const { isSidebarOpen, isToggleLeftMenu, toggleSidebar } = useSidebar();
  const { selectedModel, setSelectedModel } = useModelSelector();
  const { copiedIndex, copyToClipboard } = useClipboard();

  // Memoized callbacks for socket
  const handleMessageReceived = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const handleLoadingChange = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const handleStreamingChange = useCallback((streaming: boolean) => {
    setIsStreaming(streaming);
  }, []);

  const handleStreamingResponseChange = useCallback((response: string) => {
    setStreamingResponse(response);
  }, []);

  const { sendMessage, isSendingRef } = useMessageSender({
    onMessageAdd: message => setMessages(prev => [...prev, message]),
    onLoadingChange: setIsLoading,
    onCreditError: error => {
      setInsufficientCredits(true);
      setCreditError(error);
    },
  });

  useSocket({
    onMessageReceived: handleMessageReceived,
    onLoadingChange: handleLoadingChange,
    onStreamingChange: handleStreamingChange,
    onStreamingResponseChange: handleStreamingResponseChange,
    isSendingRef,
  });

  // Effects
  useEffect(() => {
    if (textareaRef.current) {
      resetTextareaHeight(textareaRef.current);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const handleModalOpen = () => setIsUploadModalOpen(true);
    const handleModalClose = () => setIsUploadModalOpen(false);

    window.addEventListener('uploadModalOpen', handleModalOpen);
    window.addEventListener('uploadModalClose', handleModalClose);

    return () => {
      window.removeEventListener('uploadModalOpen', handleModalOpen);
      window.removeEventListener('uploadModalClose', handleModalClose);
    };
  }, []);

  // Handlers
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user?.id) {
      return;
    }

    // Reset credit error
    setInsufficientCredits(false);
    setCreditError(null);

    // Store message content
    const messageContent = inputMessage.trim();

    // Clear input immediately
    setInputMessage('');
    resetTextareaHeight(textareaRef.current);

    // Send message
    await sendMessage({
      content: messageContent,
      userId: user.id,
      sessionId: sessionIdRef.current,
      fileIds: getFileIds(),
      model: selectedModel,
      userInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
  };

  const handleDismissCredit = () => {
    setInsufficientCredits(false);
    setCreditError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <IntroTour />

      <MobileOverlay isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <DashboardSidebar
        isOpen={isSidebarOpen}
        isToggleLeftMenu={isToggleLeftMenu}
        isTourActive={isTourActive}
        sources={sources}
        selectedSources={selectedSources}
        showUploadModal={showUploadModal}
        messageCount={messages.length}
        onToggle={toggleSidebar}
        onLogout={handleLogout}
        onClearConversation={handleClearConversation}
        onSourcesChange={setSelectedSources}
        onSourcesLoad={setSources}
        setShowUploadModal={setShowUploadModal}
      />

      {/* Main Content */}
      <div
        className={`relative flex-1 flex flex-col h-screen overflow-x-hidden transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'lg:ml-80' : 'lg:ml-16'}`}
      >
        <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-20">
          <FloatingCreditIndicator />
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-16 lg:pt-6">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="pb-32">
              {messages.length === 0 ? (
                <EmptyState
                  title={t('dashboard.startConversation')}
                  subtitle={t('dashboard.typeQuestion')}
                />
              ) : (
                messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    message={message}
                    index={index}
                    isCopied={copiedIndex === index}
                    onCopy={copyToClipboard}
                    copyLabel={t('chat.copy')}
                    copiedLabel={t('chat.copied')}
                  />
                ))
              )}

              {isStreaming && streamingResponse && (
                <StreamingMessage content={streamingResponse} />
              )}

              {isLoading && !streamingResponse && <LoadingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        {!isUploadModalOpen && (
          <div className="flex-shrink-0 w-full bg-gradient-to-t from-gray-50 via-gray-50 to-transparent border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
              {insufficientCredits && creditError && (
                <CreditWarning
                  error={creditError}
                  onDismiss={handleDismissCredit}
                  title={
                    t('credits.insufficientTitle') || 'Insufficient Credits'
                  }
                  purchaseLabel={
                    t('credits.purchaseMore') || 'Purchase More Credits'
                  }
                />
              )}

              <ChatInput
                ref={textareaRef}
                value={inputMessage}
                isLoading={isLoading}
                isTourActive={isTourActive}
                selectedModel={selectedModel}
                placeholder={t('dashboard.startTyping')}
                onChange={setInputMessage}
                onSend={handleSendMessage}
                onModelChange={setSelectedModel}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
