'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BillForm } from '@/components/forms/bill-form'
import { DeleteConfirmDialog } from '@/components/ui/alert-dialog'
import { SearchFilter } from '@/components/ui/search-filter'
import { RecurringBillManager } from '@/components/bills/recurring-bill-manager'
import { formatCurrency, getMonthName, getCurrentMonth, getCurrentYear } from '@/lib/utils'
import { BILL_CATEGORIES } from '@/lib/constants'
import { Plus, Check, X, Clock, Edit, Trash2, Calendar, Repeat } from 'lucide-react'
import type { Bill, BillStatus, BillTemplate, ExtendedBill } from '@/types'

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
      return 'text-green-600 bg-green-50 border-green-200'
    case 'UNPAID':
      return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'OVERDUE':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'PARTIAL':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  }
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [templates, setTemplates] = useState<BillTemplate[]>([])
  const [filteredBills, setFilteredBills] = useState<Bill[]>([])
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
  const [selectedYear, setSelectedYear] = useState(getCurrentYear())
  const [showBillForm, setShowBillForm] = useState(false)
  const [showRecurringManager, setShowRecurringManager] = useState(false)
  const [editingBill, setEditingBill] = useState<Bill | undefined>()
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; bill?: Bill }>({
    open: false,
    bill: undefined
  })
  const [loading, setLoading] = useState(true)

  // Mock data for now - replace with API calls later
  useEffect(() => {
    const mockBills: Bill[] = [
      {
        id: '1',
        templateId: 'template-1',
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
        templateId: 'template-2',
        name: 'Internet',
        amount: 80,
        dueDate: new Date(2025, 5, 15),
        status: 'PAID',
        category: 'Utilities',
        month: 6,
        year: 2025,
        paidDate: new Date(2025, 5, 14),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
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
      {
        id: '4',
        name: 'Car Insurance',
        amount: 200,
        dueDate: new Date(2025, 5, 25),
        status: 'OVERDUE',
        category: 'Insurance',
        month: 6,
        year: 2025,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    
    // Auto-mark overdue bills
    const updatedBills = mockBills.map(bill => {
      if (bill.status === 'UNPAID' && new Date() > bill.dueDate) {
        return { ...bill, status: 'OVERDUE' as BillStatus }
      }
      return bill
    })
    
    setBills(updatedBills)
    setLoading(false)
  }, [])

  // Filter bills based on month/year and search/filter criteria
  useEffect(() => {
    let filtered = bills.filter(bill => 
      bill.month === selectedMonth && bill.year === selectedYear
    )
    setFilteredBills(filtered)
  }, [bills, selectedMonth, selectedYear])

  const handleSearch = (query: string) => {
    const monthlyBills = bills.filter(bill => 
      bill.month === selectedMonth && bill.year === selectedYear
    )
    
    if (!query) {
      setFilteredBills(monthlyBills)
      return
    }
    
    const filtered = monthlyBills.filter(bill =>
      bill.name.toLowerCase().includes(query.toLowerCase()) ||
      bill.category.toLowerCase().includes(query.toLowerCase()) ||
      (bill.remarks && bill.remarks.toLowerCase().includes(query.toLowerCase()))
    )
    setFilteredBills(filtered)
  }

  const handleFilter = (filters: Record<string, string>) => {
    let filtered = bills.filter(bill => 
      bill.month === selectedMonth && bill.year === selectedYear
    )
    
    if (filters.category) {
      filtered = filtered.filter(bill => bill.category === filters.category)
    }
    
    if (filters.status) {
      filtered = filtered.filter(bill => bill.status === filters.status)
    }
    
    setFilteredBills(filtered)
  }

  const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.amount, 0)
  const paidAmount = filteredBills
    .filter(bill => bill.status === 'PAID')
    .reduce((sum, bill) => sum + bill.amount, 0)
  const unpaidAmount = totalAmount - paidAmount

  const handleAddBill = (newBill: Partial<ExtendedBill>) => {
    const bill: Bill = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...newBill
    } as Bill
    
    setBills(prev => [...prev, bill])
    
    // If this is a recurring bill, also create a template
    if (newBill.createTemplate && newBill.templateData) {
      const template: BillTemplate = {
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...newBill.templateData
      } as BillTemplate
      
      setTemplates(prev => [...prev, template])
      
      // Link the bill to the template
      bill.templateId = template.id
      
      if (window.toast) {
        window.toast('Bill and recurring template created successfully!', 'success')
      }
    } else {
      if (window.toast) {
        window.toast('Bill added successfully!', 'success')
      }
    }
  }

  const handleGenerateBills = (newBills: Partial<Bill>[]) => {
    const billsToAdd: Bill[] = newBills.map(billData => ({
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...billData
    })) as Bill[]
    
    setBills(prev => [...prev, ...billsToAdd])
  }

  const handleEditBill = (updatedBill: Partial<Bill>) => {
    setBills(prev => 
      prev.map(item => 
        item.id === editingBill?.id 
          ? { ...item, ...updatedBill, updatedAt: new Date() }
          : item
      )
    )
    setEditingBill(undefined)
    
    if (window.toast) {
      window.toast('Bill updated successfully!', 'success')
    }
  }

  const handleDeleteBill = (billId: string) => {
    setBills(prev => prev.filter(item => item.id !== billId))
    
    if (window.toast) {
      window.toast('Bill deleted successfully!', 'success')
    }
  }

  const markAsPaid = (billId: string) => {
    setBills(prev => 
      prev.map(bill => 
        bill.id === billId 
          ? { ...bill, status: 'PAID' as BillStatus, paidDate: new Date(), updatedAt: new Date() }
          : bill
      )
    )
    
    if (window.toast) {
      window.toast('Bill marked as paid!', 'success')
    }
  }

  const markAsUnpaid = (billId: string) => {
    setBills(prev => 
      prev.map(bill => 
        bill.id === billId 
          ? { ...bill, status: 'UNPAID' as BillStatus, paidDate: undefined, updatedAt: new Date() }
          : bill
      )
    )
    
    if (window.toast) {
      window.toast('Bill marked as unpaid!', 'info')
    }
  }

  const openEditForm = (bill: Bill) => {
    setEditingBill(bill)
    setShowBillForm(true)
  }

  const openDeleteDialog = (bill: Bill) => {
    setDeleteDialog({ open: true, bill })
  }

  const confirmDelete = () => {
    if (deleteDialog.bill) {
      handleDeleteBill(deleteDialog.bill.id)
    }
    setDeleteDialog({ open: false, bill: undefined })
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

  const recurringBillsCount = filteredBills.filter(bill => bill.templateId).length

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bills</h1>
          <p className="text-muted-foreground">
            Manage your bills for {getMonthName(selectedMonth)} {selectedYear}
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
          
          <Button 
            variant="outline" 
            onClick={() => setShowRecurringManager(true)}
          >
            <Repeat className="h-4 w-4 mr-2" />
            Recurring Bills
          </Button>
          
          <Button onClick={() => setShowBillForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Bill
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredBills.length} bills ({recurringBillsCount} recurring)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredBills.filter(b => b.status === 'PAID').length} bills paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unpaid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(unpaidAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredBills.filter(b => b.status !== 'PAID').length} bills remaining
            </p>
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
        <CardContent className="space-y-4">
          <SearchFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            categories={BILL_CATEGORIES}
            placeholder="Search bills by name, category, or remarks..."
            showCategoryFilter={true}
            showStatusFilter={true}
          />
          
          <div className="space-y-4">
            {filteredBills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(bill.status)}
                    {bill.templateId && (
                      <Repeat className="h-3 w-3 text-blue-600" title="Recurring bill" />
                    )}
                  </div>
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
                    <div className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openEditForm(bill)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openDeleteDialog(bill)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredBills.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No bills found. Try adjusting your search or filters, or add your first bill.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recurring Bills Manager Modal */}
      {showRecurringManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Recurring Bills Management</h2>
                <Button variant="ghost" onClick={() => setShowRecurringManager(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <RecurringBillManager onGenerateBills={handleGenerateBills} />
            </div>
          </div>
        </div>
      )}

      <BillForm
        open={showBillForm}
        onOpenChange={(open) => {
          setShowBillForm(open)
          if (!open) setEditingBill(undefined)
        }}
        onSubmit={editingBill ? handleEditBill : handleAddBill}
        bill={editingBill}
        mode={editingBill ? 'edit' : 'add'}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, bill: deleteDialog.bill })}
        onConfirm={confirmDelete}
        title="Delete Bill"
        description={`Are you sure you want to delete "${deleteDialog.bill?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}