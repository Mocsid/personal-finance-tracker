import { FinancialSummary } from '@/components/dashboard/financial-summary'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, getMonthName, getCurrentMonth, getCurrentYear } from '@/lib/utils'

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
  const netAmount = mockData.totalIncome - mockData.totalBills
  const paidPercentage = (mockData.paidBills / mockData.totalBills) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
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
          <CardTitle>Financial Health</CardTitle>
          <CardDescription>Quick assessment of your financial status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Income vs Bills Ratio</p>
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
                <p className="text-sm font-medium">Bill Payment Progress</p>
                <p className="text-xs text-muted-foreground">
                  Percentage of bills paid this month
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{Math.round(paidPercentage)}%</div>
                <div className={`text-xs ${
                  paidPercentage >= 80 ? 'text-green-600' : paidPercentage >= 50 ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {paidPercentage >= 80 ? 'Excellent' : paidPercentage >= 50 ? 'Good' : 'Needs Attention'}
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  paidPercentage >= 80 ? 'bg-green-500' : paidPercentage >= 50 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${paidPercentage}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}