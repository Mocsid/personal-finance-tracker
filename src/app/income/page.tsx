'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, getMonthName, getCurrentMonth, getCurrentYear } from '@/lib/utils'
import { Plus, DollarSign, TrendingUp, Edit } from 'lucide-react'
import type { Income } from '@/types'

// Mock data - replace with actual database calls
const mockIncome: Income[] = [
  {
    id: '1',
    source: 'TechCorp Inc.',
    description: 'Monthly salary',
    amount: 5000,
    taxDeduction: 1000,
    netAmount: 4000,
    date: new Date(2025, 5, 1), // June 1st
    month: 6,
    year: 2025,
    category: 'Salary',
    remarks: 'Regular monthly payment',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    source: 'Freelance Client A',
    description: 'Web development project',
    amount: 1500,
    taxDeduction: 0,
    netAmount: 1500,
    date: new Date(2025, 5, 15), // June 15th
    month: 6,
    year: 2025,
    category: 'Freelance',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function IncomePage() {
  const [income, setIncome] = useState(mockIncome)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
  const [selectedYear, setSelectedYear] = useState(getCurrentYear())

  const filteredIncome = income.filter(item => 
    item.month === selectedMonth && item.year === selectedYear
  )

  const totalGross = filteredIncome.reduce((sum, item) => sum + item.amount, 0)
  const totalTax = filteredIncome.reduce((sum, item) => sum + item.taxDeduction, 0)
  const totalNet = filteredIncome.reduce((sum, item) => sum + item.netAmount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Income</h1>
          <p className="text-muted-foreground">
            Track your income for {getMonthName(selectedMonth)} {selectedYear}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Income
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gross Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalGross)}</div>
            <p className="text-xs text-muted-foreground">Before tax deductions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tax Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalTax)}</div>
            <p className="text-xs text-muted-foreground">
              {totalGross > 0 ? `${((totalTax / totalGross) * 100).toFixed(1)}%` : '0%'} of gross
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalNet)}</div>
            <p className="text-xs text-muted-foreground">After tax deductions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income for {getMonthName(selectedMonth)} {selectedYear}</CardTitle>
          <CardDescription>
            Track all your income sources and tax deductions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIncome.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-medium">{item.source}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.description} • {item.date.toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.category} {item.remarks && `• ${item.remarks}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right space-y-1">
                    <div className="font-medium text-blue-600">
                      {formatCurrency(item.amount)} <span className="text-xs text-muted-foreground">gross</span>
                    </div>
                    {item.taxDeduction > 0 && (
                      <div className="text-sm text-red-600">
                        -{formatCurrency(item.taxDeduction)} <span className="text-xs text-muted-foreground">tax</span>
                      </div>
                    )}
                    <div className="font-semibold text-green-600">
                      {formatCurrency(item.netAmount)} <span className="text-xs text-muted-foreground">net</span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredIncome.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No income recorded for this month. Add your first income entry to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}