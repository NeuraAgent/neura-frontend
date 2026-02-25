import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Logo from '@/components/Logo';
import { useLocale } from '@/contexts/LocaleContext';

const Footer: React.FC = () => {
  const { t } = useLocale();
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();

    // If we're not on the landing page, navigate there first
    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on landing page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative border-t border-white/5 overflow-hidden">
      {/* Layered dark gradient background - 2026 depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1F] via-[#050814] to-[#030508]" />

      {/* Radial gradient accents - subtle brand colors */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-500/8 rounded-full blur-[180px]" />
      <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[160px]" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-violet-500/6 rounded-full blur-[140px]" />

      {/* Subtle noise texture for premium feel */}
      <div className="absolute inset-0 opacity-[0.015] noise-texture pointer-events-none" />

      {/* Enhanced top border with gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-sm" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">
          {/* Brand block - premium anchor */}
          <div className="md:col-span-4">
            <div className="group">
              <Logo className="mb-6 transition-all duration-300 group-hover:scale-[1.02]" />
            </div>
            <p className="text-[#AAB0C4] text-sm leading-relaxed mb-6 max-w-sm">
              {t('landing.footer.tagline')}
            </p>
            {/* Gradient accent line - brand signature */}
            <div className="relative w-20 h-1 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          {/* Product */}
          <div className="md:col-span-2">
            <h3 className="text-[#F5F7FF] font-semibold text-xs uppercase tracking-[0.1em] mb-5 opacity-90">
              {t('landing.footer.product')}
            </h3>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="#features"
                  onClick={e => handleSectionClick(e, 'features')}
                  className="group inline-flex items-center text-[#7B8199] hover:text-cyan-400 transition-all duration-200 text-sm"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {t('landing.footer.features')}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={e => handleSectionClick(e, 'pricing')}
                  className="group inline-flex items-center text-[#7B8199] hover:text-cyan-400 transition-all duration-200 text-sm"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {t('landing.footer.pricing')}
                  </span>
                </a>
              </li>
              <li>
                <Link
                  to="/neura/signup"
                  className="group inline-flex items-center text-[#7B8199] hover:text-cyan-400 transition-all duration-200 text-sm"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {t('landing.footer.signup')}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/neura/login"
                  className="group inline-flex items-center text-[#7B8199] hover:text-cyan-400 transition-all duration-200 text-sm"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {t('landing.footer.login')}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div className="md:col-span-3">
            <h3 className="text-[#F5F7FF] font-semibold text-xs uppercase tracking-[0.1em] mb-5 opacity-90">
              {t('landing.footer.developers')}
            </h3>
            <ul className="space-y-3.5">
              <li>
                <Link
                  to="/docs"
                  className="group inline-flex items-center text-[#7B8199] hover:text-cyan-400 transition-all duration-200 text-sm"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {t('landing.footer.documentation')}
                  </span>
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center text-[#4B5563] cursor-not-allowed text-sm opacity-50">
                  <span>{t('landing.footer.apiReference')}</span>
                </span>
              </li>
              <li>
                <span className="inline-flex items-center text-[#4B5563] cursor-not-allowed text-sm opacity-50">
                  <span>{t('landing.footer.guides')}</span>
                </span>
              </li>
              <li>
                <span className="inline-flex items-center text-[#4B5563] cursor-not-allowed text-sm opacity-50">
                  <span>{t('landing.footer.systemStatus')}</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-3">
            <h3 className="text-[#F5F7FF] font-semibold text-xs uppercase tracking-[0.1em] mb-5 opacity-90">
              {t('landing.footer.legal')}
            </h3>
            <ul className="space-y-3.5">
              <li>
                <span className="inline-flex items-center text-[#4B5563] cursor-not-allowed text-sm opacity-50">
                  <span>{t('landing.footer.terms')}</span>
                </span>
              </li>
              <li>
                <span className="inline-flex items-center text-[#4B5563] cursor-not-allowed text-sm opacity-50">
                  <span>{t('landing.footer.privacy')}</span>
                </span>
              </li>
              <li>
                <span className="inline-flex items-center text-[#4B5563] cursor-not-allowed text-sm opacity-50">
                  <span>{t('landing.footer.security')}</span>
                </span>
              </li>
              <li>
                <span className="inline-flex items-center text-[#4B5563] cursor-not-allowed text-sm opacity-50">
                  <span>{t('landing.footer.compliance')}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section - premium divider and meta */}
        <div className="relative pt-10 mt-4">
          {/* Enhanced gradient divider */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent blur-sm" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[#6B7280] text-xs">
              &copy; {currentYear} {t('landing.footer.copyright')}
            </p>

            {/* Premium status badge */}
            <div className="flex items-center gap-4">
              <div className="group relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0F1428]/60 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-full bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Animated status dot */}
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
                </div>

                <span className="relative text-xs font-medium text-[#7B8199] group-hover:text-[#AAB0C4] transition-colors duration-300">
                  {t('landing.footer.allSystemsOperational')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
