'use client'

import { useState, useEffect } from 'react'
import { DataExport } from '@/components/export/data-export'
import type { Bill, Income } from '@/types'

export default function ExportPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [income, setIncome] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true)
      try {
        // Fetch all bills and income data (across all months/years)
        const [billsRes, incomeRes] = await Promise.all([
          fetch('/api/bills'),
          fetch('/api/income')
        ])
        
        const [billsData, incomeData] = await Promise.all([
          billsRes.json(),
          incomeRes.json()
        ])
        
        setBills(billsData || [])
        setIncome(incomeData || [])
      } catch (error) {
        console.error('Error fetching export data:', error)
        setBills([])
        setIncome([])
      }
      setLoading(false)
    }

    fetchAllData()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return <DataExport bills={bills} income={income} />
}