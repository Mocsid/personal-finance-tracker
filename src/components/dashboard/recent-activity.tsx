'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { CurrencyDisplay } from '../ui/currency-display'
import { Tooltip } from '../ui/tooltip'
import { DollarSign, Receipt, Clock, Check, Info } from 'lucide-react'
import { getCurrentMonth, getCurrentYear } from '@/lib/utils'
import type { Bill, Income } from '@/types'

interface Activity {
  id: string
  type: 'income' | 'bill_paid' | 'bill_due'
  title: string
  amount?: number
  date: Date
  status?: 'success' | 'warning' | 'info'
}

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
  const [bills, setBills] = useState<Bill[]>([])
  const [income, setIncome] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const currentMonth = getCurrentMonth()
        const currentYear = getCurrentYear()
        
        const [billsRes, incomeRes] = await Promise.all([
          fetch(`/api/bills?month=${currentMonth}&year=${currentYear}`),
          fetch(`/api/income?month=${currentMonth}&year=${currentYear}`)
        ])
        
        const [billsData, incomeData] = await Promise.all([
          billsRes.json(),
          incomeRes.json()
        ])
        
        setBills(billsData || [])
        setIncome(incomeData || [])
      } catch (error) {
        console.error('Error fetching recent activity data:', error)
        setBills([])
        setIncome([])
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  // Generate real activities from bills and income data
  const generateRecentActivities = (): Activity[] => {
    const activities: Activity[] = []
    const today = new Date()
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    // Add recent income entries
    income
      .filter(item => new Date(item.date) >= sevenDaysAgo)
      .forEach(item => {
        activities.push({
          id: `income-${item.id}`,
          type: 'income',
          title: `${item.source} - ${item.description || 'Income received'}`,
          amount: item.netAmount,
          date: new Date(item.date),
          status: 'success'
        })
      })

    // Add recently paid bills
    bills
      .filter(bill => bill.status === 'PAID' && bill.paidDate && new Date(bill.paidDate) >= sevenDaysAgo)
      .forEach(bill => {
        activities.push({
          id: `bill-paid-${bill.id}`,
          type: 'bill_paid',
          title: `${bill.name} payment completed`,
          amount: bill.amount,
          date: new Date(bill.paidDate!),
          status: 'success'
        })
      })

    // Add upcoming bills (due within next 7 days)
    bills
      .filter(bill => 
        bill.status !== 'PAID' && 
        new Date(bill.dueDate) >= today && 
        new Date(bill.dueDate) <= sevenDaysFromNow
      )
      .forEach(bill => {
        const daysUntilDue = Math.ceil((new Date(bill.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        activities.push({
          id: `bill-due-${bill.id}`,
          type: 'bill_due',
          title: `${bill.name} due ${daysUntilDue === 0 ? 'today' : daysUntilDue === 1 ? 'tomorrow' : `in ${daysUntilDue} days`}`,
          amount: bill.amount,
          date: new Date(bill.dueDate),
          status: daysUntilDue <= 3 ? 'warning' : 'info'
        })
      })

    // Sort by date (most recent first) and limit to 4 activities
    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 4)
  }

  const recentActivities = generateRecentActivities()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest transactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }
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
          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">No recent activity</div>
              <div className="text-xs">Add some bills or income to see activity here</div>
            </div>
          ) : (
            recentActivities.map((activity) => (
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}