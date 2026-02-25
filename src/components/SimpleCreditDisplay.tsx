/**
 * Simple Credit Display Component
 * Shows only used/total credits in a minimal, trendy 2026 UI
 */

import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useLocale } from '@/contexts/LocaleContext';
import {
  paymentService,
  type CreditBalance as CreditBalanceType,
} from '@/services/paymentService';

export function SimpleCreditDisplay() {
  const { t } = useLocale();
  const [balance, setBalance] = useState<CreditBalanceType | null>(null);
  const [loading, setLoading] = useState(true);

  // Get token from localStorage
  const token = localStorage.getItem('auth_token');

  const fetchBalance = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await paymentService.getCreditBalance();
      setBalance(data);
    } catch (err) {
      console.error('Error fetching credit balance:', err);
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
      <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 border border-gray-200/50">
        <div className="animate-pulse">
          <div className="h-3 w-16 rounded bg-gray-200 mb-2"></div>
          <div className="h-6 w-28 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (!balance || !token) {
    return null;
  }

  const percentage = (balance.usedCredits / balance.totalCredits) * 100;

  return (
    <Link
      to="/neura/settings"
      className="block rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 border border-indigo-100/50 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          {t('credits.balance')}
        </span>
        <svg
          className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {paymentService.formatCredits(balance.usedCredits)}
        </span>
        <span className="text-sm text-gray-500">/</span>
        <span className="text-lg font-semibold text-gray-700">
          {paymentService.formatCredits(balance.totalCredits)}
        </span>
      </div>

      {/* Minimal Progress Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/60">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            percentage < 80
              ? 'bg-gradient-to-r from-green-400 to-emerald-500'
              : percentage < 95
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                : 'bg-gradient-to-r from-red-400 to-rose-500'
          }`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </Link>
  );
}
