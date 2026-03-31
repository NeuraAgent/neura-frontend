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
import { useLogout } from '@/hooks/useLogout';
import { ocrService } from '@/services/ocrService';
import { useIntroTourStore } from '@/stores/introTourStore';
import { useUserStore } from '@/stores/userStore';

import { ChatInputWithImages } from './dashboard/components/ChatInputWithImages';
import { ChatMessage } from './dashboard/components/ChatMessage';
import { CreditWarning } from './dashboard/components/CreditWarning';
import { DashboardSidebar } from './dashboard/components/DashboardSidebar';
import { EmptyState } from './dashboard/components/EmptyState';
import { LoadingIndicator } from './dashboard/components/LoadingIndicator';
import { MobileOverlay } from './dashboard/components/MobileOverlay';
import { StreamingMessage } from './dashboard/components/StreamingMessage';
import { ThinkingStatus } from './dashboard/components/ThinkingStatus';
import { useClipboard } from './dashboard/hooks/useClipboard';
import { useMessageSender } from './dashboard/hooks/useMessageSender';
import { useModelSelector } from './dashboard/hooks/useModelSelector';
import { useSidebar } from './dashboard/hooks/useSidebar';
import { useSocket } from './dashboard/hooks/useSocket';
import { Message } from './dashboard/types';
import { resetTextareaHeight } from './dashboard/utils/textareaUtils';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { logout } = useLogout();
  const { t } = useLocale();
  const { isActive: isTourActive } = useIntroTourStore();
  const { getFileIds } = useUserStore();

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [insufficientCredits, setInsufficientCredits] = useState(false);
  const [creditError, setCreditError] = useState<string | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

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

  const handleThinkingMessageChange = useCallback((message: string) => {
    setThinkingMessage(message);
  }, []);

  const { sendMessage, isSendingRef } = useMessageSender({
    onMessageAdd: message => setMessages(prev => [...prev, message]),
    onMessageUpdate: (id, updates) =>
      setMessages(prev =>
        prev.map(msg => (msg.id === id ? { ...msg, ...updates } : msg))
      ),
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
    onThinkingMessageChange: handleThinkingMessageChange,
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

  const handleSendMessage = async (message: string, images?: File[]) => {
    if ((!message.trim() && !images?.length) || isLoading || !user?.id) {
      return;
    }

    // Reset credit error
    setInsufficientCredits(false);
    setCreditError(null);

    // Prepare optimistic display message and images
    const displayContent = message.trim();
    const initialImages = images?.map(file => ({
      url: URL.createObjectURL(file), // create local preview link
      status: 'processing' as const,
    }));

    // Clear input immediately for prompt UI response
    setInputMessage('');
    resetTextareaHeight(textareaRef.current);

    // The backend processing payload handles the OCR flow without blocking the UI rendering
    const getBackendContent = async () => {
      let finalMessage = message.trim();

      if (images && images.length > 0) {
        try {
          const extractedTexts: string[] = [];

          for (const file of images) {
            const base64 = await fileToBase64(file);
            const ocrResponse = await ocrService.extractTextFromImage(base64);
            if (ocrResponse.success && ocrResponse.extracted_text) {
              extractedTexts.push(ocrResponse.extracted_text);
            } else {
              console.error(
                `[OCR Error for image ${file.name}]:`,
                ocrResponse.error
              );
            }
          }

          if (extractedTexts.length > 0) {
            const combinedOcrText = extractedTexts.join('\n\n---\n\n');
            const instructions = `\n\nInstructions:\n- Use OCR content as context\n- Do not mention "OCR" or "extracted text"\n- Answer naturally as if you understood the image`;

            if (message.trim()) {
              finalMessage = `${message.trim()}\n\n[Extracted Text from Images (DO NOT SHOW TO USER)]:\n${combinedOcrText}${instructions}`;
            } else {
              finalMessage = `[Extracted Text from Images (DO NOT SHOW TO USER)]:\n${combinedOcrText}${instructions}`;
            }
          }
        } catch (error) {
          console.error('[OCR System Error]:', error);
        }
      }
      return finalMessage;
    };

    // Send message to the channel (this instantly adds the UI message, THEN runs getBackendContent)
    await sendMessage({
      content: message, // Used as baseline if getBackendContent isn't evaluated
      displayContent,
      images: initialImages,
      getBackendContent,
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

  const handleLogout = () => {
    logout('User clicked logout button');
  };

  const handleClearConversation = () => {
    setMessages([]);
  };

  const handleDismissCredit = () => {
    setInsufficientCredits(false);
    setCreditError(null);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Using relatedTarget to prevent flickering when hovering over children
    if (!e.relatedTarget) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setDroppedFiles(files);
    }
  }, []);

  return (
    <div
      className="min-h-screen bg-gray-50 flex relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-500/10 backdrop-blur-sm border-2 border-dashed border-blue-500 rounded-lg m-4 pointer-events-none transition-all">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Drop images here
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Add images to your message automatically
            </p>
          </div>
        </div>
      )}

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

              {thinkingMessage && !streamingResponse && (
                <>
                  <ThinkingStatus message={thinkingMessage} />
                </>
              )}

              {isStreaming && streamingResponse && (
                <>
                  <StreamingMessage content={streamingResponse} />
                </>
              )}

              {isLoading && !streamingResponse && !thinkingMessage && (
                <>
                  <LoadingIndicator />
                </>
              )}

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

              <ChatInputWithImages
                ref={textareaRef}
                value={inputMessage}
                isLoading={isLoading}
                isTourActive={isTourActive}
                selectedModel={selectedModel}
                placeholder={t('dashboard.startTyping')}
                onChange={setInputMessage}
                onSend={handleSendMessage}
                onModelChange={setSelectedModel}
                droppedFiles={droppedFiles}
                onDroppedFilesHandled={() => setDroppedFiles([])}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
