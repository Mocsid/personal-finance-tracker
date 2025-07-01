'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { BILL_CATEGORIES, BILL_STATUSES } from '@/lib/constants'
import type { Bill, BillStatus, ExtendedBill } from '@/types'

interface BillFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (bill: Partial<ExtendedBill>) => void
  bill?: Bill
  mode: 'add' | 'edit'
}

export function BillForm({ open, onOpenChange, onSubmit, bill, mode }: BillFormProps) {
  const [formData, setFormData] = useState({
    name: bill?.name || '',
    amount: bill?.amount?.toString() || '',
    dueDate: bill?.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0],
    category: bill?.category || 'Housing',
    status: bill?.status || 'UNPAID',
    remarks: bill?.remarks || '',
    isRecurring: false, // New field for recurring bills
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const dueDate = new Date(formData.dueDate)
    
    const billData: Partial<ExtendedBill> = {
      ...bill,
      name: formData.name,
      amount: parseFloat(formData.amount),
      dueDate,
      category: formData.category,
      status: formData.status as BillStatus,
      remarks: formData.remarks,
      month: dueDate.getMonth() + 1,
      year: dueDate.getFullYear(),
      paidDate: formData.status === 'PAID' ? new Date() : undefined,
    }

    // If this is a new recurring bill, also create a template
    if (mode === 'add' && formData.isRecurring) {
      billData.createTemplate = true
      billData.templateData = {
        name: formData.name,
        description: formData.remarks,
        amount: parseFloat(formData.amount),
        dueDay: dueDate.getDate(),
        category: formData.category,
        isActive: true,
      }
    }
    
    onSubmit(billData)
    onOpenChange(false)
    
    // Reset form if adding new bill
    if (mode === 'add') {
      setFormData({
        name: '',
        amount: '',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'Housing',
        status: 'UNPAID',
        remarks: '',
        isRecurring: false,
      })
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add Bill' : 'Edit Bill'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bill Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Electricity Bill"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {BILL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                {BILL_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {mode === 'add' && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => handleChange('isRecurring', e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isRecurring" className="text-sm">
                This bill repeats every month (create recurring template)
              </Label>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="Optional notes..."
              rows={2}
            />
          </div>

          {formData.isRecurring && mode === 'add' && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-md text-sm">
              <div className="font-medium text-blue-800 mb-1">Recurring Bill</div>
              <div className="text-blue-700">
                This will create both a bill for this month and a template for automatic 
                generation of future bills on the {new Date(formData.dueDate).getDate()}{new Date(formData.dueDate).getDate() === 1 ? 'st' : new Date(formData.dueDate).getDate() === 2 ? 'nd' : new Date(formData.dueDate).getDate() === 3 ? 'rd' : 'th'} of each month.
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {mode === 'add' ? 'Add Bill' : 'Update Bill'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}