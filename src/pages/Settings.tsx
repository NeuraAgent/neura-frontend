/**
 * Settings Page
 * Comprehensive settings including detailed credit balance information
 */

import { ArrowLeft, CreditCard, User, Check, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { CreditBalance } from '@/components/CreditBalance';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import {
  paymentService,
  type SubscriptionPlan,
} from '@/services/paymentService';

export default function Settings() {
  const { t } = useLocale();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'credits' | 'profile'>('credits');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const tabs = [
    { id: 'credits' as const, label: t('settings.credits'), icon: CreditCard },
    { id: 'profile' as const, label: t('settings.profile'), icon: User },
  ];

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const result = await paymentService.getSubscriptionPlans();
        if (result.success && result.data) {
          const sortedPlans = result.data.sort(
            (a, b) =>
              parseFloat(a.price.toString()) - parseFloat(b.price.toString())
          );
          setPlans(sortedPlans);
        }
      } catch (error) {
        console.error('Failed to fetch subscription plans:', error);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  // Format currency
  const formatCurrency = (amount: number, currency: string): string => {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
  };

  // Get currency symbol
  const getCurrencySymbol = (currency: string): string => {
    const symbols: Record<string, string> = {
      VND: '₫',
      USD: '$',
      SGD: 'S$',
    };
    return symbols[currency] || currency;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/neura"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('settings.title')}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {t('settings.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 bg-white rounded-lg border border-gray-200 p-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'credits' && (
              <div className="space-y-6">
                {/* Credit Balance Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {t('credits.balance')}
                  </h2>
                  <CreditBalance />
                </div>

                {/* Purchase Options */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {t('credits.purchaseOptions')}
                  </h2>

                  {loadingPlans ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-48 bg-gray-200 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {plans.map(plan => {
                        const isPopular = plan.planName === 'Free Tier';
                        const isDisabled = plan.planName !== 'Free Tier';
                        const features = plan.features
                          ? Array.isArray(plan.features)
                            ? plan.features
                            : Object.values(plan.features)
                          : [];

                        return (
                          <div
                            key={plan.id}
                            className={`relative rounded-lg border-2 p-6 transition-all ${
                              isPopular
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                            } ${isDisabled ? 'opacity-60' : ''}`}
                          >
                            {isPopular && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  {t('credits.popular')}
                                </span>
                              </div>
                            )}

                            <div className="text-center mb-4">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {plan.planName}
                              </h3>

                              {/* Price */}
                              <div className="flex items-baseline justify-center gap-1 mb-2">
                                <span className="text-3xl font-bold text-gray-900">
                                  {formatCurrency(
                                    parseFloat(plan.price.toString()),
                                    plan.currency
                                  )}
                                </span>
                                <span className="text-xl font-semibold text-gray-700">
                                  {getCurrencySymbol(plan.currency)}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {t('landing.pricing.perMonth')}
                                </span>
                              </div>

                              {/* Credits */}
                              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 border border-blue-200 mb-2">
                                <span className="text-sm font-semibold text-blue-700">
                                  {plan.creditsIncluded.toLocaleString()}{' '}
                                  {t('credits.credits')}
                                </span>
                              </div>

                              {/* Rate limit */}
                              <div className="text-xs text-gray-500">
                                {plan.rateLimitPerMinute}{' '}
                                {t('landing.pricing.rateLimit')}
                              </div>
                            </div>

                            {/* Description */}
                            {plan.description && (
                              <p className="text-sm text-gray-600 mb-4 text-center">
                                {plan.description}
                              </p>
                            )}

                            {/* Features */}
                            <ul className="space-y-2 mb-4 min-h-[120px]">
                              {features.length > 0 ? (
                                features
                                  .slice(0, 4)
                                  .map((feature: string, idx: number) => (
                                    <li
                                      key={idx}
                                      className="flex items-start gap-2 text-sm text-gray-700"
                                    >
                                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                      <span>{feature}</span>
                                    </li>
                                  ))
                              ) : (
                                <>
                                  <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span>
                                      {plan.maxFileUploads} file uploads
                                    </span>
                                  </li>
                                  <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span>
                                      {plan.prioritySupport
                                        ? 'Priority support'
                                        : 'Community support'}
                                    </span>
                                  </li>
                                </>
                              )}
                            </ul>

                            {/* CTA Button */}
                            {isDisabled ? (
                              <button
                                disabled
                                className="w-full bg-gray-300 text-gray-500 font-medium py-2 px-4 rounded-lg cursor-not-allowed"
                              >
                                Coming soon
                              </button>
                            ) : (
                              <button
                                className={`w-full font-medium py-2 px-4 rounded-lg transition-colors ${
                                  isPopular
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {t('credits.purchase')}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('settings.profileInfo')}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.email')}
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.firstName')}
                    </label>
                    <input
                      type="text"
                      value={user?.firstName || ''}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.lastName')}
                    </label>
                    <input
                      type="text"
                      value={user?.lastName || ''}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                    {t('common.save')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
