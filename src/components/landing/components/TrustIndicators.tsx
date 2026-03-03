import type { FC } from 'react';

interface TrustIndicatorsProps {
  indicators: Array<{ labelKey: string; delay?: string }>;
  isVisible: boolean;
  t: (key: string) => string;
}

export const TrustIndicators: FC<TrustIndicatorsProps> = ({
  indicators,
  isVisible,
  t,
}) => {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-[#7B8199] transition-all duration-700 delay-400 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {indicators.map((indicator, index) => (
        <div key={index} className="flex items-center gap-2 group">
          <div
            className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
            style={{ animationDelay: indicator.delay || '0s' }}
          />
          <span className="group-hover:text-[#AAB0C4] transition-colors">
            {t(indicator.labelKey)}
          </span>
        </div>
      ))}
    </div>
  );
};
