import { create } from 'zustand';

interface IntroTourState {
  isActive: boolean;
  currentStep: number;
  setIsActive: (isActive: boolean) => void;
  setCurrentStep: (step: number) => void;
}

export const useIntroTourStore = create<IntroTourState>(set => ({
  isActive: false,
  currentStep: 0,
  setIsActive: (isActive: boolean) => set({ isActive }),
  setCurrentStep: (step: number) => set({ currentStep: step }),
}));
