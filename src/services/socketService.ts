/**
 * Socket.IO Service for Real-time AI Communication
 *
 * This service handles Socket.IO connection to AI Core service
 * for real-time streaming of AI responses.
 */

import { io, Socket } from 'socket.io-client';

import { env } from '@/utils/env';

// AI Core Socket.IO URL

export interface ExecutePayload {
  version: string;
  query: string;
  session_id: string;
  user_id: string;
  channel_id: string;
  available_files: string[];
  llm_model: string;
  user_info?: {
    firstName?: string;
    lastName?: string;
  };
}

export interface ExecutionStartedData {
  session_id: string;
  query: string;
  timestamp: string;
}

export interface AgentThinkingData {
  message: string;
  step?: string;
}

export interface ToolCallingData {
  tool_name: string;
  tool_input?: any;
}

export interface ExecutionCompleteData {
  result: {
    llmOutput: string;
    metadata?: any;
  };
  processing_time?: number;
}

export interface ExecutionErrorData {
  error: string;
  details?: any;
}

export type SocketEventCallback = (data: any) => void;

class SocketService {
  private socket: Socket | null = null;
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  /**
   * Connect to Socket.IO server
   */
  connect(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      if (this.isConnecting) {
        // Wait for existing connection attempt
        const checkInterval = setInterval(() => {
          if (this.socket?.connected) {
            clearInterval(checkInterval);
            resolve(this.socket);
          } else if (!this.isConnecting) {
            clearInterval(checkInterval);
            reject(new Error('Connection failed'));
          }
        }, 100);
        return;
      }

      this.isConnecting = true;

      this.socket = io(env.VITE_API_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        resolve(this.socket!);
      });

      this.socket.on('connect_error', error => {
        console.error('❌ Socket.IO connection error:', error.message);
        this.reconnectAttempts++;

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.isConnecting = false;
          reject(
            new Error(
              `Failed to connect after ${this.maxReconnectAttempts} attempts`
            )
          );
        }
      });

      this.socket.on('disconnect', () => {
        this.isConnecting = false;
      });

      this.socket.on('reconnect', () => {
        this.reconnectAttempts = 0;
      });

      this.socket.on('reconnect_failed', () => {
        console.error('❌ Failed to reconnect to Socket.IO');
        this.isConnecting = false;
        reject(new Error('Reconnection failed'));
      });
    });
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  /**
   * Execute AI query
   */
  async execute(payload: ExecutePayload): Promise<void> {
    if (!this.socket?.connected) {
      await this.connect();
    }

    this.socket!.emit('execute', payload);
  }

  /**
   * Register event listeners
   */
  on(event: string, callback: SocketEventCallback): void {
    if (!this.socket) {
      return;
    }

    this.socket.on(event, callback);
  }

  /**
   * Unregister event listeners
   */
  off(event: string, callback?: SocketEventCallback): void {
    if (!this.socket) {
      return;
    }

    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }

  /**
   * Register progress_update event
   */
  onProgressUpdate(
    callback: (data: { step: string; message: string }) => void
  ): void {
    this.on('progress_update', callback);
  }

  /**
   * Register execution_started event
   */
  onExecutionStarted(callback: (data: ExecutionStartedData) => void): void {
    this.on('execution_started', callback);
  }

  /**
   * Register agent_thinking event
   */
  onAgentThinking(callback: (data: AgentThinkingData) => void): void {
    this.on('agent_thinking', callback);
  }

  /**
   * Register tool_calling event
   */
  onToolCalling(callback: (data: ToolCallingData) => void): void {
    this.on('tool_calling', callback);
  }

  /**
   * Register execution_complete event
   */
  onExecutionComplete(callback: (data: ExecutionCompleteData) => void): void {
    this.on('execution_complete', callback);
  }

  /**
   * Register execution_error event
   */
  onExecutionError(callback: (data: ExecutionErrorData) => void): void {
    this.on('execution_error', callback);
  }

  /**
   * Register response_chunk event for real-time streaming
   */
  onResponseChunk(
    callback: (data: { session_id: string; chunk: string }) => void
  ): void {
    this.on('response_chunk', callback);
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const socketService = new SocketService();

// Export class for testing
export default SocketService;
