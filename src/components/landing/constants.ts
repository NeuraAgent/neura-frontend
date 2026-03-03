import {
  MessageSquare,
  Code,
  FileText,
  Search,
  Image,
  Mic,
  Volume2,
  Zap,
  Database,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

import type { Feature } from './types';

export const ICON_MAP: Record<string, LucideIcon> = {
  chat: MessageSquare,
  chat_advanced: Sparkles,
  summary: FileText,
  code_generation: Code,
  search: Search,
  image_analysis: Image,
  stt: Mic,
  tts: Volume2,
  embedding: Database,
  document_upload: FileText,
};

export const FEATURES: Feature[] = [
  {
    icon: MessageSquare,
    titleKey: 'landing.features.aiChat',
    descKey: 'landing.features.aiChatDesc',
    credits: '1-5 credits',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Code,
    titleKey: 'landing.features.codeGen',
    descKey: 'landing.features.codeGenDesc',
    credits: '10 credits',
    gradient: 'from-blue-500 to-violet-500',
  },
  {
    icon: FileText,
    titleKey: 'landing.features.docProcess',
    descKey: 'landing.features.docProcessDesc',
    credits: '5-10 credits',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Search,
    titleKey: 'landing.features.semanticSearch',
    descKey: 'landing.features.semanticSearchDesc',
    credits: '2 credits',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Image,
    titleKey: 'landing.features.imageAnalysis',
    descKey: 'landing.features.imageAnalysisDesc',
    credits: '15 credits',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Mic,
    titleKey: 'landing.features.stt',
    descKey: 'landing.features.sttDesc',
    credits: '3 credits/min',
    gradient: 'from-rose-500 to-orange-500',
  },
  {
    icon: Volume2,
    titleKey: 'landing.features.tts',
    descKey: 'landing.features.ttsDesc',
    credits: '2 credits/min',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: Zap,
    titleKey: 'landing.features.apiAccess',
    descKey: 'landing.features.apiAccessDesc',
    credits: 'Premium',
    gradient: 'from-amber-500 to-cyan-500',
  },
];

export const CURRENCY_SYMBOLS: Record<string, string> = {
  VND: '₫',
  USD: '$',
  SGD: 'S$',
};

export const ANIMATION_DELAYS = {
  BADGE: 0,
  TITLE: 100,
  SUBTITLE: 200,
  CTA: 300,
  TRUST: 400,
  NEUPAY: 500,
};

export const INTERSECTION_CONFIG = {
  threshold: 0.1,
};
