'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BillForm } from '@/components/forms/bill-form'
import { DeleteConfirmDialog } from '@/components/ui/alert-dialog'
import { SearchFilter } from '@/components/ui/search-filter'
import { RecurringBillManager } from '@/components/bills/recurring-bill-manager'
import { Tooltip } from '@/components/ui/tooltip'
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
      return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
    case 'UNPAID':
      return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800'
    case 'OVERDUE':
      return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
    case 'PARTIAL':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800'
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

  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleNewBill = () => {
      setShowBillForm(true)
    }

    window.addEventListener('newBill', handleNewBill)
    return () => window.removeEventListener('newBill', handleNewBill)
  }, [])

  // Fetch bills from API
  useEffect(() => {
    async function fetchBills() {
      setLoading(true)
      try {
        const res = await fetch(`/api/bills?month=${selectedMonth}&year=${selectedYear}`)
        const data = await res.json()
        setBills(data)
      } catch (e) {
        setBills([])
      }
      setLoading(false)
    }
    fetchBills()
  }, [selectedMonth, selectedYear])

  // Fetch bill templates from API
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch('/api/bill-templates')
        if (res.ok) {
          const data = await res.json()
          setTemplates(data || [])
        }
      } catch (error) {
        console.error('Error fetching templates:', error)
        setTemplates([])
      }
    }
    fetchTemplates()
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

  const handleAddBill = async (newBill: Partial<ExtendedBill>) => {
    // Prepare bill data for API
    const billPayload = {
      name: newBill.name,
      amount: String(newBill.amount),
      dueDate: newBill.dueDate instanceof Date ? newBill.dueDate.toISOString() : newBill.dueDate,
      category: newBill.category,
      remarks: newBill.remarks,
      month: newBill.month,
      year: newBill.year,
    }
    try {
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billPayload),
      })
      if (!res.ok) throw new Error('Failed to save bill')
      const savedBill = await res.json()
      setBills(prev => [...prev, savedBill])
      if (window.toast) window.toast('Bill added successfully!', 'success')
    } catch (e) {
      if (window.toast) window.toast('Failed to save bill', 'error')
    }
    // If this is a recurring bill, also create a template
    if (newBill.createTemplate && newBill.templateData) {
      try {
        const templatePayload = {
          name: newBill.templateData.name,
          description: newBill.templateData.description,
          amount: String(newBill.templateData.amount),
          dueDay: String(newBill.templateData.dueDay),
          category: newBill.templateData.category,
          isActive: newBill.templateData.isActive !== undefined ? newBill.templateData.isActive : true,
        }

        const templateRes = await fetch('/api/bill-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(templatePayload),
        })

        if (templateRes.ok) {
          const savedTemplate = await templateRes.json()
          setTemplates(prev => [...prev, savedTemplate])
          if (window.toast) {
            window.toast('Bill and template created successfully!', 'success')
          }
        }
      } catch (error) {
        console.error('Error creating template:', error)
        if (window.toast) {
          window.toast('Bill saved, but failed to create template', 'error')
        }
      }
    }
  }

  const handleGenerateBills = async (newBills: Partial<Bill>[]) => {
    try {
      const savedBills: Bill[] = []
      
      for (const billData of newBills) {
        const billPayload = {
          name: billData.name,
          amount: String(billData.amount),
          dueDate: billData.dueDate instanceof Date ? billData.dueDate.toISOString() : billData.dueDate,
          category: billData.category,
          remarks: billData.remarks,
          month: billData.month,
          year: billData.year,
        }

        const res = await fetch('/api/bills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(billPayload),
        })

        if (res.ok) {
          const savedBill = await res.json()
          savedBills.push(savedBill)
        }
      }
      
      setBills(prev => [...prev, ...savedBills])
      
      if (window.toast) {
        window.toast(`Generated ${savedBills.length} bills successfully!`, 'success')
      }
    } catch (error) {
      console.error('Error generating bills:', error)
      if (window.toast) {
        window.toast('Failed to generate some bills', 'error')
      }
    }
  }

  const handleEditBill = async (updatedBill: Partial<Bill> & { createTemplate?: boolean; templateData?: any }) => {
    try {
      if (!editingBill) return

      const billPayload = {
        name: updatedBill.name,
        amount: String(updatedBill.amount),
        dueDate: updatedBill.dueDate instanceof Date ? updatedBill.dueDate.toISOString() : updatedBill.dueDate,
        status: updatedBill.status,
        category: updatedBill.category,
        remarks: updatedBill.remarks,
        paidDate: updatedBill.paidDate ? updatedBill.paidDate.toISOString() : null,
      }

      const res = await fetch(`/api/bills/${editingBill.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billPayload),
      })

      if (!res.ok) throw new Error('Failed to update bill')

      const savedBill = await res.json()
      setBills(prev => 
        prev.map(item => 
          item.id === editingBill.id ? savedBill : item
        )
      )
      setEditingBill(undefined)
      
      // If this is a recurring bill, also create or update a template
      if (updatedBill.createTemplate && updatedBill.templateData) {
        try {
          // Try to find an existing template for this bill (by name, amount, dueDay, category)
          const existingTemplate = templates.find(t =>
            t.name === updatedBill.templateData.name &&
            t.amount === updatedBill.templateData.amount &&
            t.dueDay === updatedBill.templateData.dueDay &&
            t.category === updatedBill.templateData.category
          )
          const templatePayload = {
            name: updatedBill.templateData.name,
            description: updatedBill.templateData.description,
            amount: String(updatedBill.templateData.amount),
            dueDay: String(updatedBill.templateData.dueDay),
            category: updatedBill.templateData.category,
            isActive: true,
          }
          let templateRes
          if (existingTemplate) {
            templateRes = await fetch(`/api/bill-templates/${existingTemplate.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(templatePayload),
            })
          } else {
            templateRes = await fetch('/api/bill-templates', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(templatePayload),
            })
          }
          if (templateRes.ok) {
            const savedTemplate = await templateRes.json()
            setTemplates(prev => {
              // Replace or add
              const idx = prev.findIndex(t => t.id === savedTemplate.id)
              if (idx !== -1) {
                const copy = [...prev]
                copy[idx] = savedTemplate
                return copy
              }
              return [...prev, savedTemplate]
            })
            if (window.toast) window.toast('Recurring template created/updated!', 'success')
          }
        } catch (error) {
          console.error('Error creating/updating template:', error)
          if (window.toast) window.toast('Bill updated, but failed to create/update template', 'error')
        }
      }
      
      if (window.toast) {
        window.toast('Bill updated successfully!', 'success')
      }
    } catch (error) {
      console.error('Error updating bill:', error)
      if (window.toast) {
        window.toast('Failed to update bill', 'error')
      }
    }
  }

  const handleDeleteBill = async (billId: string) => {
    try {
      const res = await fetch(`/api/bills/${billId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete bill')
      
      setBills(prev => prev.filter(item => item.id !== billId))
      if (window.toast) window.toast('Bill deleted successfully!', 'success')
    } catch (error) {
      console.error('Error deleting bill:', error)
      if (window.toast) window.toast('Failed to delete bill', 'error')
    }
  }

  const markAsPaid = async (billId: string) => {
    try {
      const bill = bills.find(b => b.id === billId)
      if (!bill) return

      const updatedBill = {
        ...bill,
        status: 'PAID',
        paidDate: new Date().toISOString(),
      }

      const res = await fetch(`/api/bills/${billId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBill),
      })

      if (!res.ok) throw new Error('Failed to update bill')

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
    } catch (error) {
      console.error('Error marking bill as paid:', error)
      if (window.toast) {
        window.toast('Failed to mark bill as paid', 'error')
      }
    }
  }

  const markAsUnpaid = async (billId: string) => {
    try {
      const bill = bills.find(b => b.id === billId)
      if (!bill) return

      const updatedBill = {
        ...bill,
        status: 'UNPAID',
        paidDate: null,
      }

      const res = await fetch(`/api/bills/${billId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBill),
      })

      if (!res.ok) throw new Error('Failed to update bill')

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
    } catch (error) {
      console.error('Error marking bill as unpaid:', error)
      if (window.toast) {
        window.toast('Failed to mark bill as unpaid', 'error')
      }
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
  const overdueBillsCount = filteredBills.filter(bill => bill.status === 'OVERDUE').length

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
            {overdueBillsCount > 0 && (
              <span className="text-red-600 ml-2">
                • {overdueBillsCount} overdue
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
          
          <Tooltip content="Manage recurring bill templates">
            <Button 
              variant="outline" 
              onClick={() => setShowRecurringManager(true)}
            >
              <Repeat className="h-4 w-4 mr-2" />
              Recurring Bills
            </Button>
          </Tooltip>
          
          <Tooltip content="Add new bill (n b)">
            <Button onClick={() => setShowBillForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bill
            </Button>
          </Tooltip>
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
            categories={[...BILL_CATEGORIES]}
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
                      <Tooltip content="This is a recurring bill">
                        <Repeat className="h-3 w-3 text-blue-600" />
                      </Tooltip>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{bill.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Due: {new Date(bill.dueDate).toLocaleDateString()} • {bill.category}
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
                      <Tooltip content="Mark as unpaid">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsUnpaid(bill.id)}
                        >
                          Mark Unpaid
                        </Button>
                      </Tooltip>
                    ) : (
                      <Tooltip content="Mark as paid">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => markAsPaid(bill.id)}
                        >
                          Mark Paid
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip content="Edit bill">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditForm(bill)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete bill">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openDeleteDialog(bill)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Tooltip>
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