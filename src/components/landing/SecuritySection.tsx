import { Shield, Lock, Eye, FileCheck } from 'lucide-react';
import React from 'react';

import { useLocale } from '@/contexts/LocaleContext';

const SecuritySection: React.FC = () => {
  const { t } = useLocale();

  const securityFeatures = [
    {
      icon: Shield,
      titleKey: 'landing.security.securePayments',
      descKey: 'landing.security.securePaymentsDesc',
    },
    {
      icon: Lock,
      titleKey: 'landing.security.jwtAuth',
      descKey: 'landing.security.jwtAuthDesc',
    },
    {
      icon: Eye,
      titleKey: 'landing.security.usageTracking',
      descKey: 'landing.security.usageTrackingDesc',
    },
    {
      icon: FileCheck,
      titleKey: 'landing.security.dataPrivacy',
      descKey: 'landing.security.dataPrivacyDesc',
    },
  ];
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('landing.security.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('landing.security.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {t(feature.titleKey)}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
