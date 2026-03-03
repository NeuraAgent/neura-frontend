/**
 * useMessageSender Hook
 * Handles message sending logic with credit checks and error handling
 */

import { useRef } from 'react';

import { paymentService } from '@/services/paymentService';
import { socketService } from '@/services/socketService';

import { CREDIT_CHECK_ESTIMATE } from '../constants';
import { Message, SendMessageParams } from '../types';
import {
  createUserMessage,
  createErrorMessage,
  isCreditError,
} from '../utils/messageUtils';

interface UseMessageSenderProps {
  onMessageAdd: (message: Message) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onCreditError: (error: string) => void;
}

export const useMessageSender = ({
  onMessageAdd,
  onLoadingChange,
  onCreditError,
}: UseMessageSenderProps) => {
  const isSendingRef = useRef(false);

  const sendMessage = async (params: SendMessageParams): Promise<boolean> => {
    // Immediate blocking check - prevents rapid clicks/Enter presses
    if (isSendingRef.current) {
      return false;
    }

    // Set immediate blocking flag (synchronous, blocks before state updates)
    isSendingRef.current = true;

    try {
      // Check credits before sending
      const creditCheck = await paymentService.checkCredits(
        CREDIT_CHECK_ESTIMATE
      );
      if (!creditCheck.hasCredits) {
        onCreditError(
          `Insufficient credits. You have ${creditCheck.available} credits but need at least ${creditCheck.required}.`
        );
        isSendingRef.current = false;
        return false;
      }
    } catch (error) {
      console.warn('Failed to check credits, proceeding anyway:', error);
      // Continue even if credit check fails - let backend handle it
    }

    // Create and add user message
    const userMessage = createUserMessage(params.content);
    onMessageAdd(userMessage);
    onLoadingChange(true);

    try {
      // Send via Socket.IO
      await socketService.execute({
        version: 'v1.0',
        query: params.content,
        session_id: params.sessionId,
        user_id: params.userId,
        channel_id: 'frontend_channel',
        available_files: params.fileIds,
        llm_model: params.model,
        user_info: params.userInfo,
      });

      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      onLoadingChange(false);
      isSendingRef.current = false; // Release the lock on error

      // Check if it's a credit error
      if (isCreditError(error)) {
        onCreditError('Insufficient credits to process this request.');
      }

      // Add error message
      const errorMsg = createErrorMessage(`Failed to send message: ${error}`);
      onMessageAdd(errorMsg);

      return false;
    }
  };

  return { sendMessage, isSendingRef };
};
