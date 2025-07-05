export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || 'USD'
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Personal Finance Tracker'
export const DATE_FORMAT = process.env.NEXT_PUBLIC_DATE_FORMAT || 'MM/dd/yyyy'

export const BILL_CATEGORIES = [
  'Housing',
  'Utilities',
  'Transportation',
  'Food',
  'Healthcare',
  'Insurance',
  'Entertainment',
  'Subscriptions',
  'Other'
] as const

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Rental',
  'Other'
] as const

export const BILL_STATUSES = [
  'PAID',
  'UNPAID', 
  'OVERDUE',
  'PARTIAL'
] as const