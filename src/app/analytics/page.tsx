'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, getMonthName } from '@/lib/utils'
import { TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react'
import type { Bill, Income } from '@/types'

export default function AnalyticsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [income, setIncome] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for analytics
    const mockBills: Bill[] = [
      {
        id: '1', name: 'Rent', amount: 1200, dueDate: new Date(2025, 5, 1), status: 'PAID',
        category: 'Housing', month: 6, year: 2025, createdAt: new Date(), updatedAt: new Date(),
      },
      {
        id: '2', name: 'Electricity', amount: 150, dueDate: new Date(2025, 5, 15), status: 'UNPAID',
        category: 'Utilities', month: 6, year: 2025, createdAt: new Date(), updatedAt: new Date(),
      },
      {
        id: '3', name: 'Internet', amount: 80, dueDate: new Date(2025, 5, 20), status: 'PAID',
        category: 'Utilities', month: 6, year: 2025, createdAt: new Date(), updatedAt: new Date(),
      },
      // Previous month data
      {
        id: '4', name: 'Rent', amount: 1200, dueDate: new Date(2025, 4, 1), status: 'PAID',
        category: 'Housing', month: 5, year: 2025, createdAt: new Date(), updatedAt: new Date(),
      },
      {
        id: '5', name: 'Electricity', amount: 140, dueDate: new Date(2025, 4, 15), status: 'PAID',
        category: 'Utilities', month: 5, year: 2025, createdAt: new Date(), updatedAt: new Date(),
      },
    ]

    const mockIncome: Income[] = [
      {
        id: '1', source: 'TechCorp Inc.', amount: 5000, taxDeduction: 1000, netAmount: 4000,
        date: new Date(2025, 5, 1), month: 6, year: 2025, category: 'Salary',
        createdAt: new Date(), updatedAt: new Date(),
      },
      {
        id: '2', source: 'Freelance', amount: 1500, taxDeduction: 150, netAmount: 1350,
        date: new Date(2025, 5, 15), month: 6, year: 2025, category: 'Freelance',
        createdAt: new Date(), updatedAt: new Date(),
      },
      // Previous month
      {
        id: '3', source: 'TechCorp Inc.', amount: 5000, taxDeduction: 1000, netAmount: 4000,
        date: new Date(2025, 4, 1), month: 5, year: 2025, category: 'Salary',
        createdAt: new Date(), updatedAt: new Date(),
      },
    ]

    setBills(mockBills)
    setIncome(mockIncome)
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  // Current month analysis
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1
  const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear

  const currentBills = bills.filter(b => b.month === currentMonth && b.year === currentYear)
  const previousBills = bills.filter(b => b.month === previousMonth && b.year === previousYear)
  const currentIncome = income.filter(i => i.month === currentMonth && i.year === currentYear)
  const previousIncome = income.filter(i => i.month === previousMonth && i.year === previousYear)

  const currentTotalBills = currentBills.reduce((sum, bill) => sum + bill.amount, 0)
  const previousTotalBills = previousBills.reduce((sum, bill) => sum + bill.amount, 0)
  const currentTotalIncome = currentIncome.reduce((sum, item) => sum + item.netAmount, 0)
  const previousTotalIncome = previousIncome.reduce((sum, item) => sum + item.netAmount, 0)

  const billsChange = previousTotalBills > 0 ? ((currentTotalBills - previousTotalBills) / previousTotalBills) * 100 : 0
  const incomeChange = previousTotalIncome > 0 ? ((currentTotalIncome - previousTotalIncome) / previousTotalIncome) * 100 : 0

  // Category breakdown
  const billsByCategory = currentBills.reduce((acc, bill) => {
    acc[bill.category] = (acc[bill.category] || 0) + bill.amount
    return acc
  }, {} as Record<string, number>)

  const incomeByCategory = currentIncome.reduce((acc, item) => {
    const category = item.category || 'Other'
    acc[category] = (acc[category] || 0) + item.netAmount
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Financial insights and trends for {getMonthName(currentMonth)} {currentYear}
        </p>
      </div>

      {/* Month-over-Month Comparison */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bills Trend</CardTitle>
            {billsChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-red-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentTotalBills)}</div>
            <p className={`text-xs ${
              billsChange >= 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {billsChange >= 0 ? '+' : ''}{billsChange.toFixed(1)}% from last month
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Previous: {formatCurrency(previousTotalBills)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income Trend</CardTitle>
            {incomeChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentTotalIncome)}</div>
            <p className={`text-xs ${
              incomeChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}% from last month
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Previous: {formatCurrency(previousTotalIncome)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdowns */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Bills by Category</span>
            </CardTitle>
            <CardDescription>Current month spending breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(billsByCategory)
                .sort(([,a], [,b]) => b - a)
                .map(([category, amount]) => {
                  const percentage = (amount / currentTotalBills) * 100
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{category}</span>
                        <span className="font-medium">{formatCurrency(amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {percentage.toFixed(1)}% of total bills
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Income by Source</span>
            </CardTitle>
            <CardDescription>Current month income breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(incomeByCategory)
                .sort(([,a], [,b]) => b - a)
                .map(([category, amount]) => {
                  const percentage = (amount / currentTotalIncome) * 100
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{category}</span>
                        <span className="font-medium">{formatCurrency(amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {percentage.toFixed(1)}% of total income
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Ratios */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Ratios & Insights</CardTitle>
          <CardDescription>Key financial health indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {((currentTotalIncome / currentTotalBills) * 100).toFixed(0)}%
              </div>
              <div className="text-sm font-medium">Income Coverage</div>
              <div className="text-xs text-muted-foreground mt-1">
                How much your income covers your bills
              </div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(currentTotalIncome - currentTotalBills)}
              </div>
              <div className="text-sm font-medium">Net Savings</div>
              <div className="text-xs text-muted-foreground mt-1">
                {currentTotalIncome > currentTotalBills ? 'Surplus' : 'Deficit'} this month
              </div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {currentBills.filter(b => b.status === 'PAID').length}/{currentBills.length}
              </div>
              <div className="text-sm font-medium">Bills Paid</div>
              <div className="text-xs text-muted-foreground mt-1">
                {((currentBills.filter(b => b.status === 'PAID').length / currentBills.length) * 100).toFixed(0)}% completion rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}