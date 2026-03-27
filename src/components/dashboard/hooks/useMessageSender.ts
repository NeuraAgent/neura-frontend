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
  onMessageUpdate?: (id: string, updates: Partial<Message>) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onCreditError: (error: string) => void;
}

export const useMessageSender = ({
  onMessageAdd,
  onMessageUpdate,
  onLoadingChange,
  onCreditError,
}: UseMessageSenderProps) => {
  const isSendingRef = useRef(false);

  const sendMessage = async (params: SendMessageParams): Promise<boolean> => {
    // Immediate blocking check - prevents rapid clicks/Enter presses
    if (isSendingRef.current) {
      return false;
    }

    // ... rest of checking logic
    isSendingRef.current = true;

    try {
      const creditCheck = await paymentService.checkCredits(CREDIT_CHECK_ESTIMATE);
      if (creditCheck.success && creditCheck.data && !creditCheck.data.hasCredits) {
        onCreditError(`Insufficient credits...`);
        isSendingRef.current = false;
        return false;
      }
    } catch (e) {}

    const displayMsg = params.displayContent || params.content;
    const userMessage = createUserMessage(displayMsg, params.images);
    onMessageAdd(userMessage);
    onLoadingChange(true);

    try {
      let finalBackendContent = params.content;
      if (params.getBackendContent) {
        finalBackendContent = await params.getBackendContent();
        
        // Once background content is fetched (OCR done), update images to 'done'
        if (onMessageUpdate && userMessage.id && params.images) {
           const updatedImages = params.images.map(img => ({ ...img, status: 'done' as const }));
           onMessageUpdate(userMessage.id, { images: updatedImages });
        }
      }

      console.log('[Backend Payload Final Content - Verify Network Tab]:', finalBackendContent);

      await socketService.execute({
        version: 'v1.0',
        query: finalBackendContent,
        session_id: params.sessionId,
        user_id: params.userId,
        channel_id: 'frontend_channel',
        available_files: params.fileIds,
        llm_model: params.model,
        user_info: params.userInfo,
      });

      return true;
    } catch (error) {
      onLoadingChange(false);
      isSendingRef.current = false;
      
      // On error, mark images as error
      if (onMessageUpdate && userMessage.id && params.images) {
         const updatedImages = params.images.map(img => ({ ...img, status: 'error' as const }));
         onMessageUpdate(userMessage.id, { images: updatedImages });
      }

      if (isCreditError(error)) {
        onCreditError('Insufficient credits to process this request.');
      }
      onMessageAdd(createErrorMessage(`Failed to send message: ${error}`));
      return false;
    }
  };

  return { sendMessage, isSendingRef };
};
