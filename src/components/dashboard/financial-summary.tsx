'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { formatCurrency } from '@/lib/utils'
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
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            After tax deductions
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(totalBills)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(paidPercentage)}% paid ({formatCurrency(paidBills)})
          </p>
        </CardContent>
      </Card>

      <Card className={`border-l-4 ${
        netAmount >= 0 ? 'border-l-green-500' : 'border-l-red-500'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            netAmount >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(netAmount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {netAmount >= 0 ? 'Surplus this month' : 'Deficit this month'}
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unpaid Bills</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(unpaidBills)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {upcomingBills} upcoming this week
          </p>
        </CardContent>
      </Card>
    </div>
  )
}