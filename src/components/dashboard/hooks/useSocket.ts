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
  isSendingRef: MutableRefObject<boolean>;
}

export const useSocket = ({
  onMessageReceived,
  onLoadingChange,
  onStreamingChange,
  onStreamingResponseChange,
  isSendingRef,
}: UseSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const streamingResponseRef = useRef('');
  const callbacksRef = useRef({
    onMessageReceived,
    onLoadingChange,
    onStreamingChange,
    onStreamingResponseChange,
  });

  // Update callbacks ref without triggering reconnection
  useEffect(() => {
    callbacksRef.current = {
      onMessageReceived,
      onLoadingChange,
      onStreamingChange,
      onStreamingResponseChange,
    };
  }, [
    onMessageReceived,
    onLoadingChange,
    onStreamingChange,
    onStreamingResponseChange,
  ]);

  useEffect(() => {
    const initSocket = async () => {
      try {
        await socketService.connect();
        setIsConnected(true);

        // Setup event listeners
        socketService.onExecutionStarted(() => {
          callbacksRef.current.onStreamingChange(true);
          streamingResponseRef.current = '';
          callbacksRef.current.onStreamingResponseChange('');
        });

        socketService.onAgentThinking(() => {
          // Simplified - no verbose status updates
        });

        socketService.onToolCalling(() => {
          // Simplified - no verbose status updates
        });

        socketService.onResponseChunk(data => {
          streamingResponseRef.current += data.chunk;
          callbacksRef.current.onStreamingResponseChange(
            streamingResponseRef.current
          );
        });

        socketService.onExecutionComplete(data => {
          callbacksRef.current.onLoadingChange(false);
          callbacksRef.current.onStreamingChange(false);
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
          isSendingRef.current = false;

          const errorMessage = createErrorMessage(data.error);
          callbacksRef.current.onMessageReceived(errorMessage);

          streamingResponseRef.current = '';
          callbacksRef.current.onStreamingResponseChange('');
        });
      } catch (error) {
        console.error('Failed to connect to Socket.IO:', error);
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
