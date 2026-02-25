import { CreditCard, Zap, TrendingUp } from 'lucide-react';
import React from 'react';

import { useLocale } from '@/contexts/LocaleContext';

const HowItWorksSection: React.FC = () => {
  const { t } = useLocale();

  const steps = [
    {
      icon: CreditCard,
      titleKey: 'landing.howItWorks.step1.title',
      descKey: 'landing.howItWorks.step1.description',
      detailKey: 'landing.howItWorks.step1.detail',
    },
    {
      icon: Zap,
      titleKey: 'landing.howItWorks.step2.title',
      descKey: 'landing.howItWorks.step2.description',
      detailKey: 'landing.howItWorks.step2.detail',
    },
    {
      icon: TrendingUp,
      titleKey: 'landing.howItWorks.step3.title',
      descKey: 'landing.howItWorks.step3.description',
      detailKey: 'landing.howItWorks.step3.detail',
    },
  ];
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('landing.howItWorks.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('landing.howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500" />

          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mb-6 mx-auto">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    {t('landing.howItWorks.step')} {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    {t(step.descKey)}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    {t(step.detailKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Credit explanation */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/20 dark:to-violet-950/20 border border-blue-200 dark:border-blue-800">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {t('landing.howItWorks.creditsReset')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {t('landing.howItWorks.creditsResetDesc')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {t('landing.howItWorks.feature1')}
                </span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {t('landing.howItWorks.feature2')}
                </span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {t('landing.howItWorks.feature3')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
