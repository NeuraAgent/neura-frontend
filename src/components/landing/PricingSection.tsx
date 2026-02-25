import { Check, ChevronDown, Sparkles } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useLocale } from '@/contexts/LocaleContext';
import {
  paymentService,
  type SubscriptionPlan,
} from '@/services/paymentService';

const PricingSection: React.FC = () => {
  const { t } = useLocale();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number, currency: string): string => {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
  };

  // Get currency symbol
  const getCurrencySymbol = (currency: string): string => {
    const symbols: Record<string, string> = {
      VND: '₫',
      USD: '$',
      SGD: 'S$',
    };
    return symbols[currency] || currency;
  };

  const toggleExpanded = (index: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await paymentService.getSubscriptionPlans();
        const sortedPlans = data.sort(
          (a, b) =>
            parseFloat(a.price.toString()) - parseFloat(b.price.toString())
        );
        setPlans(sortedPlans);
      } catch (error) {
        console.error('Failed to fetch subscription plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && plans.length > 0) {
            plans.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards(prev => [...prev, index]);
              }, index * 150);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [plans]);

  if (loading) {
    return (
      <section id="pricing" className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-[#0F1428]/60 rounded w-64 mx-auto"></div>
              <div className="h-6 bg-[#0F1428]/60 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-500/5 rounded-full blur-[180px]" />

      {/* Soft separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F5F7FF] mb-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            {t('landing.pricing.title')}
          </h2>
          <p className="text-lg sm:text-xl text-[#AAB0C4] max-w-2xl mx-auto">
            {t('landing.pricing.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isPopular = plan.planName === 'Free Tier';
            const isDisabled = plan.planName !== 'Free Tier';
            const isExpanded = expandedCards.has(index);
            const features = plan.features
              ? Array.isArray(plan.features)
                ? plan.features
                : Object.values(plan.features)
              : [];

            // Show first 4 features, rest collapsible
            const visibleFeatures = isExpanded
              ? features
              : features.slice(0, 4);
            const hasMoreFeatures = features.length > 4;

            return (
              <div
                key={plan.id}
                className={`relative transition-all duration-500 ${
                  visibleCards.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                } ${isPopular ? 'md:scale-105 md:-translate-y-2' : ''}`}
              >
                {/* Floating pricing card */}
                <div
                  className={`relative rounded-2xl p-8 bg-[#0F1428]/60 backdrop-blur-xl border transition-all duration-300 flex flex-col ${
                    isDisabled
                      ? 'opacity-60'
                      : 'hover:scale-105 hover:-translate-y-1'
                  } ${
                    isPopular
                      ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Animated border gradient for popular plan */}
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

                  {/* Plan header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-[#F5F7FF] mb-4">
                      {plan.planName}
                    </h3>

                    {/* Responsive pricing with fluid typography */}
                    <div className="flex items-baseline justify-center gap-1 mb-3 flex-wrap">
                      <span
                        className="font-bold text-[#F5F7FF] leading-none"
                        style={{
                          fontSize: 'clamp(2rem, 4vw + 1rem, 3rem)',
                        }}
                      >
                        {formatCurrency(
                          parseFloat(plan.price.toString()),
                          plan.currency
                        )}
                      </span>
                      <span
                        className="font-medium text-[#AAB0C4] leading-none"
                        style={{
                          fontSize: 'clamp(1.25rem, 2vw + 0.5rem, 1.5rem)',
                        }}
                      >
                        {getCurrencySymbol(plan.currency)}
                      </span>
                      <span className="text-sm text-[#7B8199] whitespace-nowrap">
                        {t('landing.pricing.perMonth')}
                      </span>
                    </div>

                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#0A0F1F]/80 border border-white/10 mb-2">
                      <span className="text-sm font-mono font-medium bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        {plan.creditsIncluded} {t('landing.pricing.credits')}
                      </span>
                    </div>
                    <div className="text-xs text-[#7B8199]">
                      {plan.rateLimitPerMinute} {t('landing.pricing.rateLimit')}
                    </div>
                  </div>

                  {plan.description && (
                    <p className="text-sm text-[#AAB0C4] mb-6 text-center leading-relaxed">
                      {plan.description}
                    </p>
                  )}

                  {/* Features list with consistent height and collapsible */}
                  <div className="flex-1 mb-8">
                    <ul className="space-y-3">
                      {visibleFeatures.length > 0 ? (
                        visibleFeatures.map(
                          (feature: string, featureIndex: number) => (
                            <li
                              key={featureIndex}
                              className="flex items-start gap-3 animate-fadeIn"
                              style={{
                                animationDelay: `${featureIndex * 50}ms`,
                              }}
                            >
                              <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-[#AAB0C4] leading-relaxed">
                                {feature}
                              </span>
                            </li>
                          )
                        )
                      ) : (
                        <>
                          <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-[#AAB0C4]">
                              {plan.maxFileUploads} file uploads
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-[#AAB0C4]">
                              {plan.prioritySupport
                                ? 'Priority support'
                                : 'Community support'}
                            </span>
                          </li>
                        </>
                      )}
                    </ul>

                    {/* Show more button for long feature lists */}
                    {hasMoreFeatures && (
                      <button
                        onClick={() => toggleExpanded(index)}
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

                  {/* CTA button */}
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
          })}
        </div>

        {/* Trust indicator */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F1428]/60 backdrop-blur-xl border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-mono text-[#7B8199]">
              All plans include{' '}
              <span className="text-[#AAB0C4]">monthly credit refresh</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
