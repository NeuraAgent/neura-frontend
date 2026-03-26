import { LogOut, User } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import MessageInput from '@/components/MessageInput';
import MessageList from '@/components/MessageList';
import { useAuth } from '@/contexts/AuthContext';
import { useLogout } from '@/hooks/useLogout';
import { ChatMessage } from '@/types';
import { env } from '@/utils/env';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<{
    connectionId: string;
    sessionId: string;
    connectedAt: string;
  } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { logout } = useLogout();

  const handleLogout = () => {
    // Close WebSocket connection
    if (wsRef.current) {
      wsRef.current.close();
    }
    logout('User clicked logout button');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      const wsUrl = env.VITE_WEBSOCKET_URL;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);

        // Send existing session_id if available
        const existingSessionId = localStorage.getItem('chat_session_id');
        if (existingSessionId) {
          ws.send(
            JSON.stringify({
              type: 'restore_session',
              data: { session_id: existingSessionId },
            })
          );
        }
      };

      ws.onmessage = event => {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case 'connection_ack': {
            const sessionId = message.data.session_id;

            // Save session_id to localStorage for persistence
            localStorage.setItem('chat_session_id', sessionId);

            setSessionInfo({
              connectionId: message.data.connection_id,
              sessionId: sessionId,
              connectedAt: message.data.connected_at,
            });
            break;
          }

          case 'typing_start':
            setIsTyping(true);
            break;

          case 'typing_stop':
            setIsTyping(false);
            break;

          case 'agent_response': {
            const responseData = message.data;
            const newMessage: ChatMessage = {
              message_id: responseData.message_id,
              session_id: responseData.session_id,
              user_id: responseData.user_id,
              user_input: responseData.user_input,
              agent_response: responseData.agent_response,
              processing_time: responseData.processing_time,
              success: responseData.success,
              metadata: {},
              created_at: responseData.created_at,
            };

            setMessages(prev => [...prev, newMessage]);
            setIsTyping(false);
            break;
          }
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setSessionInfo(null);
        // Reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = () => {
        setIsConnected(false);
      };

      wsRef.current = ws;
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleSendMessage = (messageText: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    if (!sessionInfo) {
      return;
    }

    const message = {
      type: 'user_message',
      data: {
        user_input: messageText,
        session_id: sessionInfo.sessionId, // Use dynamic session_id
        user_id: 'user',
      },
      timestamp: new Date().toISOString(),
    };

    wsRef.current.send(JSON.stringify(message));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="px-6 py-4 glass-effect border-b border-gray-200/50 text-gray-800 text-center font-bold text-xl relative">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          AI Learning Assistant
        </div>
        {/* User Menu */}
        <div className="absolute top-3 left-5 flex items-center">
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 text-sm text-gray-600 hover:text-gray-800 focus:outline-none p-2 rounded-xl hover:bg-white/50 transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:block font-medium">
                {user?.firstName} {user?.lastName}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute top-12 left-0 mt-2 w-56 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg py-2 z-10 border border-gray-200/50 animate-slide-up">
                <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200/50">
                  <div className="font-semibold">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-gray-500">{user?.email}</div>
                </div>
                <Link
                  to="/dashboard"
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-white/50"
                >
                  <User className="w-4 h-4 mr-3" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-white/50"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Connection Status */}
        <div
          className={`absolute top-4 right-5 text-xs px-3 py-2 rounded-xl font-semibold backdrop-blur-sm ${
            isConnected
              ? 'bg-green-100/80 text-green-700 border border-green-200/50'
              : 'bg-red-100/80 text-red-700 border border-red-200/50'
          }`}
        >
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          {sessionInfo && (
            <div className="text-xs mt-1 opacity-75">
              Session: {sessionInfo.sessionId.substring(0, 8)}...
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-white/30 backdrop-blur-sm">
        <div className="h-full overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="text-center text-gray-600 py-12 max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="h-10 w-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  Welcome to AI Learning Assistant
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  I&apos;m here to help you learn and answer your questions.
                  conversation by typing your message below.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="glass-effect rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      💡 Ask Questions
                    </h4>
                    <p className="text-sm text-gray-600">
                      Get explanations on any topic you&apos;re learning about
                    </p>
                  </div>
                  <div className="glass-effect rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      🔍 Get Help
                    </h4>
                    <p className="text-sm text-gray-600">
                      Receive step-by-step guidance on complex problems
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <MessageList messages={messages} />

              {isTyping && (
                <div className="mb-6">
                  <div className="max-w-[85%] bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-3xl rounded-bl-md px-5 py-4 shadow-sm border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-1">
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
                      <span className="text-gray-500 text-sm ml-2">
                        AI is typing...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

export default ChatInterface;
