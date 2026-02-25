import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useLocale } from '@/contexts/LocaleContext';

const HeroSection: React.FC = () => {
  const { t } = useLocale();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 pb-32">
      {/* Dark radial gradient behind headline - reduced brightness */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-500/8 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 right-1/3 w-[800px] h-[800px] bg-violet-500/6 rounded-full blur-[130px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center">
          {/* Floating badge with subtle glow */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 mb-8 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              {t('landing.hero.badge')}
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-violet-500/10 blur-xl -z-10" />
          </div>

          {/* Hero headline - near-white for maximum readability */}
          <h1
            className={`font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 transition-all duration-700 delay-100 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
            style={{ letterSpacing: '-0.03em' }}
          >
            <span className="block text-[#F5F7FF]">
              {t('landing.hero.title')}
            </span>
            <span className="relative block mt-2">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                {t('landing.hero.titleHighlight')}
              </span>
              {/* Soft glow only around gradient text */}
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-violet-400/20 blur-2xl -z-10" />
            </span>
          </h1>

          {/* Subheading - soft gray for readability */}
          <p
            className={`text-lg sm:text-xl lg:text-2xl text-[#AAB0C4] max-w-3xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-200 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            {t('landing.hero.subtitle')}
          </p>

          {/* CTAs with proper contrast */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-700 delay-300 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <Link
              to="/neura/signup"
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-white font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">
                {t('landing.hero.ctaPrimary')}
              </span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />

              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Link>

            <a
              href="#pricing"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl glass-card border border-white/10 text-[#F5F7FF] font-semibold transition-all duration-300 hover:scale-105 hover:border-white/20 hover:bg-white/5"
            >
              {t('landing.hero.ctaSecondary')}
            </a>
          </div>

          {/* Trust indicators - muted blue-gray */}
          <div
            className={`flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-[#7B8199] transition-all duration-700 delay-400 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-2 group">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="group-hover:text-[#AAB0C4] transition-colors">
                {t('landing.hero.trust1')}
              </span>
            </div>
            <div className="flex items-center gap-2 group">
              <div
                className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
                style={{ animationDelay: '0.5s' }}
              />
              <span className="group-hover:text-[#AAB0C4] transition-colors">
                {t('landing.hero.trust2')}
              </span>
            </div>
            <div className="flex items-center gap-2 group">
              <div
                className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
                style={{ animationDelay: '1s' }}
              />
              <span className="group-hover:text-[#AAB0C4] transition-colors">
                {t('landing.hero.trust3')}
              </span>
            </div>
          </div>

          {/* Floating NeuPay badge with dark background */}
          <div
            className={`mt-16 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0F1428]/60 backdrop-blur-xl border border-white/10 transition-all duration-700 delay-500 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <Sparkles className="w-5 h-5 text-violet-400" />
            <span className="text-sm font-mono text-[#AAB0C4]">
              Powered by{' '}
              <span className="font-semibold text-[#F5F7FF]">NeuPay</span>{' '}
              Credit System
            </span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/5 to-cyan-500/5 blur-xl -z-10" />
          </div>
        </div>
      </div>

      {/* Decorative grid lines - very subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)] pointer-events-none" />
    </section>
  );
};

export default HeroSection;
