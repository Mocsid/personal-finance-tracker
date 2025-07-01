'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Select } from '../ui/select'
import { Download, FileText, Table } from 'lucide-react'
import { formatCurrency, getMonthName } from '@/lib/utils'
import type { Bill, Income } from '@/types'

interface DataExportProps {
  bills: Bill[]
  income: Income[]
}

export function DataExport({ bills, income }: DataExportProps) {
  const [exportType, setExportType] = useState('json')
  const [dateRange, setDateRange] = useState('current-month')

  const getCurrentMonthData = () => {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    
    return {
      bills: bills.filter(bill => bill.month === currentMonth && bill.year === currentYear),
      income: income.filter(item => item.month === currentMonth && item.year === currentYear)
    }
  }

  const getAllData = () => ({ bills, income })

  const getDataForExport = () => {
    switch (dateRange) {
      case 'current-month':
        return getCurrentMonthData()
      case 'all-time':
        return getAllData()
      default:
        return getCurrentMonthData()
    }
  }

  const exportToJSON = () => {
    const data = getDataForExport()
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finance-data-${dateRange}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    if (window.toast) {
      window.toast('Data exported successfully!', 'success')
    }
  }

  const exportToCSV = () => {
    const data = getDataForExport()
    
    // Bills CSV
    const billsCSV = [
      ['Type', 'Name', 'Amount', 'Due Date', 'Status', 'Category', 'Remarks'].join(','),
      ...data.bills.map(bill => [
        'Bill',
        `"${bill.name}"`,
        bill.amount,
        new Date(bill.dueDate).toISOString().split('T')[0],
        bill.status,
        bill.category,
        `"${bill.remarks || ''}"`
      ].join(','))
    ].join('\n')
    
    // Income CSV
    const incomeCSV = [
      ['Type', 'Source', 'Description', 'Gross Amount', 'Tax Deduction', 'Net Amount', 'Date', 'Category', 'Remarks'].join(','),
      ...data.income.map(item => [
        'Income',
        `"${item.source}"`,
        `"${item.description || ''}"`,
        item.amount,
        item.taxDeduction,
        item.netAmount,
        new Date(item.date).toISOString().split('T')[0],
        item.category || '',
        `"${item.remarks || ''}"`
      ].join(','))
    ].join('\n')
    
    const combinedCSV = billsCSV + '\n' + incomeCSV
    
    const blob = new Blob([combinedCSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finance-data-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    if (window.toast) {
      window.toast('Data exported successfully!', 'success')
    }
  }

  const handleExport = () => {
    switch (exportType) {
      case 'json':
        exportToJSON()
        break
      case 'csv':
        exportToCSV()
        break
    }
  }

  const data = getDataForExport()
  const totalBills = data.bills.reduce((sum, bill) => sum + bill.amount, 0)
  const totalIncome = data.income.reduce((sum, item) => sum + item.netAmount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Export Data</h1>
        <p className="text-muted-foreground">
          Download your financial data for backup or external analysis
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Export Settings</CardTitle>
            <CardDescription>Configure your data export</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                <option value="current-month">Current Month</option>
                <option value="all-time">All Time</option>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select value={exportType} onChange={(e) => setExportType(e.target.value)}>
                <option value="json">JSON (Complete Data)</option>
                <option value="csv">CSV (Spreadsheet)</option>
              </Select>
            </div>
            
            <Button onClick={handleExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Preview</CardTitle>
            <CardDescription>
              Data to be exported ({dateRange === 'current-month' ? 'Current Month' : 'All Time'})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{data.bills.length}</div>
                <div className="text-sm text-muted-foreground">Bills</div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(totalBills)}
                </div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">{data.income.length}</div>
                <div className="text-sm text-muted-foreground">Income</div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(totalIncome)}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                {exportType === 'json' ? (
                  <FileText className="h-4 w-4 text-blue-600" />
                ) : (
                  <Table className="h-4 w-4 text-green-600" />
                )}
                <span>
                  {exportType === 'json' ? 'JSON format with complete metadata' : 'CSV format for spreadsheet apps'}
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                File will include all {exportType === 'json' ? 'fields and relationships' : 'essential data fields'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Security</CardTitle>
          <CardDescription>Important information about your data export</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <div className="font-medium">Local Export Only</div>
                <div className="text-muted-foreground">Your data is exported directly to your device. No data is sent to external servers.</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <div className="font-medium">Privacy Protected</div>
                <div className="text-muted-foreground">Exported files contain only your personal financial data. No system metadata or sensitive information is included.</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <div className="font-medium">Secure Storage</div>
                <div className="text-muted-foreground">Please store exported files securely. Consider encrypting sensitive financial data before sharing or storing in cloud services.</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}