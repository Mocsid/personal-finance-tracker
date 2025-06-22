'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { CurrencyDisplay } from '../ui/currency-display'
import { Tooltip } from '../ui/tooltip'
import { DollarSign, Receipt, Clock, Check, Info } from 'lucide-react'

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

function getActivityTooltip(activity: Activity): string {
  switch (activity.type) {
    case 'income':
      return `Income received on ${activity.date.toLocaleDateString()}`
    case 'bill_paid':
      return `Bill payment completed on ${activity.date.toLocaleDateString()}`
    case 'bill_due':
      return `Bill due on ${activity.date.toLocaleDateString()}`
    default:
      return 'Recent financial activity'
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions and updates</CardDescription>
          </div>
          <Tooltip content="Your most recent financial activities and upcoming due dates">
            <Info className="h-4 w-4 text-muted-foreground" />
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <Tooltip key={activity.id} content={getActivityTooltip(activity)}>
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                <div className="flex items-center space-x-2 flex-1">
                  {getActivityIcon(activity.type, activity.status)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{activity.title}</div>
                    {activity.amount && (
                      <div className="text-xs text-muted-foreground">
                        <CurrencyDisplay amount={activity.amount} />
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.date.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Tooltip>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}