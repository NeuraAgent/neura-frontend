import React, { useState, useRef, useEffect } from 'react';

import { useLocale, type Locale } from '@/contexts/LocaleContext';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  const getCurrentLanguageLabel = () => {
    return locale === 'en' ? 'EN' : 'VI';
  };

  const getCurrentLanguageName = () => {
    return locale === 'en' ? t('language.english') : t('language.vietnamese');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        title={t('language.switch')}
      >
        <span className="w-6 h-4 flex items-center justify-center bg-blue-100 text-blue-800 text-xs font-bold rounded">
          {getCurrentLanguageLabel()}
        </span>
        <span className="hidden sm:inline">{getCurrentLanguageName()}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-3 ${
                locale === 'en' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span className="w-6 h-4 flex items-center justify-center bg-blue-100 text-blue-800 text-xs font-bold rounded">
                EN
              </span>
              <span>{t('language.english')}</span>
              {locale === 'en' && (
                <svg
                  className="w-4 h-4 ml-auto text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => handleLanguageChange('vi')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-3 ${
                locale === 'vi' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span className="w-6 h-4 flex items-center justify-center bg-red-100 text-red-800 text-xs font-bold rounded">
                VI
              </span>
              <span>{t('language.vietnamese')}</span>
              {locale === 'vi' && (
                <svg
                  className="w-4 h-4 ml-auto text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
