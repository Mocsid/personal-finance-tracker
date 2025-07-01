'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { formatCurrency, getMonthName, getCurrentMonth, getCurrentYear, getNextMonth, getBillDueDateForMonth } from '@/lib/utils'
import { Edit, Trash2, Play, Pause, Plus } from 'lucide-react'
import type { BillTemplate, Bill } from '@/types'
import { BillTemplateForm } from './bill-template-form'
import { DeleteConfirmDialog } from '../ui/alert-dialog'

interface RecurringBillManagerProps {
  onGenerateBills: (bills: Partial<Bill>[]) => void
}

export function RecurringBillManager({ onGenerateBills }: RecurringBillManagerProps) {
  const [templates, setTemplates] = useState<BillTemplate[]>([])
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<BillTemplate | undefined>()
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; template?: BillTemplate }>({
    open: false,
    template: undefined
  })

  // Fetch templates from API
  useEffect(() => {
    async function fetchTemplates() {
      try {
        // Note: You'll need to create an API endpoint for bill templates
        // For now, we'll start with empty templates since the API doesn't exist yet
        setTemplates([])
      } catch (error) {
        console.error('Error fetching bill templates:', error)
        setTemplates([])
      }
    }

    fetchTemplates()
  }, [])

  const handleAddTemplate = (newTemplate: Partial<BillTemplate>) => {
    const template: BillTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      ...newTemplate
    } as BillTemplate
    
    setTemplates(prev => [...prev, template])
    
    if (window.toast) {
      window.toast('Recurring bill template created!', 'success')
    }
  }

  const handleEditTemplate = (updatedTemplate: Partial<BillTemplate>) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === editingTemplate?.id 
          ? { ...template, ...updatedTemplate, updatedAt: new Date() }
          : template
      )
    )
    setEditingTemplate(undefined)
    
    if (window.toast) {
      window.toast('Recurring bill template updated!', 'success')
    }
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(template => template.id !== templateId))
    
    if (window.toast) {
      window.toast('Recurring bill template deleted!', 'success')
    }
  }

  const toggleTemplateStatus = (templateId: string) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === templateId 
          ? { ...template, isActive: !template.isActive, updatedAt: new Date() }
          : template
      )
    )
    
    if (window.toast) {
      window.toast('Template status updated!', 'info')
    }
  }

  const generateBillsForNextMonth = () => {
    const currentMonth = getCurrentMonth()
    const currentYear = getCurrentYear()
    const { month: nextMonth, year: nextYear } = getNextMonth(currentMonth, currentYear)
    
    const activeTemplates = templates.filter(template => template.isActive)
    
    const newBills: Partial<Bill>[] = activeTemplates.map(template => ({
      templateId: template.id,
      name: template.name,
      amount: template.amount,
      dueDate: getBillDueDateForMonth(template.dueDay, nextMonth, nextYear),
      category: template.category,
      status: 'UNPAID' as const,
      month: nextMonth,
      year: nextYear,
      remarks: `Auto-generated from template: ${template.description || ''}`
    }))
    
    onGenerateBills(newBills)
    
    if (window.toast) {
      window.toast(`Generated ${newBills.length} bills for ${getMonthName(nextMonth)} ${nextYear}!`, 'success')
    }
  }

  const openEditForm = (template: BillTemplate) => {
    setEditingTemplate(template)
    setShowTemplateForm(true)
  }

  const openDeleteDialog = (template: BillTemplate) => {
    setDeleteDialog({ open: true, template })
  }

  const confirmDelete = () => {
    if (deleteDialog.template) {
      handleDeleteTemplate(deleteDialog.template.id)
    }
    setDeleteDialog({ open: false, template: undefined })
  }

  const activeTemplatesCount = templates.filter(t => t.isActive).length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recurring Bills</CardTitle>
              <CardDescription>
                Manage templates for bills that repeat every month
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={generateBillsForNextMonth}
                disabled={activeTemplatesCount === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate Next Month
              </Button>
              <Button onClick={() => setShowTemplateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Template
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTemplatesCount > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-800">
                {activeTemplatesCount} active templates will generate {formatCurrency(templates.filter(t => t.isActive).reduce((sum, t) => sum + t.amount, 0))} in bills next month
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    template.isActive ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Due day {template.dueDay} • {template.category}
                    </div>
                    {template.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {template.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(template.amount)}</div>
                    <Badge 
                      variant={template.isActive ? 'success' : 'secondary'}
                      className="text-xs"
                    >
                      {template.isActive ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleTemplateStatus(template.id)}
                      title={template.isActive ? 'Pause template' : 'Activate template'}
                    >
                      {template.isActive ? 
                        <Pause className="h-4 w-4" /> : 
                        <Play className="h-4 w-4" />
                      }
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openEditForm(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openDeleteDialog(template)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {templates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No recurring bill templates yet. Create your first template to automate monthly bill generation.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <BillTemplateForm
        open={showTemplateForm}
        onOpenChange={(open) => {
          setShowTemplateForm(open)
          if (!open) setEditingTemplate(undefined)
        }}
        onSubmit={editingTemplate ? handleEditTemplate : handleAddTemplate}
        template={editingTemplate}
        mode={editingTemplate ? 'edit' : 'add'}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, template: deleteDialog.template })}
        onConfirm={confirmDelete}
        title="Delete Recurring Bill Template"
        description={`Are you sure you want to delete "${deleteDialog.template?.name}"? This will not affect existing bills, but no new bills will be generated from this template.`}
      />
    </div>
  )
}