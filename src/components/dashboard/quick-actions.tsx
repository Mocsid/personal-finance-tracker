'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Receipt, DollarSign, TrendingUp, Download } from 'lucide-react'

const actions = [
  {
    title: 'Manage Bills',
    description: 'Add, edit, or mark bills as paid',
    href: '/bills',
    icon: Receipt,
    color: 'text-blue-600 bg-blue-50 hover:bg-blue-100'
  },
  {
    title: 'Track Income',
    description: 'Record your income sources',
    href: '/income',
    icon: DollarSign,
    color: 'text-green-600 bg-green-50 hover:bg-green-100'
  },
  {
    title: 'View Analytics',
    description: 'See your financial trends',
    href: '/analytics',
    icon: TrendingUp,
    color: 'text-purple-600 bg-purple-50 hover:bg-purple-100'
  },
  {
    title: 'Export Data',
    description: 'Download your financial data',
    href: '/export',
    icon: Download,
    color: 'text-orange-600 bg-orange-50 hover:bg-orange-100'
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
            <Link
              key={action.title}
              href={action.href}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${action.color}`}
            >
              <Icon className="h-5 w-5" />
              <div>
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}