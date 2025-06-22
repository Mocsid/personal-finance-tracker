'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { CurrencyCode, getCurrentCurrency, setCurrency as setCurrencyStorage } from '@/lib/currency'

interface CurrencyContextType {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD')

  useEffect(() => {
    // Set initial currency from localStorage
    setCurrencyState(getCurrentCurrency())
    
    // Listen for currency changes from other components
    const handleCurrencyChange = (event: CustomEvent<CurrencyCode>) => {
      setCurrencyState(event.detail)
    }
    
    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener)
    
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener)
    }
  }, [])

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency)
    setCurrencyStorage(newCurrency)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}