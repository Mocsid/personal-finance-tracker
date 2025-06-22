import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safe currency formatting that works during SSR
export function formatCurrency(amount: number): string {
  // During SSR, use USD as default to prevent hydration mismatch
  if (typeof window === 'undefined') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }
  
  // On client, use the dynamic currency from our currency system
  const { formatCurrency: formatCurrencyDynamic } = require('./currency')
  return formatCurrencyDynamic(amount)
}

// Safe currency formatting for components that need dynamic updates
export function formatCurrencyDynamic(amount: number, currency?: string): string {
  if (typeof window === 'undefined') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }
  
  const { formatCurrency: formatCurrencyIntl } = require('./currency')
  return formatCurrencyIntl(amount, currency)
}

export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[month - 1] || 'Unknown'
}

export function getCurrentMonth(): number {
  return new Date().getMonth() + 1
}

export function getCurrentYear(): number {
  return new Date().getFullYear()
}

// Get next month/year
export function getNextMonth(month: number, year: number): { month: number; year: number } {
  if (month === 12) {
    return { month: 1, year: year + 1 }
  }
  return { month: month + 1, year }
}

// Get previous month/year
export function getPreviousMonth(month: number, year: number): { month: number; year: number } {
  if (month === 1) {
    return { month: 12, year: year - 1 }
  }
  return { month: month - 1, year }
}

// Check if a month/year combination exists in the future
export function isFutureMonth(month: number, year: number): boolean {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  
  if (year > currentYear) return true
  if (year === currentYear && month > currentMonth) return true
  return false
}

// Format date consistently
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Get the due date for a bill in a specific month/year
export function getBillDueDateForMonth(dueDay: number, month: number, year: number): Date {
  // Handle end of month scenarios
  const lastDayOfMonth = new Date(year, month, 0).getDate()
  const actualDueDay = Math.min(dueDay, lastDayOfMonth)
  
  return new Date(year, month - 1, actualDueDay)
}