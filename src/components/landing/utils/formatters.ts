import { CURRENCY_SYMBOLS } from '../constants';

export class CurrencyFormatter {
  static format(amount: number, currency: string): string {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }

    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  static getSymbol(currency: string): string {
    return CURRENCY_SYMBOLS[currency] || currency;
  }
}

export class CreditFormatter {
  static format(rule: {
    creditsPer1kTokens?: number | null;
    creditsPerRequest: number;
  }): string {
    return rule.creditsPer1kTokens
      ? `${rule.creditsPer1kTokens}/1k`
      : String(rule.creditsPerRequest);
  }
}
