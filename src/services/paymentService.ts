/**
 * Payment Service API Client
 * Handles credit balance, calculations, and payment operations
 */

import { apiClient } from '@/utils/apiClient';
import { env } from '@/utils/env';

const API_URL = env.VITE_API_URL;

export interface CreditBalance {
  totalCredits: number;
  usedCredits: number;
  availableCredits: number;
  bonusCredits: number;
  subscriptionCredits: number;
  purchasedCredits: number;
  expiresAt: string | null;
}

export interface CreditCalculation {
  credits: number;
  model: string;
  serviceType: string;
  tokens: {
    input: number;
    output: number;
    total: number;
  };
}

export interface CreditTransaction {
  id: string;
  credits: number;
  balanceAfter: number;
  timestamp: string;
}

export interface PricingRule {
  id: string;
  serviceType: string;
  serviceName: string;
  creditsPerRequest: number;
  creditsPer1kTokens: number | null;
  baseCost: number;
  currency: string;
  isActive: boolean;
  effectiveFrom: string;
  effectiveUntil: string | null;
}

export interface SubscriptionPlan {
  id: string;
  planCode: string;
  planName: string;
  description: string | null;
  price: number;
  currency: string;
  creditsIncluded: number;
  billingCycle: string;
  features: any;
  rateLimitPerMinute: number;
  rateLimitPerHour: number;
  rateLimitPerDay: number;
  maxFileUploads: number;
  maxFileSizeMb: number;
  prioritySupport: boolean;
  isActive: boolean;
}

class PaymentService {
  /**
   * Get user's credit balance
   */
  async getCreditBalance(): Promise<CreditBalance> {
    try {
      const response = await apiClient.get(
        `${API_URL}/api/payment/credits/balance`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error fetching credit balance:', error);
      throw error;
    }
  }

  /**
   * Calculate credits required for a request
   */
  async calculateCredits(params: {
    model: string;
    serviceType: string;
    inputTokens?: number;
    outputTokens?: number;
  }): Promise<CreditCalculation> {
    try {
      const response = await apiClient.post(
        `${API_URL}/api/payment/credits/calculate`,
        params
      );

      return response.data.data;
    } catch (error) {
      console.error('Error calculating credits:', error);
      throw error;
    }
  }

  /**
   * Check if user has sufficient credits
   */
  async checkCredits(
    credits: number
  ): Promise<{ hasCredits: boolean; available: number; required: number }> {
    try {
      const response = await apiClient.post(
        `${API_URL}/api/payment/credits/check`,
        { credits }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error checking credits:', error);
      throw error;
    }
  }

  /**
   * Get credit transaction history
   */
  async getCreditHistory(
    page: number = 1,
    limit: number = 20
  ): Promise<{
    transactions: CreditTransaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const response = await apiClient.get(
        `${API_URL}/api/payment/credits/history?page=${page}&limit=${limit}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error fetching credit history:', error);
      throw error;
    }
  }

  /**
   * Get pricing rules
   */
  async getPricingRules(): Promise<PricingRule[]> {
    try {
      const response = await apiClient.get(
        `${API_URL}/api/payment/pricing/rules`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
      return [];
    }
  }

  /**
   * Get subscription plans
   */
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await apiClient.get(
        `${API_URL}/api/payment/subscriptions/plans`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }
  }

  /**
   * Format credits with thousand separators
   */
  formatCredits(credits: number): string {
    return credits.toLocaleString('en-US');
  }

  /**
   * Get credit color based on availability
   */
  getCreditColor(available: number, total: number): string {
    const percentage = (available / total) * 100;

    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  }
}

export const paymentService = new PaymentService();
export default PaymentService;
