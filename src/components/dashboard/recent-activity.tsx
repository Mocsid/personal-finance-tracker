'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, Receipt, Clock, Check } from 'lucide-react'

interface Activity {
  id: string
  type: 'income' | 'bill_paid' | 'bill_due'
  title: string
  amount?: number
  date: Date
  status?: 'success' | 'warning' | 'info'
}

// Mock recent activities - in real app, combine from bills and income data
const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'income',
    title: 'Salary payment received',
    amount: 4000,
    date: new Date(2025, 5, 1),
    status: 'success'
  },
  {
    id: '2',
    type: 'bill_paid',
    title: 'Rent payment marked as paid',
    amount: 1200,
    date: new Date(2025, 4, 30),
    status: 'success'
  },
  {
    id: '3',
    type: 'bill_due',
    title: 'Electricity bill due in 3 days',
    amount: 150,
    date: new Date(2025, 5, 15),
    status: 'warning'
  },
  {
    id: '4',
    type: 'income',
    title: 'Freelance project completed',
    amount: 1350,
    date: new Date(2025, 5, 15),
    status: 'success'
  }
]

function getActivityIcon(type: Activity['type'], status?: Activity['status']) {
  switch (type) {
    case 'income':
      return <DollarSign className="h-4 w-4 text-green-600" />
    case 'bill_paid':
      return <Check className="h-4 w-4 text-green-600" />
    case 'bill_due':
      return <Clock className="h-4 w-4 text-orange-600" />
    default:
      return <Receipt className="h-4 w-4 text-gray-600" />
  }
}

function getStatusColor(status?: Activity['status']) {
  switch (status) {
    case 'success':
      return 'bg-green-500'
    case 'warning':
      return 'bg-orange-500'
    case 'info':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest transactions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
              <div className="flex items-center space-x-2 flex-1">
                {getActivityIcon(activity.type, activity.status)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{activity.title}</div>
                  {activity.amount && (
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(activity.amount)}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.date.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}