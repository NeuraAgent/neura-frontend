import { Check, ChevronDown, Sparkles } from 'lucide-react';
import type { FC } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { CurrencyFormatter } from '../utils/formatters';

interface PricingCardProps {
  planName: string;
  price: number;
  currency: string;
  creditsIncluded: number;
  rateLimitPerMinute: number;
  description?: string;
  features: string[];
  isPopular: boolean;
  isDisabled: boolean;
  isVisible: boolean;
  t: (key: string) => string;
}

export const PricingCard: FC<PricingCardProps> = ({
  planName,
  price,
  currency,
  creditsIncluded,
  rateLimitPerMinute,
  description,
  features,
  isPopular,
  isDisabled,
  isVisible,
  t,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleFeatures = isExpanded ? features : features.slice(0, 4);
  const hasMoreFeatures = features.length > 4;

  return (
    <div
      className={`relative transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${isPopular ? 'md:scale-105 md:-translate-y-2' : ''}`}
    >
      <div
        className={`relative rounded-2xl p-8 bg-[#0F1428]/60 backdrop-blur-xl border transition-all duration-300 flex flex-col ${
          isDisabled ? 'opacity-60' : 'hover:scale-105 hover:-translate-y-1'
        } ${
          isPopular
            ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/20'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        {isPopular && (
          <>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 opacity-20 blur-xl -z-10 animate-pulse-slow" />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold shadow-lg">
                <Sparkles className="w-4 h-4" />
                {t('landing.pricing.mostPopular')}
              </div>
            </div>
          </>
        )}

        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-[#F5F7FF] mb-4">{planName}</h3>

          <div className="flex items-baseline justify-center gap-1 mb-3 flex-wrap">
            <span
              className="font-bold text-[#F5F7FF] leading-none"
              style={{
                fontSize: 'clamp(2rem, 4vw + 1rem, 3rem)',
              }}
            >
              {CurrencyFormatter.format(price, currency)}
            </span>
            <span
              className="font-medium text-[#AAB0C4] leading-none"
              style={{
                fontSize: 'clamp(1.25rem, 2vw + 0.5rem, 1.5rem)',
              }}
            >
              {CurrencyFormatter.getSymbol(currency)}
            </span>
            <span className="text-sm text-[#7B8199] whitespace-nowrap">
              {t('landing.pricing.perMonth')}
            </span>
          </div>

          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#0A0F1F]/80 border border-white/10 mb-2">
            <span className="text-sm font-mono font-medium bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {creditsIncluded} {t('landing.pricing.credits')}
            </span>
          </div>
          <div className="text-xs text-[#7B8199]">
            {rateLimitPerMinute} {t('landing.pricing.rateLimit')}
          </div>
        </div>

        {description && (
          <p className="text-sm text-[#AAB0C4] mb-6 text-center leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex-1 mb-8">
          <ul className="space-y-3">
            {visibleFeatures.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-3 animate-fadeIn"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[#AAB0C4] leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {hasMoreFeatures && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#0A0F1F]/60 border border-white/10 text-[#AAB0C4] text-sm font-medium hover:bg-white/5 hover:border-white/20 transition-all duration-200 group"
            >
              <span>
                {isExpanded
                  ? 'Show less'
                  : `Show ${features.length - 4} more features`}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>

        {isDisabled ? (
          <button
            disabled
            className="w-full py-3 px-6 rounded-xl text-center font-semibold bg-[#0A0F1F]/80 border border-white/10 text-[#6B7280] cursor-not-allowed"
          >
            Coming soon
          </button>
        ) : (
          <Link
            to="/neura/signup"
            className={`group relative block w-full py-3 px-6 rounded-xl text-center font-semibold overflow-hidden transition-all duration-300 ${
              isPopular
                ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-white hover:shadow-2xl hover:shadow-blue-500/50'
                : 'bg-[#0A0F1F]/80 border border-white/10 text-[#F5F7FF] hover:bg-white/5 hover:border-white/20'
            }`}
          >
            <span className="relative z-10">
              {t('landing.hero.ctaPrimary')}
            </span>
            {isPopular && (
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            )}
          </Link>
        )}
      </div>
    </div>
  );
};
