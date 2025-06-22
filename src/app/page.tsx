import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, getMonthName, getCurrentMonth, getCurrentYear } from '@/lib/utils'
import { DollarSign, Receipt, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// This would normally come from your database
const mockData = {
  currentMonth: getCurrentMonth(),
  currentYear: getCurrentYear(),
  totalIncome: 5000,
  totalBills: 2800,
  paidBills: 1200,
  unpaidBills: 1600,
  upcomingBills: 3,
}

export default function Dashboard() {
  const netAmount = mockData.totalIncome - mockData.totalBills
  const paidPercentage = (mockData.paidBills / mockData.totalBills) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview for {getMonthName(mockData.currentMonth)} {mockData.currentYear}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(mockData.totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(mockData.totalBills)}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(paidPercentage)}% paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              netAmount >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(netAmount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Bills</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(mockData.unpaidBills)}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockData.upcomingBills} upcoming this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your finances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link 
              href="/bills" 
              className="block w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="font-medium">Manage Bills</div>
              <div className="text-sm text-muted-foreground">Add, edit, or mark bills as paid</div>
            </Link>
            <Link 
              href="/income" 
              className="block w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="font-medium">Track Income</div>
              <div className="text-sm text-muted-foreground">Record your income sources</div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="text-sm">Salary payment received - {formatCurrency(4000)}</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="text-sm">Rent payment marked as paid - {formatCurrency(1200)}</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="text-sm">Electricity bill due in 3 days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}