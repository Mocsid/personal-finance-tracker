'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Tooltip } from '../ui/tooltip'
import { Receipt, DollarSign, TrendingUp, Download, Plus, BarChart3 } from 'lucide-react'

const actions = [
  {
    title: 'Add Bill',
    description: 'Record a new bill or expense',
    href: '/bills',
    icon: Plus,
    color: 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900',
    tooltip: 'Quickly add a new bill (shortcut: g b, then n b)'
  },
  {
    title: 'Add Income',
    description: 'Record new income source',
    href: '/income',
    icon: DollarSign,
    color: 'text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900',
    tooltip: 'Add income with tax calculations (shortcut: g i, then n i)'
  },
  {
    title: 'View Analytics',
    description: 'See your financial trends',
    href: '/analytics',
    icon: BarChart3,
    color: 'text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950 dark:hover:bg-purple-900',
    tooltip: 'Analyze your spending patterns and trends'
  },
  {
    title: 'Export Data',
    description: 'Download your financial data',
    href: '/export',
    icon: Download,
    color: 'text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950 dark:hover:bg-orange-900',
    tooltip: 'Export data as JSON or CSV for backup'
  }
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Manage your finances efficiently</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Tooltip key={action.title} content={action.tooltip}>
              <Link
                href={action.href}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${action.color}`}
              >
                <Icon className="h-5 w-5" />
                <div>
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Link>
            </Tooltip>
          )
        })}
      </CardContent>
    </Card>
  )
}