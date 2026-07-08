// Core data contracts aligned with PRD §3.6

export type Platform = 'chowdeck' | 'glovo' | 'bolt_food' | 'uber_eats'
export type RiskLevel = 'green' | 'yellow' | 'orange' | 'red'

export interface Order {
  orderId: string
  platform: Platform
  merchantName: string
  merchantLocation: { lat: number; lng: number }
  deliveryLocation: { lat: number; lng: number }
  distance: number // km
  estimatedEarnings: number // NGN
  estimatedDuration: number // minutes
  pickupEta: number // minutes
  createdAt: string
  expiresAt: string
}

export interface Rider {
  riderId: string
  name: string
  avatar: string
  phone: string
  city: string
  vehicle: 'motorcycle' | 'electric_scooter'
  vehicleId: string
  financeCompany: 'Watu' | 'MAX' | 'M-Kopa' | 'Tugende' | 'Ampersand'
  installmentAmount: number
  installmentCycle: 'weekly' | 'monthly'
  totalPeriods: number
  currentPeriod: number
  creditScore: number // 300-850
  riskLevel: RiskLevel
  riskProbability: number // 0-1
  registeredAt: string
}

export type ExpenseCategory =
  | 'fuel'
  | 'electricity'
  | 'food'
  | 'maintenance'
  | 'platform_fee'

export interface IncomeRecord {
  recordId: string
  riderId: string
  type: 'order' | 'expense'
  category?: ExpenseCategory
  amount: number // NGN
  platform?: string
  timestamp: string
  note?: string
}

export interface RepaymentSchedule {
  scheduleId: string
  riderId: string
  dueDate: string
  amount: number
  status: 'pending' | 'paid' | 'overdue'
  daysUntilDue: number
}

export interface RiskReason {
  factor: string
  contribution: number // 0-1 SHAP
  description: string
}

export interface RiskPrediction {
  riderId: string
  predictedAt: string
  overdueProbability7d: number
  overdueProbability14d: number
  overdueProbability30d: number
  riskLevel: RiskLevel
  reasons: RiskReason[]
  recommendedAction: {
    type: 'sms' | 'call' | 'meeting' | 'repossess'
    template: string
    expectedImpact: string
  }
}

export interface Intervention {
  interventionId: string
  riderId: string
  type: 'sms' | 'call' | 'meeting' | 'repossess'
  content: string
  sentAt: string
  sentBy: string
  outcome: {
    response7d?: { ordersCompleted: number; incomeRecovered: number }
    response14d?: { ordersCompleted: number; incomeRecovered: number }
    finalOutcome?: 'recovered' | 'partial' | 'failed'
  }
}
