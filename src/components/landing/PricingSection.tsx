import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useLocale } from '@/contexts/LocaleContext';
import {
  paymentService,
  type SubscriptionPlan,
} from '@/services/paymentService';

import { PricingCard } from './components/PricingCard';

const PricingSection: FC = () => {
  const { t } = useLocale();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const result = await paymentService.getSubscriptionPlans();
        if (result.success && result.data) {
          const sortedPlans = result.data.sort(
            (a, b) =>
              parseFloat(a.price.toString()) - parseFloat(b.price.toString())
          );
          setPlans(sortedPlans);
        }
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-500/5 rounded-full blur-[180px]" />

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
            const features = plan.features
              ? Array.isArray(plan.features)
                ? plan.features
                : Object.values(plan.features)
              : [];

            return (
              <PricingCard
                key={plan.id}
                planName={plan.planName}
                price={parseFloat(plan.price.toString())}
                currency={plan.currency}
                creditsIncluded={plan.creditsIncluded}
                rateLimitPerMinute={plan.rateLimitPerMinute}
                description={plan.description || undefined}
                features={features}
                isPopular={isPopular}
                isDisabled={isDisabled}
                isVisible={visibleCards.includes(index)}
                t={t}
              />
            );
          })}
        </div>

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
