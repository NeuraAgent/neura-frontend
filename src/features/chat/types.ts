import type { Sensitivity, Department } from '@/features/abac/types';

export interface Citation {
  documentId: string;
  title: string;
  preview: string;
  sensitivity: Sensitivity;
  department: Department;
  pageNumber?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  selectedDocumentIds: string[];
  createdAt: string;
  updatedAt: string;
}
