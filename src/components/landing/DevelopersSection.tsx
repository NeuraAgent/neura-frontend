import { Code2, Zap, Shield, BarChart3 } from 'lucide-react';
import React from 'react';

import { useLocale } from '@/contexts/LocaleContext';

const DevelopersSection: React.FC = () => {
  const { t } = useLocale();

  const developerFeatures = [
    {
      icon: Code2,
      titleKey: 'landing.developers.restfulApi',
      descKey: 'landing.developers.restfulApiDesc',
    },
    {
      icon: Zap,
      titleKey: 'landing.developers.rateLimits',
      descKey: 'landing.developers.rateLimitsDesc',
    },
    {
      icon: Shield,
      titleKey: 'landing.developers.jwtAuth',
      descKey: 'landing.developers.jwtAuthDesc',
    },
    {
      icon: BarChart3,
      titleKey: 'landing.developers.analytics',
      descKey: 'landing.developers.analyticsDesc',
    },
  ];
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 mb-6">
              <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {t('landing.developers.badge')}
              </span>
            </div>

            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              {t('landing.developers.title')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              {t('landing.developers.subtitle')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {developerFeatures.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t(feature.descKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl bg-slate-900 dark:bg-slate-950 p-6 border border-slate-800 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <pre className="text-sm text-slate-300 overflow-x-auto">
                <code>{`// Initialize AI Agent
const agent = new NeuraAgent({
  apiKey: import.meta.env.VITE_API_KEY
});

// Generate code
const response = await agent.chat({
  message: "Create a React component",
  model: "neura-1.0-flash"
});

// Track credits
console.log(response.creditsUsed); // 5`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevelopersSection;
