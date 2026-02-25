import {
  MessageSquare,
  Code,
  FileText,
  Search,
  Image,
  Mic,
  Volume2,
  Zap,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { useLocale } from '@/contexts/LocaleContext';

const FeaturesSection: React.FC = () => {
  const { t } = useLocale();
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const features = [
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            features.forEach((_, index) => {
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
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-500 ${
                visibleCards.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Dark glass card with proper contrast */}
              <div className="relative p-6 rounded-2xl bg-[#0F1428]/60 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-full">
                {/* Subtle gradient glow on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-300 -z-10`}
                />

                {/* Icon with gradient background */}
                <div
                  className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-[1px] mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="w-full h-full rounded-xl bg-[#0A0F1F] flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content with proper text colors */}
                <h3 className="text-lg font-semibold text-[#F5F7FF] mb-2 group-hover:text-cyan-300 transition-colors">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-[#AAB0C4] mb-4 leading-relaxed">
                  {t(feature.descKey)}
                </p>

                {/* Credits badge with dark background */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#0A0F1F]/80 border border-white/10">
                  <span
                    className={`text-xs font-mono font-medium bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                  >
                    {feature.credits}
                  </span>
                </div>

                {/* Soft shadow instead of harsh drop shadow */}
                <div className="absolute inset-0 rounded-2xl shadow-lg shadow-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
            </div>
          ))}
        </div>

        {/* Developer hint with proper contrast */}
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
