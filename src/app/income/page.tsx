'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IncomeForm } from '@/components/forms/income-form'
import { DeleteConfirmDialog } from '@/components/ui/alert-dialog'
import { SearchFilter } from '@/components/ui/search-filter'
import { formatCurrency, getMonthName, getCurrentMonth, getCurrentYear } from '@/lib/utils'
import { INCOME_CATEGORIES } from '@/lib/constants'
import { Plus, DollarSign, Edit, Trash2, Calendar } from 'lucide-react'
import type { Income } from '@/types'

export default function IncomePage() {
  const [income, setIncome] = useState<Income[]>([])
  const [filteredIncome, setFilteredIncome] = useState<Income[]>([])
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
  const [selectedYear, setSelectedYear] = useState(getCurrentYear())
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [editingIncome, setEditingIncome] = useState<Income | undefined>()
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; income?: Income }>({
    open: false,
    income: undefined
  })
  const [loading, setLoading] = useState(true)

  // Mock data for now - replace with API calls later
  useEffect(() => {
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
      {
        id: '2',
        source: 'Freelance Client A',
        description: 'Web development project',
        amount: 1500,
        taxDeduction: 150,
        netAmount: 1350,
        date: new Date(2025, 5, 15),
        month: 6,
        year: 2025,
        category: 'Freelance',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        source: 'Investment Returns',
        description: 'Stock dividends',
        amount: 800,
        taxDeduction: 120,
        netAmount: 680,
        date: new Date(2025, 5, 20),
        month: 6,
        year: 2025,
        category: 'Investment',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    setIncome(mockIncome)
    setLoading(false)
  }, [])

  // Filter income based on month/year and search/filter criteria
  useEffect(() => {
    let filtered = income.filter(item => 
      item.month === selectedMonth && item.year === selectedYear
    )
    setFilteredIncome(filtered)
  }, [income, selectedMonth, selectedYear])

  const handleSearch = (query: string) => {
    const monthlyIncome = income.filter(item => 
      item.month === selectedMonth && item.year === selectedYear
    )
    
    if (!query) {
      setFilteredIncome(monthlyIncome)
      return
    }
    
    const filtered = monthlyIncome.filter(item =>
      item.source.toLowerCase().includes(query.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(query.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(query.toLowerCase())) ||
      (item.remarks && item.remarks.toLowerCase().includes(query.toLowerCase()))
    )
    setFilteredIncome(filtered)
  }

  const handleFilter = (filters: Record<string, string>) => {
    let filtered = income.filter(item => 
      item.month === selectedMonth && item.year === selectedYear
    )
    
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category)
    }
    
    setFilteredIncome(filtered)
  }

  const totalGross = filteredIncome.reduce((sum, item) => sum + item.amount, 0)
  const totalTax = filteredIncome.reduce((sum, item) => sum + item.taxDeduction, 0)
  const totalNet = filteredIncome.reduce((sum, item) => sum + item.netAmount, 0)

  const handleAddIncome = (newIncome: Partial<Income>) => {
    const income_item: Income = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...newIncome
    } as Income
    
    setIncome(prev => [...prev, income_item])
    
    if (window.toast) {
      window.toast('Income added successfully!', 'success')
    }
  }

  const handleEditIncome = (updatedIncome: Partial<Income>) => {
    setIncome(prev => 
      prev.map(item => 
        item.id === editingIncome?.id 
          ? { ...item, ...updatedIncome, updatedAt: new Date() }
          : item
      )
    )
    setEditingIncome(undefined)
    
    if (window.toast) {
      window.toast('Income updated successfully!', 'success')
    }
  }

  const handleDeleteIncome = (incomeId: string) => {
    setIncome(prev => prev.filter(item => item.id !== incomeId))
    
    if (window.toast) {
      window.toast('Income deleted successfully!', 'success')
    }
  }

  const openEditForm = (income: Income) => {
    setEditingIncome(income)
    setShowIncomeForm(true)
  }

  const openDeleteDialog = (income: Income) => {
    setDeleteDialog({ open: true, income })
  }

  const confirmDelete = () => {
    if (deleteDialog.income) {
      handleDeleteIncome(deleteDialog.income.id)
    }
    setDeleteDialog({ open: false, income: undefined })
  }

  const generateMonthOptions = () => {
    const options = []
    for (let year = getCurrentYear(); year >= getCurrentYear() - 2; year--) {
      for (let month = 12; month >= 1; month--) {
        options.push({ month, year })
      }
    }
    return options
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Income</h1>
          <p className="text-muted-foreground">
            Track your income for {getMonthName(selectedMonth)} {selectedYear}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <select 
              value={`${selectedMonth}-${selectedYear}`}
              onChange={(e) => {
                const [month, year] = e.target.value.split('-')
                setSelectedMonth(parseInt(month))
                setSelectedYear(parseInt(year))
              }}
              className="border rounded-md px-2 py-1 text-sm"
            >
              {generateMonthOptions().map(({ month, year }) => (
                <option key={`${month}-${year}`} value={`${month}-${year}`}>
                  {getMonthName(month)} {year}
                </option>
              ))}
            </select>
          </div>
          
          <Button onClick={() => setShowIncomeForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Income
          </Button>
        </div>
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
        <CardContent className="space-y-4">
          <SearchFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            categories={INCOME_CATEGORIES}
            placeholder="Search income by source, description, or category..."
            showCategoryFilter={true}
            showStatusFilter={false}
          />
          
          <div className="space-y-4">
            {filteredIncome.map((item) => {
              const taxPercentage = item.amount > 0 ? (item.taxDeduction / item.amount) * 100 : 0
              
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <DollarSign className="h-5 w-5 text-green-600" />
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
                          -{formatCurrency(item.taxDeduction)} <span className="text-xs text-muted-foreground">({taxPercentage.toFixed(1)}%)</span>
                        </div>
                      )}
                      <div className="font-semibold text-green-600">
                        {formatCurrency(item.netAmount)} <span className="text-xs text-muted-foreground">net</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditForm(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openDeleteDialog(item)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredIncome.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No income found. Try adjusting your search or filters, or add your first income entry.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <IncomeForm
        open={showIncomeForm}
        onOpenChange={(open) => {
          setShowIncomeForm(open)
          if (!open) setEditingIncome(undefined)
        }}
        onSubmit={editingIncome ? handleEditIncome : handleAddIncome}
        income={editingIncome}
        mode={editingIncome ? 'edit' : 'add'}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, income: deleteDialog.income })}
        onConfirm={confirmDelete}
        title="Delete Income"
        description={`Are you sure you want to delete "${deleteDialog.income?.source}"? This action cannot be undone.`}
      />
    </div>
  )
}