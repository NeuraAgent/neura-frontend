import { ArrowRight, Sparkles } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { useLocale } from '@/contexts/LocaleContext';

const CTASection: React.FC = () => {
  const { t } = useLocale();
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Dark gradient with subtle glow - not bright */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-violet-600/10 to-cyan-600/10" />
      <div className="absolute inset-0 bg-[#050814]/60" />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,8,20,0.8)_100%)]" />

      {/* Noise texture */}
      <div className="absolute inset-0 noise-texture opacity-40" />

      {/* Subtle glow orbs */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-[130px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F1428]/60 backdrop-blur-xl border border-white/10 mb-8">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-[#AAB0C4]">
            {t('landing.cta.badge')}
          </span>
        </div>

        {/* Heading with strong contrast */}
        <h2
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F5F7FF] mb-6"
          style={{ letterSpacing: '-0.02em' }}
        >
          {t('landing.cta.title')}
        </h2>
        <p className="text-lg sm:text-xl text-[#AAB0C4] mb-12 max-w-2xl mx-auto leading-relaxed">
          {t('landing.cta.subtitle')}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            to="/neura/signup"
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-white font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
          >
            <span className="relative z-10">{t('landing.cta.primary')}</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />

            {/* Glow intensifies on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </Link>

          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#0F1428]/60 backdrop-blur-xl border border-white/10 text-[#F5F7FF] font-semibold transition-all duration-300 hover:scale-105 hover:border-white/20 hover:bg-white/5"
          >
            {t('landing.cta.secondary')}
          </a>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-[#7B8199]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t('landing.cta.trust1')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
            <span>{t('landing.cta.trust2')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
              style={{ animationDelay: '1s' }}
            />
            <span>{t('landing.cta.trust3')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
