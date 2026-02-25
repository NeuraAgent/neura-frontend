import { Globe, Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Logo from '@/components/Logo';
import { Locale, useLocale } from '@/contexts/LocaleContext';

const LandingNav: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { locale, setLocale, t } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageChange = async (newLocale: Locale) => {
    await setLocale(newLocale);
    setShowLangMenu(false);
  };

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

    // Close mobile menu if open
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-card border-b border-white/10 shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                onClick={e => handleSectionClick(e, 'features')}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {t('landing.nav.features')}
              </a>
              <a
                href="#pricing"
                onClick={e => handleSectionClick(e, 'pricing')}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {t('landing.nav.pricing')}
              </a>
              <a
                href="/docs"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {t('landing.nav.docs')}
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Globe className="w-4 h-4 text-slate-300" />
                <span className="text-sm font-medium text-slate-300">
                  {locale === 'vi' ? 'VI' : 'EN'}
                </span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-32 glass-card border border-white/10 rounded-lg shadow-xl py-1">
                  <button
                    onClick={() => handleLanguageChange('vi')}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
                      locale === 'vi'
                        ? 'text-cyan-400 font-semibold'
                        : 'text-slate-300'
                    }`}
                  >
                    Tiếng Việt
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
                      locale === 'en'
                        ? 'text-cyan-400 font-semibold'
                        : 'text-slate-300'
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            <Link
              to="/neura/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {t('landing.nav.login')}
            </Link>
            <Link
              to="/neura/signup"
              className="group relative px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
            >
              <span className="relative z-10">{t('landing.nav.signup')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-300" />
            ) : (
              <Menu className="w-6 h-6 text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 glass-card">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#features"
              onClick={e => handleSectionClick(e, 'features')}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {t('landing.nav.features')}
            </a>
            <a
              href="#pricing"
              onClick={e => handleSectionClick(e, 'pricing')}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {t('landing.nav.pricing')}
            </a>
            <a
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {t('landing.nav.docs')}
            </a>

            {/* Mobile Language Switcher */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-slate-300" />
                <span className="text-sm font-medium text-slate-300">
                  {t('nav.language')}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLanguageChange('vi')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    locale === 'vi'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Tiếng Việt
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    locale === 'en'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <Link
                to="/neura/login"
                className="block py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {t('landing.nav.login')}
              </Link>
              <Link
                to="/neura/signup"
                className="block px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold text-center hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                {t('landing.nav.signup')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNav;
