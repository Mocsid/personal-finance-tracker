'use client'

import { useEffect, useState } from 'react'
import { useCurrency } from '@/components/currency/currency-provider'
import { formatCurrency as formatCurrencyIntl } from '@/lib/currency'

interface CurrencyDisplayProps {
  amount: number
  className?: string
}

export function CurrencyDisplay({ amount, className }: CurrencyDisplayProps) {
  const { currency } = useCurrency()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder during SSR that matches the expected format
    return (
      <span className={className}>
        ${amount.toFixed(2)}
      </span>
    )
  }

  return (
    <span className={className}>
      {formatCurrencyIntl(amount, currency)}
    </span>
  )
}