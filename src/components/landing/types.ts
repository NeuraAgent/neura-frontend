import type { LucideIcon } from 'lucide-react';

export interface Feature {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  credits: string;
  gradient: string;
}

export interface TrustIndicator {
  labelKey: string;
  delay?: string;
}

export interface AnimationConfig {
  isVisible: boolean;
  delay?: number;
}
