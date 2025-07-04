'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IncomeForm } from '@/components/forms/income-form'
import { DeleteConfirmDialog } from '@/components/ui/alert-dialog'
import { SearchFilter } from '@/components/ui/search-filter'
import { Tooltip } from '@/components/ui/tooltip'
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

  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleNewIncome = () => {
      setShowIncomeForm(true)
    }

    window.addEventListener('newIncome', handleNewIncome)
    return () => window.removeEventListener('newIncome', handleNewIncome)
  }, [])

  // Fetch income data from API
  useEffect(() => {
    async function fetchIncome() {
      setLoading(true)
      try {
        const res = await fetch(`/api/income?month=${selectedMonth}&year=${selectedYear}`)
        const data = await res.json()
        setIncome(data || [])
      } catch (error) {
        console.error('Error fetching income:', error)
        setIncome([])
      }
      setLoading(false)
    }

    fetchIncome()
  }, [selectedMonth, selectedYear])

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
  const averageTaxRate = totalGross > 0 ? (totalTax / totalGross) * 100 : 0

  const handleAddIncome = async (newIncome: Partial<Income>) => {
    try {
      const incomePayload = {
        source: newIncome.source,
        description: newIncome.description,
        amount: String(newIncome.amount),
        taxDeduction: String(newIncome.taxDeduction || 0),
        date: newIncome.date instanceof Date ? newIncome.date.toISOString() : newIncome.date,
        category: newIncome.category,
        remarks: newIncome.remarks,
        month: newIncome.month,
        year: newIncome.year,
      }

      const res = await fetch('/api/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incomePayload),
      })

      if (!res.ok) throw new Error('Failed to save income')
      
      const savedIncome = await res.json()
      setIncome(prev => [...prev, savedIncome])
      
      if (window.toast) {
        window.toast('Income added successfully!', 'success')
      }
    } catch (error) {
      console.error('Error adding income:', error)
      if (window.toast) {
        window.toast('Failed to save income', 'error')
      }
    }
  }

  const handleEditIncome = async (updatedIncome: Partial<Income>) => {
    try {
      if (!editingIncome) return

      const incomePayload = {
        source: updatedIncome.source,
        description: updatedIncome.description,
        amount: String(updatedIncome.amount),
        taxDeduction: String(updatedIncome.taxDeduction || 0),
        date: updatedIncome.date instanceof Date ? updatedIncome.date.toISOString() : updatedIncome.date,
        category: updatedIncome.category,
        remarks: updatedIncome.remarks,
        month: updatedIncome.month,
        year: updatedIncome.year,
      }

      const res = await fetch(`/api/income/${editingIncome.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incomePayload),
      })

      if (!res.ok) throw new Error('Failed to update income')

      const savedIncome = await res.json()
      setIncome(prev => 
        prev.map(item => 
          item.id === editingIncome.id ? savedIncome : item
        )
      )
      setEditingIncome(undefined)
      
      if (window.toast) {
        window.toast('Income updated successfully!', 'success')
      }
    } catch (error) {
      console.error('Error updating income:', error)
      if (window.toast) {
        window.toast('Failed to update income', 'error')
      }
    }
  }

  const handleDeleteIncome = async (incomeId: string) => {
    try {
      const res = await fetch(`/api/income/${incomeId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete income')
      
      setIncome(prev => prev.filter(item => item.id !== incomeId))
      
      if (window.toast) {
        window.toast('Income deleted successfully!', 'success')
      }
    } catch (error) {
      console.error('Error deleting income:', error)
      if (window.toast) {
        window.toast('Failed to delete income', 'error')
      }
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
            {averageTaxRate > 0 && (
              <span className="text-blue-600 ml-2">
                • {averageTaxRate.toFixed(1)}% avg tax rate
              </span>
            )}
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
              className="border rounded-md px-2 py-1 text-sm bg-background"
            >
              {generateMonthOptions().map(({ month, year }) => (
                <option key={`${month}-${year}`} value={`${month}-${year}`}>
                  {getMonthName(month)} {year}
                </option>
              ))}
            </select>
          </div>
          
          <Tooltip content="Add new income (n i)">
            <Button onClick={() => setShowIncomeForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Income
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gross Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalGross)}</div>
            <p className="text-xs text-muted-foreground">
              Before tax deductions ({filteredIncome.length} sources)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tax Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalTax)}</div>
            <p className="text-xs text-muted-foreground">
              {totalGross > 0 ? `${averageTaxRate.toFixed(1)}%` : '0%'} of gross income
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalNet)}</div>
            <p className="text-xs text-muted-foreground">
              After all tax deductions
            </p>
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
            categories={[...INCOME_CATEGORIES]}
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
                      <Tooltip content="Edit income">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditForm(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete income">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openDeleteDialog(item)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Tooltip>
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

          {filteredIncome.length > 0 && totalTax > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-800 dark:text-blue-200">
                  💡 <strong>Tax Insight:</strong> You're paying {averageTaxRate.toFixed(1)}% in taxes this month
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {formatCurrency(totalTax)} total deductions
                </span>
              </div>
            </div>
          )}
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