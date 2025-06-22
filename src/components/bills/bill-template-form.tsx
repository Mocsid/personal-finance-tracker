'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { BILL_CATEGORIES } from '@/lib/constants'
import type { BillTemplate } from '@/types'

interface BillTemplateFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (template: Partial<BillTemplate>) => void
  template?: BillTemplate
  mode: 'add' | 'edit'
}

export function BillTemplateForm({ open, onOpenChange, onSubmit, template, mode }: BillTemplateFormProps) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    amount: template?.amount?.toString() || '',
    dueDay: template?.dueDay?.toString() || '1',
    category: template?.category || 'Housing',
    isActive: template?.isActive ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    onSubmit({
      ...template,
      name: formData.name,
      description: formData.description,
      amount: parseFloat(formData.amount),
      dueDay: parseInt(formData.dueDay),
      category: formData.category,
      isActive: formData.isActive,
    })
    
    onOpenChange(false)
    
    // Reset form if adding new template
    if (mode === 'add') {
      setFormData({
        name: '',
        description: '',
        amount: '',
        dueDay: '1',
        category: 'Housing',
        isActive: true,
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
            {mode === 'add' ? 'Add Recurring Bill Template' : 'Edit Recurring Bill Template'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bill Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Monthly Rent"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="e.g., Apartment rent payment"
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
              <Label htmlFor="dueDay">Due Day *</Label>
              <Select
                id="dueDay"
                value={formData.dueDay}
                onChange={(e) => handleChange('dueDay', e.target.value)}
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day.toString()}>
                    {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-muted-foreground">
                Day of the month when bill is due
              </p>
            </div>
          </div>

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

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isActive" className="text-sm">
              Template is active (will generate bills automatically)
            </Label>
          </div>

          <div className="bg-muted p-3 rounded-md text-sm">
            <div className="font-medium mb-1">Template Preview:</div>
            <div>This will create a bill for <strong>{formData.name}</strong> on the <strong>{formData.dueDay}{parseInt(formData.dueDay) === 1 ? 'st' : parseInt(formData.dueDay) === 2 ? 'nd' : parseInt(formData.dueDay) === 3 ? 'rd' : 'th'}</strong> of every month with amount <strong>${formData.amount || '0.00'}</strong></div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {mode === 'add' ? 'Create Template' : 'Update Template'}
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