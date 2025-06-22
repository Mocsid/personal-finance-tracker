'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { CurrencyDisplay } from '../ui/currency-display'
import { Tooltip } from '../ui/tooltip'
import { DollarSign, Receipt, TrendingUp, AlertCircle } from 'lucide-react'

interface FinancialSummaryProps {
  totalIncome: number
  totalBills: number
  paidBills: number
  unpaidBills: number
  upcomingBills: number
}

export function FinancialSummary({ 
  totalIncome, 
  totalBills, 
  paidBills, 
  unpaidBills, 
  upcomingBills 
}: FinancialSummaryProps) {
  const netAmount = totalIncome - totalBills
  const paidPercentage = totalBills > 0 ? (paidBills / totalBills) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <Tooltip content="Your total income after tax deductions for this month">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </Tooltip>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            <CurrencyDisplay amount={totalIncome} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            After tax deductions
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
          <Tooltip content="Your total bills and expenses for this month">
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </Tooltip>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            <CurrencyDisplay amount={totalBills} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(paidPercentage)}% paid (<CurrencyDisplay amount={paidBills} />)
          </p>
        </CardContent>
      </Card>

      <Card className={`border-l-4 ${
        netAmount >= 0 ? 'border-l-green-500' : 'border-l-red-500'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
          <Tooltip content={`Your ${netAmount >= 0 ? 'surplus' : 'deficit'} after paying all bills`}>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </Tooltip>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            netAmount >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <CurrencyDisplay amount={netAmount} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {netAmount >= 0 ? 'Surplus this month' : 'Deficit this month'}
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unpaid Bills</CardTitle>
          <Tooltip content="Bills that still need to be paid this month">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </Tooltip>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            <CurrencyDisplay amount={unpaidBills} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {upcomingBills} upcoming this week
          </p>
        </CardContent>
      </Card>
    </div>
  )
}