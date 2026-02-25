/**
 * Credit Balance Component - 2026 AI Assistant Design
 * Ultra-clean, minimal status indicator focused on usage clarity
 */

import { useCallback, useEffect, useState } from 'react';

import { useLocale } from '@/contexts/LocaleContext';
import {
  paymentService,
  type CreditBalance as CreditBalanceType,
} from '@/services/paymentService';

export function CreditBalance() {
  const { t } = useLocale();
  const [balance, setBalance] = useState<CreditBalanceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get token from localStorage
  const token = localStorage.getItem('auth_token');

  const fetchBalance = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await paymentService.getCreditBalance();
      setBalance(data);
    } catch (err) {
      console.error('Error fetching credit balance:', err);
      setError('Failed to load credit balance');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchBalance();
    } else {
      setLoading(false);
    }
  }, [token, fetchBalance]);

  // Listen for credit balance refresh events
  useEffect(() => {
    const handleRefresh = () => {
      if (token) {
        fetchBalance();
      }
    };

    window.addEventListener('refreshCreditBalance', handleRefresh);

    return () => {
      window.removeEventListener('refreshCreditBalance', handleRefresh);
    };
  }, [token, fetchBalance]);

  if (loading) {
    return (
      <div className="rounded-[18px] bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded-lg bg-gray-200"></div>
          <div className="h-10 w-48 rounded-lg bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (error || !balance) {
    return (
      <div className="rounded-[18px] bg-gradient-to-br from-red-50 to-white p-6 border border-red-100">
        <p className="text-sm text-red-600 mb-3">
          {error || 'No credit data available'}
        </p>
        <button
          onClick={fetchBalance}
          className="text-sm font-medium text-red-700 hover:text-red-800 transition-colors"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  const usagePercentage = (balance.usedCredits / balance.totalCredits) * 100;
  const isHighUsage = usagePercentage > 80;

  // Determine subscription plan name based on total credits
  const getSubscriptionPlan = (totalCredits: number): string => {
    if (totalCredits <= 100) return 'Free Tier';
    if (totalCredits <= 1000) return 'Starter';
    if (totalCredits <= 5000) return 'Professional';
    return 'Enterprise';
  };

  const planName = getSubscriptionPlan(balance.totalCredits);

  return (
    <div className="relative rounded-[18px] bg-gradient-to-br from-gray-50 via-white to-gray-50/50 p-6 border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Subtle refresh button - top right */}
      <button
        onClick={fetchBalance}
        className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors"
        title={t('common.refresh')}
        aria-label="Refresh credit balance"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>

      {/* Primary: Usage Display */}
      <div className="mb-5">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-semibold tracking-tight text-gray-900">
            {paymentService.formatCredits(balance.usedCredits)}
          </span>
          <span className="text-lg text-gray-400 font-light">/</span>
          <span className="text-lg font-medium text-gray-600">
            {paymentService.formatCredits(balance.totalCredits)}
          </span>
        </div>
        <p className="text-sm text-gray-500 font-normal">credits used</p>
      </div>

      {/* Micro progress indicator - thin, subtle */}
      <div className="mb-5 h-[2px] w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            isHighUsage ? 'bg-gray-900' : 'bg-gray-400'
          }`}
          style={{ width: `${Math.min(100, usagePercentage)}%` }}
        />
      </div>

      {/* Secondary: Subscription Plan Badge */}
      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100/80 border border-gray-200/50">
        <span className="text-xs font-medium text-gray-700 tracking-wide">
          {planName}
        </span>
      </div>

      {/* Optional: Subtle helper text - only if high usage */}
      {isHighUsage && (
        <p className="mt-4 text-xs text-gray-400 font-light">
          Consider upgrading for more capacity
        </p>
      )}
    </div>
  );
}
