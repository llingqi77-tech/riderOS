// Re-exports for backward compatibility; city-specific data lives in cities.ts
export type { CityId, CityCurrency, CityProfile } from './cities'
export { CITY_LIST, CITIES, getCityData } from './cities'

import { CITIES } from './cities'

const lagos = CITIES.lagos

export const currentRider = lagos.rider
export const todaySnapshot = lagos.todaySnapshot
export const orders = lagos.orders
export const incomeRecords = lagos.incomeRecords
export const incomeTrend = lagos.incomeTrend
export const incomeSummary = lagos.incomeSummary
export const incomeBreakdown = lagos.incomeBreakdown
export const nextRepayment = lagos.nextRepayment
export const repaymentAnalysis = lagos.repaymentAnalysis
export const repaymentHistory = lagos.repaymentHistory

export const PLATFORM_LABEL = {
  chowdeck: 'Chowdeck',
  glovo: 'Glovo',
  bolt_food: 'Bolt Food',
  uber_eats: 'Uber Eats',
} as const
