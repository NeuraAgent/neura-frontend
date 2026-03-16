/**
 * Payment Service API Client
 * Handles credit balance, calculations, and payment operations
 */

import { PAYMENT_ENDPOINTS } from '@/constants/api';
import { ApiMiddleware } from '@/utils/api';
import type { ApiMiddlewareResult } from '@/utils/api';

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
   * Get user's credit balance - NO TRY-CATCH NEEDED
   */
  async getCreditBalance(): Promise<ApiMiddlewareResult<CreditBalance>> {
    const result = await ApiMiddleware.get<{ data: CreditBalance }>(
      PAYMENT_ENDPOINTS.CREDITS_BALANCE,
      undefined,
      {
        requiresAuth: true,
        showErrorToast: false,
      }
    );

    // Extract nested data
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.data,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: result.error,
    };
  }

  /**
   * Calculate credits required for a request - NO TRY-CATCH NEEDED
   */
  async calculateCredits(params: {
    model: string;
    serviceType: string;
    inputTokens?: number;
    outputTokens?: number;
  }): Promise<ApiMiddlewareResult<CreditCalculation>> {
    const result = await ApiMiddleware.post<{ data: CreditCalculation }>(
      PAYMENT_ENDPOINTS.CREDITS_CALCULATE,
      params,
      undefined,
      {
        requiresAuth: true,
        showErrorToast: true,
      }
    );

    // Extract nested data
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.data,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: result.error,
    };
  }

  /**
   * Check if user has sufficient credits - NO TRY-CATCH NEEDED
   */
  async checkCredits(credits: number): Promise<
    ApiMiddlewareResult<{
      hasCredits: boolean;
      available: number;
      required: number;
    }>
  > {
    const result = await ApiMiddleware.post<{
      data: { hasCredits: boolean; available: number; required: number };
    }>(PAYMENT_ENDPOINTS.CREDITS_CHECK, { credits }, undefined, {
      requiresAuth: true,
      showErrorToast: true,
    });

    // Extract nested data
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.data,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: result.error,
    };
  }

  /**
   * Get credit transaction history - NO TRY-CATCH NEEDED
   */
  async getCreditHistory(
    page: number = 1,
    limit: number = 20
  ): Promise<
    ApiMiddlewareResult<{
      transactions: CreditTransaction[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>
  > {
    const result = await ApiMiddleware.get<{
      data: {
        transactions: CreditTransaction[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      };
    }>(
      `${PAYMENT_ENDPOINTS.CREDITS_HISTORY}?page=${page}&limit=${limit}`,
      undefined,
      {
        requiresAuth: true,
        showErrorToast: true,
      }
    );

    // Extract nested data
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.data,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: result.error,
    };
  }

  /**
   * Get pricing rules - NO TRY-CATCH NEEDED
   */
  async getPricingRules(): Promise<ApiMiddlewareResult<PricingRule[]>> {
    const result = await ApiMiddleware.get<{ data: PricingRule[] }>(
      PAYMENT_ENDPOINTS.PRICING_RULES,
      undefined,
      {
        requiresAuth: true,
        showErrorToast: false,
      }
    );

    // Extract nested data
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.data || [],
        error: null,
      };
    }

    return {
      success: false,
      data: [],
      error: result.error,
    };
  }

  /**
   * Get subscription plans - NO TRY-CATCH NEEDED
   */
  async getSubscriptionPlans(): Promise<
    ApiMiddlewareResult<SubscriptionPlan[]>
  > {
    const result = await ApiMiddleware.get<{ data: SubscriptionPlan[] }>(
      PAYMENT_ENDPOINTS.SUBSCRIPTIONS_PLANS,
      undefined,
      {
        requiresAuth: true,
        showErrorToast: false,
      }
    );

    // Extract nested data
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.data || [],
        error: null,
      };
    }

    return {
      success: false,
      data: [],
      error: result.error,
    };
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
