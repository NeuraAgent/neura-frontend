import { Globe } from 'lucide-react';
import type { FC, MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import type { Locale } from '@/contexts/LocaleContext';

interface MobileMenuProps {
  isOpen: boolean;
  locale: Locale;
  onSectionClick: (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => void;
  onClose: () => void;
  onChangeLanguage: (locale: Locale) => void;
  t: (key: string) => string;
}

export const MobileMenu: FC<MobileMenuProps> = ({
  isOpen,
  locale,
  onSectionClick,
  onClose,
  onChangeLanguage,
  t,
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-white/10 glass-card">
      <div className="px-4 py-4 space-y-3">
        <a
          href="#features"
          onClick={e => onSectionClick(e, 'features')}
          className="block py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          {t('landing.nav.features')}
        </a>
        <a
          href="#pricing"
          onClick={e => onSectionClick(e, 'pricing')}
          className="block py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          {t('landing.nav.pricing')}
        </a>
        <a
          href="/docs"
          onClick={onClose}
          className="block py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          {t('landing.nav.docs')}
        </a>

        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-slate-300" />
            <span className="text-sm font-medium text-slate-300">
              {t('nav.language')}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onChangeLanguage('vi')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                locale === 'vi'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Tiếng Việt
            </button>
            <button
              onClick={() => onChangeLanguage('en')}
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
  );
};
