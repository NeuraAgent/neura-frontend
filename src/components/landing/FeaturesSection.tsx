import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useLocale } from '@/contexts/LocaleContext';

import { FeatureCard } from './components/FeatureCard';
import { FEATURES } from './constants';

const FeaturesSection: FC = () => {
  const { t } = useLocale();
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            FEATURES.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards(prev => [...prev, index]);
              }, index * 100);
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
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Subtle background glow - reduced opacity */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-violet-500/5 rounded-full blur-[180px]" />

      {/* Soft separator from hero */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F5F7FF] mb-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            {t('landing.features.title')}
          </h2>
          <p className="text-lg sm:text-xl text-[#AAB0C4] max-w-2xl mx-auto">
            {t('landing.features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={t(feature.titleKey)}
              description={t(feature.descKey)}
              credits={feature.credits}
              gradient={feature.gradient}
              isVisible={visibleCards.includes(index)}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F1428]/60 backdrop-blur-xl border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-mono text-[#7B8199]">
              {t('landing.features.servicesCount').replace('{count}', '8')} •{' '}
              {t('landing.features.realTimeTracking')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
