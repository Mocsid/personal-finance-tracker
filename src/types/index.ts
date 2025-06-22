export type BillStatus = 'PAID' | 'UNPAID' | 'OVERDUE' | 'PARTIAL'

export interface BillTemplate {
  id: string
  name: string
  description?: string
  amount: number
  dueDay: number // Day of month (1-31)
  category: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Bill {
  id: string
  templateId?: string
  name: string
  amount: number
  dueDate: Date
  paidDate?: Date
  status: BillStatus
  category: string
  remarks?: string
  month: number
  year: number
  createdAt: Date
  updatedAt: Date
  template?: BillTemplate
}

export interface Income {
  id: string
  source: string
  description?: string
  amount: number
  taxDeduction: number
  netAmount: number
  date: Date
  month: number
  year: number
  category?: string
  remarks?: string
  createdAt: Date
  updatedAt: Date
}

export interface MonthlyOverview {
  month: number
  year: number
  totalIncome: number
  totalBills: number
  paidBills: number
  unpaidBills: number
  netAmount: number
}

// Extended types for recurring functionality
export interface RecurringBillData {
  createTemplate: boolean
  templateData: Partial<BillTemplate>
}

export interface ExtendedBill extends Bill {
  createTemplate?: boolean
  templateData?: Partial<BillTemplate>
}