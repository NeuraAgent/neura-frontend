/**
 * ChatMessage Component
 * Displays a single chat message (user or assistant)
 */

import { Check, Copy, X } from 'lucide-react';
import React, { useState } from 'react';
import { CodeBlock } from 'react-code-blocks';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  index: number;
  isCopied: boolean;
  onCopy: (content: string, index: number) => void;
  copyLabel: string;
  copiedLabel: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  index,
  isCopied,
  onCopy,
  copyLabel,
  copiedLabel,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isUser = message.role === 'user';

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div
          className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}
        >
          {!isUser && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
              <span className="text-xs text-white font-bold">AI</span>
            </div>
          )}
          <div
            className={isUser ? 'max-w-[70%]' : 'flex-1 min-w-0 max-w-[85%]'}
          >
            {isUser ? (
              <div className="bg-[#2D2D2D] text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm inline-block">
                <div className="flex flex-col gap-3">
                  {message.content ? (
                    <p className="whitespace-pre-wrap text-[15px] font-medium leading-relaxed m-0">
                      {message.content}
                    </p>
                  ) : message.images && message.images.length > 0 ? (
                    <p className="whitespace-pre-wrap text-[15px] italic text-gray-300 leading-relaxed m-0">
                      Uploaded image{message.images.length > 1 ? 's' : ''}
                    </p>
                  ) : null}

                  {message.images && message.images.length > 0 && (
                    <div className="flex flex-row flex-wrap gap-2 mt-2">
                      {message.images.map((img, idx) => (
                        <div 
                          key={idx} 
                          className="relative rounded-lg overflow-hidden border border-[#404040] w-20 h-20 sm:w-24 sm:h-24 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
                          onClick={() => setSelectedImage(img.url)}
                        >
                          <img 
                            src={img.url} 
                            alt={`Uploaded attachment ${idx + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          {(img.status === 'uploading' || img.status === 'processing') && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                        const match = /language-(\w+)/.exec(className || '');
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
                    {message.content}
                  </ReactMarkdown>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-50">
                  <button
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={() => onCopy(message.content, index)}
                    title={isCopied ? copiedLabel : copyLabel}
                  >
                    {isCopied ? (
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
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors z-10"
              onClick={() => setSelectedImage(null)}
            >
               <X className="w-6 h-6" />
            </button>
            <img 
              src={selectedImage} 
              alt="Full size view" 
              className="max-w-full max-h-full object-contain rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};
