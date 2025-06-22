export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'JPY' },
  PHP: { symbol: '₱', name: 'Philippine Peso', code: 'PHP' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', code: 'AUD' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD' },
  CHF: { symbol: 'Fr', name: 'Swiss Franc', code: 'CHF' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', code: 'CNY' },
  INR: { symbol: '₹', name: 'Indian Rupee', code: 'INR' },
} as const

export type CurrencyCode = keyof typeof CURRENCIES

// Get currency from localStorage or default to USD
export function getCurrentCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return 'USD'
  return (localStorage.getItem('currency') as CurrencyCode) || 'USD'
}

// Set currency in localStorage
export function setCurrency(currency: CurrencyCode) {
  if (typeof window === 'undefined') return
  localStorage.setItem('currency', currency)
  // Trigger a custom event to update other components
  window.dispatchEvent(new CustomEvent('currencyChanged', { detail: currency }))
}

// Format currency with dynamic currency support
export function formatCurrency(amount: number, currencyCode?: CurrencyCode): string {
  const currency = currencyCode || getCurrentCurrency()
  const currencyInfo = CURRENCIES[currency]
  
  // For JPY and other currencies that don't use decimals
  const minimumFractionDigits = ['JPY', 'KRW'].includes(currency) ? 0 : 2
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits,
      maximumFractionDigits: minimumFractionDigits,
    }).format(amount)
  } catch (error) {
    // Fallback if Intl.NumberFormat doesn't support the currency
    return `${currencyInfo.symbol}${amount.toFixed(minimumFractionDigits)}`
  }
}

// Get currency symbol
export function getCurrencySymbol(currencyCode?: CurrencyCode): string {
  const currency = currencyCode || getCurrentCurrency()
  return CURRENCIES[currency].symbol
}

// Get currency name
export function getCurrencyName(currencyCode?: CurrencyCode): string {
  const currency = currencyCode || getCurrentCurrency()
  return CURRENCIES[currency].name
}