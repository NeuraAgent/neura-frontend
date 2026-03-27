import { X, ArrowDown, ArrowUp, ArrowLeft, ArrowRight } from 'lucide-react';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { authService } from '@/services/authService';
import { useIntroTourStore } from '@/stores/introTourStore';
import { useUserStore } from '@/stores/userStore';

interface TourStep {
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

interface IntroTourProps {
  enabled?: boolean;
}

interface SpotlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius: string;
}

const IntroTour: React.FC<IntroTourProps> = ({ enabled = true }) => {
  const { user } = useAuth();
  const { updateUser } = useUserStore();
  const { t } = useLocale();
  const { isActive, currentStep, setIsActive, setCurrentStep } =
    useIntroTourStore();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState<
    'top' | 'bottom' | 'left' | 'right'
  >('bottom');
  const [spotlightPosition, setSpotlightPosition] =
    useState<SpotlightPosition | null>(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Check if intro tour is enabled via environment variable
  const isIntroTourEnabled = import.meta.env.VITE_ENABLE_INTRO_TOUR === 'true';

  // Define tour steps with useMemo to prevent recreation on every render
  const steps: TourStep[] = useMemo(
    () => [
      {
        target: '[data-tour="upload-button"]',
        title: t('tour.uploadTitle'),
        content: t('tour.uploadContent'),
        placement: 'bottom',
      },
      {
        target: '[data-tour="file-list"]',
        title: t('tour.fileListTitle'),
        content: t('tour.fileListContent'),
        placement: 'right',
      },
      {
        target: '[data-tour="chat-input"]',
        title: t('tour.chatTitle'),
        content: t('tour.chatContent'),
        placement: 'top',
      },
      {
        target: '[data-tour="settings-button"]',
        title: t('tour.settingsTitle'),
        content: t('tour.settingsContent'),
        placement: 'bottom',
      },
    ],
    [t]
  );

  const isLastStep = currentStep === steps.length - 1;

  const updatePosition = useCallback(() => {
    const step = steps[currentStep];
    if (!step) return;

    const targetElement = document.querySelector(step.target) as HTMLElement;
    if (!targetElement || !popoverRef.current) return;

    // Add active class to target element for styling
    targetElement.classList.add('tour-active');

    const targetRect = targetElement.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const placement = step.placement || 'bottom';

    // Calculate spotlight position with padding
    const spotlightPadding = 12;
    setSpotlightPosition({
      top: targetRect.top - spotlightPadding,
      left: targetRect.left - spotlightPadding,
      width: targetRect.width + spotlightPadding * 2,
      height: targetRect.height + spotlightPadding * 2,
      borderRadius: '16px',
    });

    // Calculate popover position with intelligent fallback
    const gap = 64; // Significantly increased gap for comfortable spacing
    let top = 0;
    let left = 0;
    let finalPlacement = placement;

    // Calculate initial position based on preferred placement
    const positions = {
      top: {
        top: targetRect.top - popoverRect.height - gap,
        left: targetRect.left + targetRect.width / 2 - popoverRect.width / 2,
      },
      bottom: {
        top: targetRect.bottom + gap,
        left: targetRect.left + targetRect.width / 2 - popoverRect.width / 2,
      },
      left: {
        top: targetRect.top + targetRect.height / 2 - popoverRect.height / 2,
        left: targetRect.left - popoverRect.width - gap,
      },
      right: {
        top: targetRect.top + targetRect.height / 2 - popoverRect.height / 2,
        left: targetRect.right + gap,
      },
    };

    // Check if preferred placement fits in viewport
    const preferredPos = positions[placement];
    const fitsInViewport = {
      top: preferredPos.top >= 16,
      bottom: preferredPos.top + popoverRect.height <= window.innerHeight - 16,
      left: preferredPos.left >= 16,
      right: preferredPos.left + popoverRect.width <= window.innerWidth - 16,
    };

    // If preferred placement doesn't fit, try alternatives
    if (
      !fitsInViewport.top ||
      !fitsInViewport.bottom ||
      !fitsInViewport.left ||
      !fitsInViewport.right
    ) {
      const fallbackOrder: Record<
        string,
        ('top' | 'bottom' | 'left' | 'right')[]
      > = {
        top: ['bottom', 'right', 'left'],
        bottom: ['top', 'right', 'left'],
        left: ['right', 'bottom', 'top'],
        right: ['left', 'bottom', 'top'],
      };

      for (const fallback of fallbackOrder[placement]) {
        const fallbackPos = positions[fallback];
        const fallbackFits = {
          top: fallbackPos.top >= 16,
          bottom:
            fallbackPos.top + popoverRect.height <= window.innerHeight - 16,
          left: fallbackPos.left >= 16,
          right: fallbackPos.left + popoverRect.width <= window.innerWidth - 16,
        };

        if (
          fallbackFits.top &&
          fallbackFits.bottom &&
          fallbackFits.left &&
          fallbackFits.right
        ) {
          finalPlacement = fallback;
          top = fallbackPos.top;
          left = fallbackPos.left;
          break;
        }
      }

      if (finalPlacement === placement) {
        top = preferredPos.top;
        left = preferredPos.left;
      }
    } else {
      top = preferredPos.top;
      left = preferredPos.left;
    }

    // Final viewport clamping as safety net
    const padding = 32; // Increased padding from edges
    const minLeftMargin = 120; // Increased minimum left margin for better spacing

    top = Math.max(
      padding,
      Math.min(top, window.innerHeight - popoverRect.height - padding)
    );
    left = Math.max(
      Math.max(padding, minLeftMargin), // Use larger of padding or minLeftMargin
      Math.min(left, window.innerWidth - popoverRect.width - padding)
    );

    setPosition({ top, left });
    setActualPlacement(finalPlacement as 'top' | 'bottom' | 'left' | 'right');
  }, [currentStep, steps]);

  useEffect(() => {
    // Check if user should see the intro
    if (
      isIntroTourEnabled &&
      enabled &&
      user &&
      !user.hasCompletedIntro &&
      currentStep === 0
    ) {
      const timer = setTimeout(() => {
        setIsActive(true);
        updatePosition();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, enabled, isIntroTourEnabled, currentStep, updatePosition]);

  useEffect(() => {
    if (isActive) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [isActive, currentStep, updatePosition]);

  const handleComplete = useCallback(() => {
    // Remove active class from current target
    const currentTarget = document.querySelector(
      steps[currentStep]?.target
    ) as HTMLElement;
    currentTarget?.classList.remove('tour-active');

    // Close tour immediately
    setIsActive(false);

    // Update zustand store (this session only, will show again on refresh)
    updateUser({ hasCompletedIntro: true });

    // Only call API if user checked "Don't show again"
    if (dontShowAgain) {
      authService.updateIntroStatus(true).catch(() => {
        // Revert on error
        updateUser({ hasCompletedIntro: false });
      });
    }
  }, [currentStep, steps, updateUser, dontShowAgain]);

  const handleNext = useCallback(() => {
    // Remove active class from current target
    const currentTarget = document.querySelector(
      steps[currentStep]?.target
    ) as HTMLElement;
    currentTarget?.classList.remove('tour-active');

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  }, [currentStep, steps, handleComplete]);

  const handleSkip = useCallback(() => {
    // Remove active class from current target
    const currentTarget = document.querySelector(
      steps[currentStep]?.target
    ) as HTMLElement;
    currentTarget?.classList.remove('tour-active');

    // Close tour (session only)
    setIsActive(false);
    updateUser({ hasCompletedIntro: true });
  }, [currentStep, steps, updateUser]);

  // Get arrow icon based on placement
  const getArrowIcon = (placement: string, colorClass = 'text-white') => {
    const iconClass = `w-7 h-7 ${colorClass}`;
    const animationClass =
      placement === 'left' || placement === 'right'
        ? 'animate-bounce-horizontal'
        : 'animate-bounce';

    switch (placement) {
      case 'top':
        return (
          <ArrowUp
            className={`${iconClass} ${animationClass}`}
            strokeWidth={2.5}
          />
        );
      case 'bottom':
        return (
          <ArrowDown
            className={`${iconClass} ${animationClass}`}
            strokeWidth={2.5}
          />
        );
      case 'left':
        return (
          <ArrowLeft
            className={`${iconClass} ${animationClass}`}
            strokeWidth={2.5}
          />
        );
      case 'right':
        return (
          <ArrowRight
            className={`${iconClass} ${animationClass}`}
            strokeWidth={2.5}
          />
        );
      default:
        return (
          <ArrowDown
            className={`${iconClass} ${animationClass}`}
            strokeWidth={2.5}
          />
        );
    }
  };

  // Keyboard navigation (removed ESC handler)
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, currentStep, handleNext]);

  if (!isActive || !isIntroTourEnabled || !enabled) {
    return null;
  }

  const step = steps[currentStep];
  if (!step) return null;

  return (
    <>
      {/* SVG Overlay with Cutout Mask */}
      {spotlightPosition && (
        <svg
          className="fixed inset-0 z-[9998] pointer-events-none transition-all duration-500"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={spotlightPosition.left}
                y={spotlightPosition.top}
                width={spotlightPosition.width}
                height={spotlightPosition.height}
                rx={spotlightPosition.borderRadius}
                ry={spotlightPosition.borderRadius}
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.5)"
            mask="url(#spotlight-mask)"
            style={{ transition: 'all 0.5s ease-out' }}
          />
        </svg>
      )}

      {/* Glowing Ring Around Target */}
      {spotlightPosition && (
        <div
          className="fixed z-[9999] pointer-events-none transition-all duration-500 ease-out"
          style={{
            top: `${spotlightPosition.top - 4}px`,
            left: `${spotlightPosition.left - 4}px`,
            width: `${spotlightPosition.width + 8}px`,
            height: `${spotlightPosition.height + 8}px`,
            borderRadius: spotlightPosition.borderRadius,
            boxShadow:
              '0 0 0 3px rgba(255, 255, 255, 0.9), ' +
              '0 0 0 6px rgba(107, 107, 107, 0.4), ' +
              '0 0 30px 10px rgba(255, 255, 255, 0.5), ' +
              '0 0 60px 20px rgba(255, 255, 255, 0.3)',
            animation: 'pulse-ring 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Directional Arrow Indicator */}
      {spotlightPosition && (
        <div
          className="fixed z-[10001] pointer-events-none transition-all duration-500"
          style={{
            top:
              actualPlacement === 'top'
                ? `${spotlightPosition.top - 44}px` // Closer to target, away from tooltip
                : actualPlacement === 'bottom'
                  ? `${spotlightPosition.top + spotlightPosition.height + 16}px` // Closer to target
                  : `${spotlightPosition.top + spotlightPosition.height / 2 - 14}px`,
            left:
              actualPlacement === 'left'
                ? `${spotlightPosition.left - 44}px` // Closer to target, away from tooltip
                : actualPlacement === 'right'
                  ? `${spotlightPosition.left + spotlightPosition.width + 16}px` // Closer to target
                  : `${spotlightPosition.left + spotlightPosition.width / 2 - 14}px`,
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))',
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 blur-sm opacity-50">
              {getArrowIcon(actualPlacement, 'text-white')}
            </div>
            <div className="relative">
              {getArrowIcon(actualPlacement, 'text-white')}
            </div>
          </div>
        </div>
      )}

      {/* Tooltip/Popover Card */}
      <div
        ref={popoverRef}
        className="fixed z-[10000] bg-white rounded-2xl shadow-2xl p-6 max-w-sm transition-all duration-500 ease-out animate-fade-in-scale"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          border: '2px solid rgba(107, 107, 107, 0.1)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-content"
      >
        {/* Close button - only show on first step */}
        {currentStep === 0 && (
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close tour"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Step indicator badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 mb-3">
          <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" />
          {t('tour.step')} {currentStep + 1} {t('tour.of')} {steps.length}
        </div>

        {/* Content */}
        <div className="mb-5">
          <h3
            id="tour-title"
            className="text-xl font-bold text-gray-900 mb-2 leading-tight"
          >
            {step.title}
          </h3>
          <p
            id="tour-content"
            className="text-sm text-gray-600 leading-relaxed"
          >
            {step.content}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`transition-all duration-300 rounded-full ${index === currentStep
                  ? 'w-8 h-2 bg-gray-600'
                  : index < currentStep
                    ? 'w-2 h-2 bg-gray-400'
                    : 'w-2 h-2 bg-gray-200'
                }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Don't show again checkbox - only on last step */}
        {isLastStep && (
          <label className="flex items-center gap-3 mb-4 cursor-pointer group select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={e => setDontShowAgain(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:border-gray-600 peer-checked:bg-gray-600 transition-all duration-200 group-hover:border-gray-400 flex items-center justify-center">
                {dontShowAgain && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
              {t('tour.dontShowAgain')}
            </span>
          </label>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {/* Show Skip only on first step */}
          {currentStep === 0 && (
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 hover:scale-105"
            >
              {t('tour.skip')}
            </button>
          )}

          {/* Show Back button on steps after first */}
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 hover:scale-105"
            >
              {t('tour.back')}
            </button>
          )}

          {/* Next/Finish button */}
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {currentStep < steps.length - 1 ? t('tour.next') : t('tour.finish')}
          </button>
        </div>
      </div>

      {/* Global animations and styles */}
      <style>{`
        @keyframes pulse-ring {
          0%, 100% {
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.9), 
                        0 0 0 6px rgba(107, 107, 107, 0.4), 
                        0 0 30px 10px rgba(255, 255, 255, 0.5), 
                        0 0 60px 20px rgba(255, 255, 255, 0.3);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 1), 
                        0 0 0 6px rgba(107, 107, 107, 0.6), 
                        0 0 40px 15px rgba(255, 255, 255, 0.7), 
                        0 0 80px 30px rgba(255, 255, 255, 0.5);
            transform: scale(1.02);
          }
        }

        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes bounce-horizontal {
          0%, 100% {
            transform: translateX(0);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateX(-25%);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        .animate-fade-in-scale {
          animation: fade-in-scale 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-bounce-horizontal {
          animation: bounce-horizontal 1s infinite;
        }

        [data-tour] {
          position: relative;
          z-index: 9999 !important;
        }

        [data-tour].tour-active {
          transform: scale(1.02);
          transition: transform 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default IntroTour;
