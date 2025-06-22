'use client'

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { INCOME_CATEGORIES } from '@/lib/constants'
import { formatCurrency, getCurrentMonth, getCurrentYear } from '@/lib/utils'
import type { Income } from '@/types'

interface IncomeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (income: Partial<Income>) => void
  income?: Income
  mode: 'add' | 'edit'
}

export function IncomeForm({ open, onOpenChange, onSubmit, income, mode }: IncomeFormProps) {
  const [formData, setFormData] = useState({
    source: income?.source || '',
    description: income?.description || '',
    amount: income?.amount?.toString() || '',
    taxPercentage: income?.amount && income?.taxDeduction ? 
      ((income.taxDeduction / income.amount) * 100).toString() : '',
    date: income?.date ? income.date.toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0],
    category: income?.category || 'Salary',
    remarks: income?.remarks || '',
  })

  // Load default tax rate from localStorage
  useEffect(() => {
    if (mode === 'add' && !income && typeof window !== 'undefined') {
      const defaultTaxRate = localStorage.getItem('defaultTaxRate') || '20'
      setFormData(prev => ({ ...prev, taxPercentage: defaultTaxRate }))
    }
  }, [mode, income])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const amount = parseFloat(formData.amount)
    const taxPercentage = parseFloat(formData.taxPercentage || '0')
    const taxDeduction = (amount * taxPercentage) / 100
    const netAmount = amount - taxDeduction
    
    const date = new Date(formData.date)
    
    onSubmit({
      ...income,
      source: formData.source,
      description: formData.description,
      amount,
      taxDeduction,
      netAmount,
      date,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      category: formData.category,
      remarks: formData.remarks,
    })
    
    onOpenChange(false)
    
    // Reset form if adding new income
    if (mode === 'add') {
      const defaultTaxRate = typeof window !== 'undefined' ? 
        localStorage.getItem('defaultTaxRate') || '20' : '20'
      
      setFormData({
        source: '',
        description: '',
        amount: '',
        taxPercentage: defaultTaxRate,
        date: new Date().toISOString().split('T')[0],
        category: 'Salary',
        remarks: '',
      })
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const grossAmount = parseFloat(formData.amount || '0')
  const taxPercentage = parseFloat(formData.taxPercentage || '0')
  const taxAmount = (grossAmount * taxPercentage) / 100
  const netAmount = grossAmount - taxAmount

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add Income' : 'Edit Income'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source">Source *</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => handleChange('source', e.target.value)}
              placeholder="e.g., Company Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="e.g., Monthly salary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Gross Amount *</Label>
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
              <Label htmlFor="taxPercentage">Tax % *</Label>
              <Input
                id="taxPercentage"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.taxPercentage}
                onChange={(e) => handleChange('taxPercentage', e.target.value)}
                placeholder="20"
              />
            </div>
          </div>

          {grossAmount > 0 && (
            <div className="bg-muted p-3 rounded-md text-sm">
              <div className="flex justify-between">
                <span>Gross Amount:</span>
                <span>{formatCurrency(grossAmount)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Tax Deduction ({taxPercentage}%):</span>
                <span>-{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between font-semibold text-green-600 border-t mt-1 pt-1">
                <span>Net Amount:</span>
                <span>{formatCurrency(netAmount)}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {INCOME_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>
          </div>

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

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {mode === 'add' ? 'Add Income' : 'Update Income'}
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