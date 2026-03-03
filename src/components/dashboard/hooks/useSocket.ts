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

  useEffect(() => {
    const initSocket = async () => {
      try {
        await socketService.connect();
        setIsConnected(true);

        // Setup event listeners
        socketService.onExecutionStarted(() => {
          onStreamingChange(true);
          streamingResponseRef.current = '';
          onStreamingResponseChange('');
        });

        socketService.onAgentThinking(() => {
          // Simplified - no verbose status updates
        });

        socketService.onToolCalling(() => {
          // Simplified - no verbose status updates
        });

        socketService.onResponseChunk(data => {
          streamingResponseRef.current += data.chunk;
          onStreamingResponseChange(streamingResponseRef.current);
        });

        socketService.onExecutionComplete(data => {
          onLoadingChange(false);
          onStreamingChange(false);
          isSendingRef.current = false; // Release the lock

          // Use streaming response if available, otherwise fallback to complete response
          const aiResponse =
            streamingResponseRef.current ||
            data.result.llmOutput ||
            'No response received';

          const assistantMessage = createAssistantMessage(aiResponse);
          onMessageReceived(assistantMessage);

          // Clear streaming response for next message
          streamingResponseRef.current = '';
          onStreamingResponseChange('');

          // Trigger credit balance refresh
          window.dispatchEvent(new CustomEvent('refreshCreditBalance'));
        });

        socketService.onExecutionError(data => {
          onLoadingChange(false);
          onStreamingChange(false);
          isSendingRef.current = false; // Release the lock

          const errorMessage = createErrorMessage(data.error);
          onMessageReceived(errorMessage);

          // Clear streaming response on error
          streamingResponseRef.current = '';
          onStreamingResponseChange('');
        });
      } catch (error) {
        console.error('Failed to connect to Socket.IO:', error);
        setIsConnected(false);
      }
    };

    initSocket();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [
    onMessageReceived,
    onLoadingChange,
    onStreamingChange,
    onStreamingResponseChange,
    isSendingRef,
  ]);

  return { isConnected };
};
