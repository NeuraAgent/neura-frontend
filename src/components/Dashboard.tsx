import {
  User,
  Settings,
  LogOut,
  FileText,
  Send,
  Copy,
  Check,
  PanelLeft,
  PanelRight,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { CodeBlock } from 'react-code-blocks';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import { v4 as uuidv4 } from 'uuid';

import { FloatingCreditIndicator } from '@/components/FloatingCreditIndicator';
import IntroTour from '@/components/IntroTour';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Logo from '@/components/Logo';
import SourcesManager from '@/components/SourcesManager';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { paymentService } from '@/services/paymentService';
import { socketService } from '@/services/socketService';
import { useIntroTourStore } from '@/stores/introTourStore';
import { useUserStore } from '@/stores/userStore';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

const MODEL_OPTIONS = [
  {
    value: 'gemini-2.5-flash',
    label: 'Neura 1.0 Flash',
    icon: '✨',
    enabled: true,
  },
];

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLocale();
  const { isActive: isTourActive } = useIntroTourStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [, setIsSocketConnected] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sources, setSources] = useState<any[]>([]);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(
    null
  );
  const { getFileIds } = useUserStore();
  const [isToggleLeftMenu, setIsToggleLeftMenu] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    // Load from localStorage or default to qwen
    return localStorage.getItem('selectedModel') || MODEL_OPTIONS[0].value;
  });
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [insufficientCredits, setInsufficientCredits] = useState(false);
  const [creditError, setCreditError] = useState<string | null>(null);

  const sessionIdRef = useRef(`frontend_${uuidv4()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Validate cached model on first load
  useEffect(() => {
    const cachedModel = localStorage.getItem('selectedModel');
    if (cachedModel) {
      // Check if cached model exists in current MODEL_OPTIONS
      const isValidModel = MODEL_OPTIONS.some(
        option => option.value === cachedModel
      );
      if (!isValidModel) {
        // If cached model is not in the list, reset to first available model
        const defaultModel = MODEL_OPTIONS[0].value;
        setSelectedModel(defaultModel);
        localStorage.setItem('selectedModel', defaultModel);
      }
    }
  }, []); // Run only once on mount

  // Save selected model to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedModel', selectedModel);
  }, [selectedModel]);

  // Initialize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
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

  // Listen for upload modal state changes
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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Socket.IO connection and event handlers
  useEffect(() => {
    const initSocket = async () => {
      try {
        await socketService.connect();
        setIsSocketConnected(true);

        // Setup event listeners
        socketService.onExecutionStarted(() => {
          setIsStreaming(true);
          setStreamingResponse('');
        });

        socketService.onAgentThinking(() => {
          // Simplified - no verbose status updates
        });

        socketService.onToolCalling(() => {
          // Simplified - no verbose status updates
        });

        socketService.onResponseChunk(data => {
          setStreamingResponse(prev => prev + data.chunk);
        });

        socketService.onExecutionComplete(data => {
          setIsLoading(false);
          setIsStreaming(false);

          // Use streaming response if available, otherwise fallback to complete response
          const aiResponse =
            streamingResponse ||
            data.result.llmOutput ||
            'No response received';
          const assistantMessage: Message = {
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date().toLocaleTimeString(),
          };
          setMessages(prev => [...prev, assistantMessage]);

          // Clear streaming response for next message
          setStreamingResponse('');

          // Trigger credit balance refresh after message completion
          window.dispatchEvent(new CustomEvent('refreshCreditBalance'));
        });

        socketService.onExecutionError(data => {
          console.error('❌ Execution error:', data.error);
          setIsLoading(false);
          setIsStreaming(false);

          const errorMessage: Message = {
            role: 'assistant',
            content: `Error: ${data.error}`,
            timestamp: new Date().toLocaleTimeString(),
          };
          setMessages(prev => [...prev, errorMessage]);

          // Clear streaming response on error
          setStreamingResponse('');
        });
      } catch (error) {
        console.error('Failed to connect to Socket.IO:', error);
        setIsSocketConnected(false);
      }
    };

    initSocket();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleLogout = async () => {
    try {
      socketService.disconnect();
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
  };

  const handleCopyMessage = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageIndex(index);
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedMessageIndex(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const toggleSidebar = () => {
    if (!isToggleLeftMenu) {
      setIsToggleLeftMenu(true);
    }

    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !isLoading) {
      if (!user?.id) {
        console.error('User ID not found');
        return;
      }

      // Reset credit error state
      setInsufficientCredits(false);
      setCreditError(null);

      // Check credits before sending (estimate 5 credits for a typical request)
      try {
        const creditCheck = await paymentService.checkCredits(5);
        if (!creditCheck.hasCredits) {
          setInsufficientCredits(true);
          setCreditError(
            `Insufficient credits. You have ${creditCheck.available} credits but need at least ${creditCheck.required}.`
          );
          return;
        }
      } catch (error) {
        console.warn('Failed to check credits, proceeding anyway:', error);
        // Continue even if credit check fails - let backend handle it
      }

      const userMessage: Message = {
        role: 'user',
        content: inputMessage,
        timestamp: new Date().toLocaleTimeString(),
      };

      // Add user message immediately
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      // Clear input and reset textarea height
      setInputMessage('');
      // Reset textarea height to single line
      if (textareaRef.current) {
        textareaRef.current.style.height = '24px';
        textareaRef.current.style.overflowY = 'hidden';
      }

      try {
        // Send via Socket.IO
        await socketService.execute({
          version: 'v1.0',
          query: inputMessage,
          session_id: sessionIdRef.current,
          user_id: user.id,
          channel_id: 'frontend_channel',
          available_files: getFileIds(),
          llm_model: selectedModel,
          user_info: {
            firstName: user.firstName,
            lastName: user.lastName,
          },
        });
      } catch (error) {
        console.error('Failed to send message:', error);
        setIsLoading(false);

        // Check if it's a credit error
        const errorMessage = String(error);
        if (
          errorMessage.includes('credit') ||
          errorMessage.includes('insufficient')
        ) {
          setInsufficientCredits(true);
          setCreditError('Insufficient credits to process this request.');
        }

        const errorMsg: Message = {
          role: 'assistant',
          content: `Failed to send message: ${error}`,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    }
  };

  const handleSourcesChange = (sources: string[]) => {
    setSelectedSources(sources);
  };

  const handleModelSelect = (modelValue: string) => {
    setSelectedModel(modelValue);
    setShowModelDropdown(false);
  };

  // File upload functionality removed for cleaner UI

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Intro Tour */}
      <IntroTour />

      {/* Mobile Overlay - Show when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
          onKeyDown={e => {
            if (e.key === 'Escape') toggleSidebar();
          }}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar with animation - Fixed position on desktop, overlay on mobile */}
      <div
        className={`fixed top-0 bottom-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out overflow-hidden z-30
          ${isSidebarOpen ? 'left-0 w-70 sm:w-80' : '-left-full lg:left-0 lg:w-16'}
          lg:left-4 lg:top-4 lg:bottom-4 lg:rounded-md lg:border`}
      >
        {isSidebarOpen ? (
          <>
            {/* Full Sidebar View */}
            {/* Sidebar Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <Logo variant="icon" size="md" />
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <button
                    data-tour="settings-button"
                    onClick={() =>
                      !isTourActive && setShowUserMenu(!showUserMenu)
                    }
                    disabled={isTourActive}
                    className={`w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center ${isTourActive ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                  </button>
                  <div className="relative">
                    <button
                      className={`flex items-center text-gray-600 p-1 ${isTourActive ? 'cursor-not-allowed opacity-70' : ''}`}
                      onClick={() => !isTourActive && toggleSidebar()}
                      disabled={isTourActive}
                      title="Collapse sidebar"
                    >
                      <PanelLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
                        {/* Language Switcher */}
                        <div className="px-3 sm:px-4 py-2 border-b border-gray-100">
                          <div className="text-xs text-gray-500 mb-2">
                            {t('nav.language')}
                          </div>
                          <LanguageSwitcher />
                        </div>

                        <Link
                          to="/profile"
                          className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                          {t('nav.profile')}
                        </Link>
                        <Link
                          to="/neura/settings"
                          className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                          {t('nav.settings')}
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                          {t('nav.signout')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sources Section */}
            <SourcesManager
              isToggleLeftMenu={isToggleLeftMenu}
              selectedSources={selectedSources}
              showUploadModal={showUploadModal}
              setShowUploadModal={setShowUploadModal}
              onSourcesChange={handleSourcesChange}
              onSourcesLoad={loadedSources => setSources(loadedSources)}
            />

            <div className="flex justify-center px-3">
              <button
                onClick={() => !isTourActive && handleClearConversation()}
                disabled={isTourActive}
                className={`text-xs sm:text-sm text-gray-500 hover:text-gray-700 px-4 sm:px-8 py-2.5 sm:py-[12px] rounded mb-4 sm:mb-[30px] bg-[#F8F7F6] transition-colors w-full sm:w-auto ${isTourActive ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                {t('dashboard.clearConversation')} ({messages.length})
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center py-4 space-y-4 h-full">
              {/* Logo Icon */}
              <Logo variant="icon" size="md" />

              {/* Toggle Button */}
              <button
                onClick={() => !isTourActive && toggleSidebar()}
                disabled={isTourActive}
                className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${isTourActive ? 'cursor-not-allowed opacity-70' : ''}`}
                title="Expand sidebar"
              >
                <PanelRight className="w-5 h-5 text-gray-600" />
              </button>

              {/* Add File Button */}
              {/* <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                title={t('dashboard.addFiles')}
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </button> */}

              {/* File Icons - Show first few files */}
              <div className="flex-1 overflow-y-auto space-y-2 w-full flex flex-col items-center">
                {sources.slice(0, 5).map(source => (
                  <div
                    key={source.id}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    title={source.name}
                  >
                    <FileText className="w-5 h-5 text-gray-500" />
                  </div>
                ))}
              </div>

              {/* Clear Conversation Button */}
              <button
                onClick={() => !isTourActive && handleClearConversation()}
                disabled={isTourActive}
                className={`p-2 hover:bg-gray-100 rounded-lg transition-colors mt-auto ${isTourActive ? 'cursor-not-allowed opacity-70' : ''}`}
                title="Clear conversation"
              >
                <Trash2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu Button - Show when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-20 p-2.5 bg-white border border-gray-200 rounded-lg shadow-sm lg:hidden"
        >
          <PanelRight className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Main Content - ChatGPT-style layout with flex column */}
      <div
        className={`relative flex-1 flex flex-col h-screen overflow-x-hidden transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'lg:ml-80' : 'lg:ml-16'}`}
      >
        {/* Floating Credit Indicator - Top Right */}
        <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-20">
          <FloatingCreditIndicator />
        </div>

        {/* Scrollable Messages Container - Takes remaining space */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-16 lg:pt-6">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
            {/* Conversation Display */}
            <div className="pb-32">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="text-center py-8 sm:py-12 px-4">
                    <div className="text-gray-500 mb-4">
                      <FileText className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-40" />
                      <p className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
                        {t('dashboard.startConversation')}
                      </p>
                      <p className="text-sm sm:text-base text-gray-500">
                        {t('dashboard.typeQuestion')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className="w-full">
                    <div className="max-w-3xl mx-auto px-4 py-6">
                      <div
                        className={`flex items-start gap-3 ${
                          message.role === 'user' ? 'justify-end' : ''
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                            <span className="text-xs text-white font-bold">
                              AI
                            </span>
                          </div>
                        )}
                        <div
                          className={
                            message.role === 'user'
                              ? 'max-w-[70%]'
                              : 'flex-1 min-w-0 max-w-[85%]'
                          }
                        >
                          {message.role === 'user' ? (
                            <div className="bg-[#2D2D2D] text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm">
                              <p className="whitespace-pre-wrap text-[15px] leading-relaxed m-0">
                                {message.content}
                              </p>
                            </div>
                          ) : (
                            <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm border border-gray-100 text-gray-800">
                              <div className="prose prose-sm max-w-none break-words">
                                <ReactMarkdown
                                  remarkPlugins={[remarkMath]}
                                  rehypePlugins={[rehypeKatex]}
                                  components={{
                                    code({
                                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                      // @ts-ignore
                                      _node,
                                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                      // @ts-ignore
                                      inline,
                                      className,
                                      children,
                                      ...props
                                    }) {
                                      const match = /language-(\w+)/.exec(
                                        className || ''
                                      );
                                      const language = match ? match[1] : '';

                                      return !inline && language ? (
                                        <CodeBlock
                                          text={String(children).replace(
                                            /\n$/,
                                            ''
                                          )}
                                          language={language}
                                          showLineNumbers={true}
                                          theme="dracula"
                                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                          // @ts-ignore
                                          wrapLines={true}
                                        />
                                      ) : (
                                        <code className={className} {...props}>
                                          {children}
                                        </code>
                                      );
                                    },
                                  }}
                                >
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-50">
                                <button
                                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                                  onClick={() =>
                                    handleCopyMessage(message.content, index)
                                  }
                                  title={
                                    copiedMessageIndex === index
                                      ? t('chat.copied')
                                      : t('chat.copy')
                                  }
                                >
                                  {copiedMessageIndex === index ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Streaming Response Display */}
              {isStreaming && streamingResponse && (
                <div className="w-full">
                  <div className="max-w-3xl mx-auto px-4 py-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                        <span className="text-xs text-white font-bold">AI</span>
                      </div>
                      <div className="flex-1 min-w-0 max-w-[85%]">
                        <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm border border-gray-100 text-gray-800">
                          <div className="prose prose-sm max-w-none break-words">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                              components={{
                                code({
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore
                                  _node,
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore
                                  inline,
                                  className,
                                  children,
                                  ...props
                                }) {
                                  const match = /language-(\w+)/.exec(
                                    className || ''
                                  );
                                  const language = match ? match[1] : '';

                                  return !inline && language ? (
                                    <CodeBlock
                                      text={String(children).replace(/\n$/, '')}
                                      language={language}
                                      showLineNumbers={true}
                                      theme="dracula"
                                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                      // @ts-ignore
                                      wrapLines={true}
                                    />
                                  ) : (
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                            >
                              {streamingResponse}
                            </ReactMarkdown>
                          </div>
                          {/* Typing indicator */}
                          <div className="flex items-center mt-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.1s' }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.2s' }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Minimal Loading indicator - ChatGPT style */}
              {isLoading && !streamingResponse && (
                <div className="w-full">
                  <div className="max-w-3xl mx-auto px-4 py-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                        <span className="text-xs text-white font-bold">AI</span>
                      </div>
                      <div className="flex-1 min-w-0 max-w-[85%]">
                        <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm border border-gray-100 text-gray-800">
                          {/* Simple animated dots - aligned with text baseline */}
                          <div className="flex items-center h-6">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.1s' }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.2s' }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Fixed Input Area - Stable layout, never changes */}
        {!isUploadModalOpen && (
          <div className="flex-shrink-0 w-full bg-gradient-to-t from-gray-50 via-gray-50 to-transparent border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
              {/* Insufficient Credits Warning */}
              {insufficientCredits && creditError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">
                      {t('credits.insufficientTitle') || 'Insufficient Credits'}
                    </p>
                    <p className="text-sm text-red-700 mt-1">{creditError}</p>
                    <button
                      onClick={() => {
                        setInsufficientCredits(false);
                        setCreditError(null);
                      }}
                      className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline"
                    >
                      {t('credits.purchaseMore') || 'Purchase More Credits'} →
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setInsufficientCredits(false);
                      setCreditError(null);
                    }}
                    className="text-red-400 hover:text-red-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
                  <textarea
                    ref={textareaRef}
                    data-tour="chat-input"
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    placeholder={t('dashboard.startTyping')}
                    rows={1}
                    disabled={isTourActive}
                    className={`flex-1 px-0 py-0 bg-transparent focus:outline-none resize-none overflow-y-auto text-sm sm:text-base transition-all duration-150 ease-in-out ${isTourActive ? 'cursor-not-allowed opacity-70' : ''}`}
                    style={{
                      minHeight: '24px',
                      maxHeight: '200px',
                      lineHeight: '24px',
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    onInput={e => {
                      const target = e.target as HTMLTextAreaElement;

                      // Reset height to auto to allow shrinking
                      target.style.height = 'auto';

                      // Calculate new height based on content
                      const newHeight = Math.min(target.scrollHeight, 200);
                      target.style.height = newHeight + 'px';

                      // Show scrollbar only when max height is reached
                      if (target.scrollHeight > 200) {
                        target.style.overflowY = 'auto';
                      } else {
                        target.style.overflowY = 'hidden';
                      }
                    }}
                  />

                  {/* Right side controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Model Selector Button */}
                    <div className="relative model-dropdown">
                      <button
                        onClick={() =>
                          !isTourActive &&
                          setShowModelDropdown(!showModelDropdown)
                        }
                        disabled={isTourActive}
                        className={`p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors ${isTourActive ? 'cursor-not-allowed opacity-70' : ''}`}
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

                      {/* Dropdown */}
                      {showModelDropdown && (
                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          <div className="py-2">
                            {MODEL_OPTIONS.map(option => (
                              <button
                                key={option.value}
                                disabled={!option?.enabled}
                                onClick={() => handleModelSelect(option.value)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                                  selectedModel === option.value
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'text-gray-700'
                                }`}
                              >
                                <span>{option.icon}</span>
                                <span>{option.label}</span>
                                {selectedModel === option.value && (
                                  <span className="ml-auto text-gray-600">
                                    ✓
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={
                        isLoading || isTourActive || !inputMessage.trim()
                      }
                      className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                        isLoading || isTourActive || !inputMessage.trim()
                          ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                          : 'bg-[#6B6B6B] hover:bg-gray-800 text-white'
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
