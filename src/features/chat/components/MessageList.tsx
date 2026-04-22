import React, { useRef, useEffect } from 'react';

import type { ChatMessage } from '../types';

import { CitationList } from './CitationList';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="text-4xl mb-4">💭</div>
          <h3 className="font-semibold text-gray-900">Start a conversation</h3>
          <p className="mt-1 text-sm text-gray-600">
            Select documents above and ask questions about them
          </p>
        </div>
      ) : (
        <>
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 ${
                  message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                }`}
              >
                <span
                  className={
                    message.role === 'user' ? 'text-blue-600' : 'text-gray-600'
                  }
                >
                  {message.role === 'user' ? 'You' : 'AI'}
                </span>
              </div>

              {/* Message Content */}
              <div
                className={`flex max-w-lg flex-col gap-2 rounded-lg px-4 py-2.5 ${
                  message.role === 'user'
                    ? 'bg-blue-50 text-gray-900'
                    : 'bg-gray-50 text-gray-900'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>

                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                  <CitationList citations={message.citations} />
                )}

                {/* Timestamp */}
                <p className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
                <span className="text-gray-600">AI</span>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-gray-50 px-4 py-2.5">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </>
      )}
    </div>
  );
}
