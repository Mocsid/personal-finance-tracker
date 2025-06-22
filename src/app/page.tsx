'use client'

import { useState, useEffect } from 'react'
import { FinancialSummary } from '@/components/dashboard/financial-summary'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { WelcomeWizard } from '@/components/onboarding/welcome-wizard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip } from '@/components/ui/tooltip'
import { getMonthName, getCurrentMonth, getCurrentYear } from '@/lib/utils'
import { Info, TrendingUp, Target } from 'lucide-react'
import useLocalStorage from '@/hooks/use-local-storage'

// This would normally come from your database
const mockData = {
  currentMonth: getCurrentMonth(),
  currentYear: getCurrentYear(),
  totalIncome: 5350, // Updated to match the new income data
  totalBills: 1430,  // Updated to match the new bill data
  paidBills: 1280,   // Rent + Internet
  unpaidBills: 350,  // Electricity + Insurance
  upcomingBills: 2,
}

export default function Dashboard() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage('hasCompletedOnboarding', false)
  const [userName] = useLocalStorage('userName', '')
  const [showWelcome, setShowWelcome] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Show welcome wizard for new users
    if (!hasCompletedOnboarding) {
      setShowWelcome(true)
    }
  }, [hasCompletedOnboarding])

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
    setHasCompletedOnboarding(true)
  }

  const netAmount = mockData.totalIncome - mockData.totalBills
  const paidPercentage = (mockData.paidBills / mockData.totalBills) * 100

  const getGreeting = () => {
    if (!mounted) return 'Dashboard'
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
    return userName ? `${greeting}, ${userName}!` : `${greeting}!`
  }

  const getFinancialHealthLevel = () => {
    if (paidPercentage >= 80) return { level: 'Excellent', color: 'text-green-600', tip: 'Keep up the great work! You\'re on top of your finances.' }
    if (paidPercentage >= 50) return { level: 'Good', color: 'text-orange-600', tip: 'You\'re doing well, but consider setting up auto-pay for recurring bills.' }
    return { level: 'Needs Attention', color: 'text-red-600', tip: 'Focus on paying outstanding bills to improve your financial health.' }
  }

  const healthLevel = getFinancialHealthLevel()

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      {showWelcome && <WelcomeWizard onComplete={handleWelcomeComplete} />}
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {hasCompletedOnboarding ? getGreeting() : 'Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            Financial overview for {getMonthName(mockData.currentMonth)} {mockData.currentYear}
          </p>
        </div>

        <FinancialSummary
          totalIncome={mockData.totalIncome}
          totalBills={mockData.totalBills}
          paidBills={mockData.paidBills}
          unpaidBills={mockData.unpaidBills}
          upcomingBills={mockData.upcomingBills}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <QuickActions />
          <RecentActivity />
        </div>

        {/* Financial Health Indicator */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Financial Health</CardTitle>
                <CardDescription>Quick assessment of your financial status</CardDescription>
              </div>
              <Tooltip content="Your financial health is calculated based on income vs bills ratio and payment completion rate">
                <Info className="h-5 w-5 text-muted-foreground" />
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Income vs Bills Ratio</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Higher is better - shows how much income covers your bills
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {((mockData.totalIncome / mockData.totalBills) * 100).toFixed(0)}%
                  </div>
                  <div className={`text-xs ${
                    mockData.totalIncome > mockData.totalBills ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {mockData.totalIncome > mockData.totalBills ? 'Healthy' : 'At Risk'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Bill Payment Progress</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Percentage of bills paid this month
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{Math.round(paidPercentage)}%</div>
                  <div className={`text-xs ${healthLevel.color}`}>
                    {healthLevel.level}
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    paidPercentage >= 80 ? 'bg-green-500' : paidPercentage >= 50 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${paidPercentage}%` }}
                ></div>
              </div>
              
              {hasCompletedOnboarding && (
                <Tooltip content={healthLevel.tip}>
                  <div className={`p-3 rounded-lg border ${
                    paidPercentage >= 80 ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' :
                    paidPercentage >= 50 ? 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800' :
                    'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                  }`}>
                    <div className={`text-sm ${
                      paidPercentage >= 80 ? 'text-green-800 dark:text-green-200' :
                      paidPercentage >= 50 ? 'text-orange-800 dark:text-orange-200' :
                      'text-red-800 dark:text-red-200'
                    }`}>
                      💡 <strong>Tip:</strong> {healthLevel.tip}
                    </div>
                  </div>
                </Tooltip>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}