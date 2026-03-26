import { MessageSquare } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { useLocale } from '@/contexts/LocaleContext';
import { paymentService, type PricingRule } from '@/services/paymentService';

import { CreditUsageTile } from './components/CreditUsageTile';
import { LoadingState } from './components/LoadingState';
import { SectionHeader } from './components/SectionHeader';
import { TechnicalNote } from './components/TechnicalNote';
import { ICON_MAP } from './constants';
import { useIntersectionAnimation } from './hooks/useIntersectionAnimation';
import { CreditFormatter } from './utils/formatters';

const CreditUsageSection: React.FC = () => {
  const { t } = useLocale();
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);

  const { visibleItems, sectionRef } = useIntersectionAnimation({
    itemCount: pricingRules.length,
    staggerDelay: 80,
  });

  useEffect(() => {
    const fetchPricingRules = async () => {
      try {
        const result = await paymentService.getPricingRules();
        if (result.success && result.data) {
          const activeRules = result.data
            .filter(rule => rule.isActive)
            .sort((a, b) => a.creditsPerRequest - b.creditsPerRequest);
          setPricingRules(activeRules);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        /* empty */
      } finally {
        setLoading(false);
      }
    };

    fetchPricingRules();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/5 rounded-full blur-[180px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t('landing.creditUsage.title')}
          subtitle={t('landing.creditUsage.subtitle')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {pricingRules.map((rule, index) => {
            const Icon = ICON_MAP[rule.serviceType] || MessageSquare;
            const creditDisplay = CreditFormatter.format(rule);

            return (
              <CreditUsageTile
                key={rule.id}
                icon={Icon}
                serviceName={rule.serviceName}
                creditDisplay={creditDisplay}
                showTokenInfo={!!rule.creditsPer1kTokens}
                isVisible={visibleItems.includes(index)}
              />
            );
          })}
        </div>

        <TechnicalNote
          realTimeLabel={t('landing.creditUsage.realTime')}
          features={[
            'Real-time deduction',
            'Transparent tracking',
            'No hidden fees',
          ]}
        />
      </div>
    </section>
  );
};

export default CreditUsageSection;
