import { Globe } from 'lucide-react';
import type { FC } from 'react';

import type { Locale } from '@/contexts/LocaleContext';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  showMenu: boolean;
  onToggleMenu: () => void;
  onChangeLanguage: (locale: Locale) => void;
}

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
  currentLocale,
  showMenu,
  onToggleMenu,
  onChangeLanguage,
}) => {
  return (
    <div className="relative">
      <button
        onClick={onToggleMenu}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <Globe className="w-4 h-4 text-slate-300" />
        <span className="text-sm font-medium text-slate-300">
          {currentLocale === 'vi' ? 'VI' : 'EN'}
        </span>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-32 glass-card border border-white/10 rounded-lg shadow-xl py-1">
          <button
            onClick={() => onChangeLanguage('vi')}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
              currentLocale === 'vi'
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-300'
            }`}
          >
            Tiếng Việt
          </button>
          <button
            onClick={() => onChangeLanguage('en')}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
              currentLocale === 'en'
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-300'
            }`}
          >
            English
          </button>
        </div>
      )}
    </div>
  );
};
