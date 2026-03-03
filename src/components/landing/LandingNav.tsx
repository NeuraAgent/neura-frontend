import { Menu, X } from 'lucide-react';
import type { FC, MouseEvent } from 'react';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import Logo from '@/components/Logo';
import type { Locale } from '@/contexts/LocaleContext';
import { useLocale } from '@/contexts/LocaleContext';

import { LanguageSwitcher } from './components/LanguageSwitcher';
import { MobileMenu } from './components/MobileMenu';
import { useScrollEffect } from './hooks/useScrollEffect';
import { useSectionNavigation } from './hooks/useSectionNavigation';

const LandingNav: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { locale, setLocale, t } = useLocale();
  const scrolled = useScrollEffect(20);
  const { handleSectionClick: navigateToSection } = useSectionNavigation();

  const handleLanguageChange = useCallback(
    async (newLocale: Locale) => {
      await setLocale(newLocale);
      setShowLangMenu(false);
    },
    [setLocale]
  );

  const handleSectionClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      navigateToSection(e, sectionId);
      setMobileMenuOpen(false);
    },
    [navigateToSection]
  );

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
            <LanguageSwitcher
              currentLocale={locale}
              showMenu={showLangMenu}
              onToggleMenu={() => setShowLangMenu(!showLangMenu)}
              onChangeLanguage={handleLanguageChange}
            />

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

      <MobileMenu
        isOpen={mobileMenuOpen}
        locale={locale}
        onSectionClick={handleSectionClick}
        onClose={() => setMobileMenuOpen(false)}
        onChangeLanguage={handleLanguageChange}
        t={t}
      />
    </nav>
  );
};

export default LandingNav;
