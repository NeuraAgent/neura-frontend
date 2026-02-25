/**
 * Floating Credit Indicator Component
 * 2026 AI Assistant Design - Premium, lightweight, matches codebase theme
 */

import { Zap, AlertCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useLocale } from '@/contexts/LocaleContext';
import {
  paymentService,
  type CreditBalance as CreditBalanceType,
} from '@/services/paymentService';

export function FloatingCreditIndicator() {
  const { t } = useLocale();
  const [balance, setBalance] = useState<CreditBalanceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

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
      <div className="animate-pulse">
        <div className="h-9 w-32 rounded-full bg-gray-100 border border-gray-200"></div>
      </div>
    );
  }

  if (!balance || !token) {
    return null;
  }

  const isLowCredit = balance.availableCredits / balance.totalCredits < 0.2;

  return (
    <Link
      to="/neura/settings"
      className="group relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={t('credits.balance')}
    >
      {/* Floating pill container - matches codebase theme */}
      <div
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-full
          bg-white border border-gray-200
          shadow-sm hover:shadow-md
          transition-all duration-300 ease-out
          ${isHovered ? 'scale-[1.02] border-gray-300' : 'scale-100'}
          ${isLowCredit ? 'ring-2 ring-red-100' : ''}
        `}
      >
        {/* Subtle gradient glow on hover - matches indigo/purple theme */}
        {isHovered && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 opacity-50 pointer-events-none" />
        )}

        {/* Icon with theme colors */}
        <div className="relative z-10">
          {isLowCredit ? (
            <AlertCircle className="w-4 h-4 text-red-500" />
          ) : (
            <Zap className="w-4 h-4 text-blue-600" />
          )}
        </div>

        {/* Credit display - Used / Total - matches theme typography */}
        <div className="relative z-10 flex items-baseline gap-1.5 whitespace-nowrap">
          <span
            className={`text-sm font-bold tracking-tight ${
              isLowCredit ? 'text-red-600' : 'text-gray-900'
            }`}
          >
            {paymentService.formatCredits(balance.usedCredits)}
          </span>
          <span className="text-xs text-gray-400">/</span>
          <span className="text-xs font-medium text-gray-600">
            {paymentService.formatCredits(balance.totalCredits)}
          </span>
        </div>
      </div>

      {/* Tooltip on hover - matches theme colors */}
      {isHovered && (
        <div className="absolute top-full mt-2 right-0 z-50 animate-fadeIn pointer-events-none">
          <div className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 shadow-xl">
            <p className="text-xs font-medium text-white whitespace-nowrap">
              {isLowCredit ? (
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3 text-red-400" />
                  {t('credits.lowBalance')}
                </span>
              ) : (
                `${paymentService.formatCredits(balance.availableCredits)} credits remaining`
              )}
            </p>
            <div className="absolute -top-1 right-4 w-2 h-2 rotate-45 bg-gray-900 border-l border-t border-gray-700" />
          </div>
        </div>
      )}
    </Link>
  );
}
