'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, getMonthName, getCurrentMonth, getCurrentYear } from '@/lib/utils'
import { Plus, Check, X, Clock, Edit } from 'lucide-react'
import type { Bill, BillStatus } from '@/types'

// Mock data - replace with actual database calls
const mockBills: Bill[] = [
  {
    id: '1',
    name: 'Rent',
    amount: 1200,
    dueDate: new Date(2025, 5, 1), // June 1st
    status: 'PAID',
    category: 'Housing',
    remarks: 'Paid via bank transfer',
    month: 6,
    year: 2025,
    paidDate: new Date(2025, 4, 30),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Electricity',
    amount: 150,
    dueDate: new Date(2025, 5, 15), // June 15th
    status: 'UNPAID',
    category: 'Utilities',
    month: 6,
    year: 2025,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Internet',
    amount: 80,
    dueDate: new Date(2025, 5, 20), // June 20th
    status: 'UNPAID',
    category: 'Utilities',
    month: 6,
    year: 2025,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

function getStatusIcon(status: BillStatus) {
  switch (status) {
    case 'PAID':
      return <Check className="h-4 w-4 text-green-600" />
    case 'UNPAID':
      return <Clock className="h-4 w-4 text-orange-600" />
    case 'OVERDUE':
      return <X className="h-4 w-4 text-red-600" />
    case 'PARTIAL':
      return <Clock className="h-4 w-4 text-yellow-600" />
  }
}

function getStatusColor(status: BillStatus) {
  switch (status) {
    case 'PAID':
      return 'text-green-600 bg-green-50'
    case 'UNPAID':
      return 'text-orange-600 bg-orange-50'
    case 'OVERDUE':
      return 'text-red-600 bg-red-50'
    case 'PARTIAL':
      return 'text-yellow-600 bg-yellow-50'
  }
}

export default function BillsPage() {
  const [bills, setBills] = useState(mockBills)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
  const [selectedYear, setSelectedYear] = useState(getCurrentYear())

  const filteredBills = bills.filter(bill => 
    bill.month === selectedMonth && bill.year === selectedYear
  )

  const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.amount, 0)
  const paidAmount = filteredBills
    .filter(bill => bill.status === 'PAID')
    .reduce((sum, bill) => sum + bill.amount, 0)
  const unpaidAmount = totalAmount - paidAmount

  const markAsPaid = (billId: string) => {
    setBills(prevBills => 
      prevBills.map(bill => 
        bill.id === billId 
          ? { ...bill, status: 'PAID' as BillStatus, paidDate: new Date() }
          : bill
      )
    )
  }

  const markAsUnpaid = (billId: string) => {
    setBills(prevBills => 
      prevBills.map(bill => 
        bill.id === billId 
          ? { ...bill, status: 'UNPAID' as BillStatus, paidDate: undefined }
          : bill
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bills</h1>
          <p className="text-muted-foreground">
            Manage your bills for {getMonthName(selectedMonth)} {selectedYear}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Bill
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unpaid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(unpaidAmount)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bills for {getMonthName(selectedMonth)} {selectedYear}</CardTitle>
          <CardDescription>
            Manage your monthly bills and payment status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(bill.status)}
                  <div>
                    <div className="font-medium">{bill.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Due: {bill.dueDate.toLocaleDateString()} • {bill.category}
                    </div>
                    {bill.remarks && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {bill.remarks}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(bill.amount)}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {bill.status === 'PAID' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsUnpaid(bill.id)}
                      >
                        Mark Unpaid
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => markAsPaid(bill.id)}
                      >
                        Mark Paid
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredBills.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No bills found for this month. Add your first bill to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}