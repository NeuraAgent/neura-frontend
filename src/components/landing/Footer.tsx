import type { FC, MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useLocale } from '@/contexts/LocaleContext';

import { BrandSection } from './components/BrandSection';
import { FooterLink } from './components/FooterLink';
import { FooterSection } from './components/FooterSection';
import { StatusBadge } from './components/StatusBadge';

const Footer: FC = () => {
  const { t } = useLocale();
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSectionClick = (
    e: MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();

    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
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
          <div className="md:col-span-4">
            <BrandSection tagline={t('landing.footer.tagline')} />
          </div>

          <div className="md:col-span-2">
            <FooterSection title={t('landing.footer.product')}>
              <li>
                <FooterLink
                  href="#features"
                  onClick={e => handleSectionClick(e, 'features')}
                >
                  {t('landing.footer.features')}
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  href="#pricing"
                  onClick={e => handleSectionClick(e, 'pricing')}
                >
                  {t('landing.footer.pricing')}
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/neura/signup">
                  {t('landing.footer.signup')}
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/neura/login">
                  {t('landing.footer.login')}
                </FooterLink>
              </li>
            </FooterSection>
          </div>

          <div className="md:col-span-3">
            <FooterSection title={t('landing.footer.developers')}>
              <li>
                <FooterLink to="/docs">
                  {t('landing.footer.documentation')}
                </FooterLink>
              </li>
              <li>
                <FooterLink disabled>
                  {t('landing.footer.apiReference')}
                </FooterLink>
              </li>
              <li>
                <FooterLink disabled>{t('landing.footer.guides')}</FooterLink>
              </li>
              <li>
                <FooterLink disabled>
                  {t('landing.footer.systemStatus')}
                </FooterLink>
              </li>
            </FooterSection>
          </div>

          <div className="md:col-span-3">
            <FooterSection title={t('landing.footer.legal')}>
              <li>
                <FooterLink disabled>{t('landing.footer.terms')}</FooterLink>
              </li>
              <li>
                <FooterLink disabled>{t('landing.footer.privacy')}</FooterLink>
              </li>
              <li>
                <FooterLink disabled>{t('landing.footer.security')}</FooterLink>
              </li>
              <li>
                <FooterLink disabled>
                  {t('landing.footer.compliance')}
                </FooterLink>
              </li>
            </FooterSection>
          </div>
        </div>

        <div className="relative pt-10 mt-4">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent blur-sm" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[#6B7280] text-xs">
              &copy; {currentYear} {t('landing.footer.copyright')}
            </p>

            <div className="flex items-center gap-4">
              <StatusBadge label={t('landing.footer.allSystemsOperational')} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
