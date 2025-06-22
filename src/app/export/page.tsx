'use client'

import { useState, useEffect } from 'react'
import { DataExport } from '@/components/export/data-export'
import type { Bill, Income } from '@/types'

export default function ExportPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [income, setIncome] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockBills: Bill[] = [
      {
        id: '1',
        name: 'Rent',
        amount: 1200,
        dueDate: new Date(2025, 5, 1),
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
        dueDate: new Date(2025, 5, 15),
        status: 'UNPAID',
        category: 'Utilities',
        month: 6,
        year: 2025,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const mockIncome: Income[] = [
      {
        id: '1',
        source: 'TechCorp Inc.',
        description: 'Monthly salary',
        amount: 5000,
        taxDeduction: 1000,
        netAmount: 4000,
        date: new Date(2025, 5, 1),
        month: 6,
        year: 2025,
        category: 'Salary',
        remarks: 'Regular monthly payment',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    setBills(mockBills)
    setIncome(mockIncome)
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return <DataExport bills={bills} income={income} />
}