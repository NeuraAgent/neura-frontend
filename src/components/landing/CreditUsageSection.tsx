import {
  Code,
  Database,
  FileText,
  Image,
  MessageSquare,
  Mic,
  Search,
  Sparkles,
  Volume2,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { useLocale } from '@/contexts/LocaleContext';
import { paymentService, PricingRule } from '@/services/paymentService';

const iconMap: Record<string, any> = {
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

const CreditUsageSection: React.FC = () => {
  const { t } = useLocale();
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleTiles, setVisibleTiles] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPricingRules = async () => {
      try {
        const data = await paymentService.getPricingRules();
        const activeRules = data
          .filter(rule => rule.isActive)
          .sort((a, b) => a.creditsPerRequest - b.creditsPerRequest);
        setPricingRules(activeRules);
      } catch (error) {
        console.error('Failed to fetch pricing rules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingRules();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && pricingRules.length > 0) {
            pricingRules.forEach((_, index) => {
              setTimeout(() => {
                setVisibleTiles(prev => [...prev, index]);
              }, index * 80);
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
  }, [pricingRules]);

  if (loading) {
    return (
      <section className="relative py-32 overflow-hidden">
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
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/5 rounded-full blur-[180px]" />

      {/* Soft separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F5F7FF] mb-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            {t('landing.creditUsage.title')}
          </h2>
          <p className="text-lg sm:text-xl text-[#AAB0C4] max-w-2xl mx-auto">
            {t('landing.creditUsage.subtitle')}
          </p>
        </div>

        {/* Modular usage tiles - technical and transparent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {pricingRules.map((rule, index) => {
            const Icon = iconMap[rule.serviceType] || MessageSquare;
            const creditDisplay = rule.creditsPer1kTokens
              ? `${rule.creditsPer1kTokens}/1k`
              : rule.creditsPerRequest;

            return (
              <div
                key={rule.id}
                className={`group relative transition-all duration-500 ${
                  visibleTiles.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Usage tile with hover elevation */}
                <div className="relative flex items-center justify-between p-4 rounded-xl bg-[#0F1428]/60 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    {/* Icon with gradient */}
                    <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-[1px]">
                      <div className="w-full h-full rounded-lg bg-[#0A0F1F] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-[#F5F7FF] text-sm">
                        {rule.serviceName}
                      </div>
                      {rule.creditsPer1kTokens && (
                        <div className="text-xs text-[#7B8199] font-mono">
                          per 1k tokens
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Credit cost - stands out clearly */}
                  <div className="flex flex-col items-end">
                    <div className="text-xl font-bold font-mono bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {creditDisplay}
                    </div>
                    <div className="text-xs text-[#7B8199]">credits</div>
                  </div>

                  {/* Subtle glow on hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical note */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-[#0F1428]/60 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-mono text-[#AAB0C4]">
                {t('landing.creditUsage.realTime')}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#7B8199]">
              <span>• Real-time deduction</span>
              <span>• Transparent tracking</span>
              <span>• No hidden fees</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreditUsageSection;
