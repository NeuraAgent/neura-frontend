/**
 * useSocket Hook
 * Manages Socket.IO connection and event handlers
 */

import { useEffect, useRef, useState, MutableRefObject } from 'react';

import { socketService } from '@/services/socketService';

import { Message } from '../types';
import {
  createAssistantMessage,
  createErrorMessage,
} from '../utils/messageUtils';

interface UseSocketProps {
  onMessageReceived: (message: Message) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onStreamingChange: (isStreaming: boolean) => void;
  onStreamingResponseChange: (response: string) => void;
  onThinkingMessageChange: (message: string) => void;
  isSendingRef: MutableRefObject<boolean>;
}

export const useSocket = ({
  onMessageReceived,
  onLoadingChange,
  onStreamingChange,
  onStreamingResponseChange,
  onThinkingMessageChange,
  isSendingRef,
}: UseSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const streamingResponseRef = useRef('');
  const callbacksRef = useRef({
    onMessageReceived,
    onLoadingChange,
    onStreamingChange,
    onStreamingResponseChange,
    onThinkingMessageChange,
  });

  // Update callbacks ref without triggering reconnection
  useEffect(() => {
    callbacksRef.current = {
      onMessageReceived,
      onLoadingChange,
      onStreamingChange,
      onStreamingResponseChange,
      onThinkingMessageChange,
    };
  }, [
    onMessageReceived,
    onLoadingChange,
    onStreamingChange,
    onStreamingResponseChange,
    onThinkingMessageChange,
  ]);

  useEffect(() => {
    const initSocket = async () => {
      try {
        await socketService.connect();
        setIsConnected(true);
        // Setup event listeners
        socketService.onProgressUpdate(data => {
          callbacksRef.current.onThinkingMessageChange(data.message);
        });

        socketService.onExecutionStarted(() => {
          callbacksRef.current.onStreamingChange(true);
          callbacksRef.current.onThinkingMessageChange('');
          streamingResponseRef.current = '';
          callbacksRef.current.onStreamingResponseChange('');
        });

        socketService.onAgentThinking(data => {
          callbacksRef.current.onThinkingMessageChange(data.message);
        });
        socketService.onResponseChunk(data => {
          if (streamingResponseRef.current === '') {
            callbacksRef.current.onStreamingChange(true);
            callbacksRef.current.onThinkingMessageChange('');
          }
          streamingResponseRef.current += data.chunk;
          callbacksRef.current.onStreamingResponseChange(
            streamingResponseRef.current
          );
        });

        socketService.onExecutionComplete(data => {
          callbacksRef.current.onLoadingChange(false);
          callbacksRef.current.onStreamingChange(false);
          callbacksRef.current.onThinkingMessageChange('');
          isSendingRef.current = false;

          const aiResponse =
            streamingResponseRef.current ||
            data.result.llmOutput ||
            'No response received';

          const assistantMessage = createAssistantMessage(aiResponse);
          callbacksRef.current.onMessageReceived(assistantMessage);

          streamingResponseRef.current = '';
          callbacksRef.current.onStreamingResponseChange('');

          window.dispatchEvent(new CustomEvent('refreshCreditBalance'));
        });

        socketService.onExecutionError(data => {
          callbacksRef.current.onLoadingChange(false);
          callbacksRef.current.onStreamingChange(false);
          callbacksRef.current.onThinkingMessageChange('');
          isSendingRef.current = false;

          const errorMessage = createErrorMessage(data.error);
          callbacksRef.current.onMessageReceived(errorMessage);

          streamingResponseRef.current = '';
          callbacksRef.current.onStreamingResponseChange('');
        });
      } catch (error) {
        console.error('[useSocket] ❌ Socket initialization failed:', error);
        setIsConnected(false);
      }
    };

    initSocket();

    return () => {
      socketService.disconnect();
    };
  }, [isSendingRef]);

  return { isConnected };
};
