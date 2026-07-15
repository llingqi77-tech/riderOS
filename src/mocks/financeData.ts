import type {
  Intervention,
  RiskLevel,
  RiskPrediction,
  Rider,
} from '@/types'

const CITIES = ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Nairobi', 'Mombasa']
const COMPANIES: Rider['financeCompany'][] = [
  'Watu',
  'MAX',
  'M-Kopa',
  'Tugende',
  'Ampersand',
]
const FIRST = [
  'Aminu', 'Chidi', 'Emeka', 'Bola', 'Kwame', 'Juma', 'Femi', 'Musa', 'Ade',
  'Ngozi', 'Tunde', 'Kofi', 'Sadiq', 'Ola', 'Ibrahim', 'Grace', 'Peter', 'John',
  'David', 'Samuel',
]
const LAST = [
  'Okafor', 'Adeyemi', 'Bello', 'Mensah', 'Otieno', 'Nwosu', 'Abubakar',
  'Eze', 'Balogun', 'Kamau',
]

function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function levelFromProb(p: number): RiskLevel {
  if (p >= 0.7) return 'red'
  if (p >= 0.45) return 'orange'
  if (p >= 0.25) return 'yellow'
  return 'green'
}

const REASON_BANK = [
  { factor: 'Daily net income drop', description: '14-day avg net is 32% below baseline; order frequency is down.' },
  { factor: 'Online hours plunge', description: 'Avg online hours fell from 8h to 4.5h this week; intensity down.' },
  { factor: 'Thin repayment buffer', description: 'Cycle net covers only 61% of amount due — buffer is thin.' },
  { factor: 'Prior late payment', description: '1 late payment in last 12 periods — weak repayment consistency.' },
  { factor: 'Rising repair costs', description: 'Repair spend is 14% of net over 30 days, eroding cash flow.' },
  { factor: 'Higher cancel rate', description: 'Cancel rate at 9%, 3pp above the city average.' },
]

function buildRider(i: number): Rider {
  const r = rand(i + 1)
  const r2 = rand(i + 99)
  // First rider is a red high-risk sample
  const prob = i === 0 ? 0.82 : +(r * 0.85).toFixed(2)
  const level = levelFromProb(prob)
  const score = Math.round(820 - prob * 320 + (r2 - 0.5) * 40)
  return {
    riderId: `rider_${String(i + 1).padStart(3, '0')}`,
    name: `${FIRST[i % FIRST.length]} ${LAST[i % LAST.length]}`,
    avatar: `https://i.pravatar.cc/80?img=${(i % 60) + 1}`,
    phone: `+234 80${(3 + (i % 5))} ${String(1000 + i).slice(-4)} ${String(2000 + i * 7).slice(-4)}`,
    city: CITIES[i % CITIES.length],
    vehicle: i % 4 === 0 ? 'electric_scooter' : 'motorcycle',
    vehicleId: `VH-${1000 + i}`,
    financeCompany: COMPANIES[i % COMPANIES.length],
    installmentAmount: 15000 + (i % 5) * 2500,
    installmentCycle: i % 3 === 0 ? 'monthly' : 'weekly',
    totalPeriods: 52,
    currentPeriod: 6 + (i % 40),
    creditScore: Math.max(300, Math.min(850, score)),
    riskLevel: level,
    riskProbability: prob,
    registeredAt: '2025-08-01T09:00:00+01:00',
  }
}

export const riders: Rider[] = Array.from({ length: 40 }).map((_, i) => buildRider(i))

export const ridersById: Record<string, Rider> = Object.fromEntries(
  riders.map((r) => [r.riderId, r]),
)

export function buildPrediction(rider: Rider): RiskPrediction {
  const base = rider.riskProbability
  const seed = parseInt(rider.riderId.replace(/\D/g, ''), 10)
  const picked = [0, 1, 2, 3, 4, 5]
    .sort((a, b) => rand(seed + a) - rand(seed + b))
    .slice(0, 3)
  let remaining = 1
  const reasons = picked.map((idx, k) => {
    const contribution =
      k === 2 ? +remaining.toFixed(2) : +(remaining * (0.4 + rand(seed + idx) * 0.3)).toFixed(2)
    remaining = Math.max(0, remaining - contribution)
    return { ...REASON_BANK[idx], contribution }
  })
  const action =
    rider.riskLevel === 'red'
      ? { type: 'call' as const, template: `Call ${rider.name} to confirm the income drop and agree a flexible repayment plan for this period.`, expectedImpact: 'Est. +45% recovery probability within 7 days' }
      : rider.riskLevel === 'orange'
        ? { type: 'call' as const, template: `Call back ${rider.name}, remind them of the repayment cadence, and recommend "Repayment sprint" mode.`, expectedImpact: 'Est. +30% attainment within 14 days' }
        : { type: 'sms' as const, template: `SMS ${rider.name}: a few days until next repayment — start setting funds aside.`, expectedImpact: 'Est. −15% overdue probability' }
  return {
    riderId: rider.riderId,
    predictedAt: new Date().toISOString(),
    overdueProbability7d: +Math.min(0.98, base + 0.05).toFixed(2),
    overdueProbability14d: +Math.min(0.99, base + 0.12).toFixed(2),
    overdueProbability30d: +Math.min(0.99, base + 0.2).toFixed(2),
    riskLevel: rider.riskLevel,
    reasons,
    recommendedAction: action,
  }
}

// Rider detail: income / repayment history
export function buildRiderDetail(rider: Rider) {
  const seed = parseInt(rider.riderId.replace(/\D/g, ''), 10)
  const trend = Array.from({ length: 30 }).map((_, d) => ({
    label: `D${d + 1}`,
    net: Math.round(3500 + rand(seed + d) * 4000 - rider.riskProbability * 1500),
  }))
  const repayHistory = Array.from({ length: 12 }).map((_, i) => ({
    period: i + 1,
    status:
      rand(seed + i * 3) < rider.riskProbability * 0.35
        ? ('overdue' as const)
        : ('paid' as const),
  }))
  return {
    avgDailyNet: Math.round(trend.reduce((s, t) => s + t.net, 0) / trend.length),
    dpd: rider.riskLevel === 'red' ? 6 : rider.riskLevel === 'orange' ? 2 : 0,
    daysUntilDue: 2 + (seed % 6),
    onTimeRate: +(1 - rider.riskProbability * 0.4).toFixed(2),
    trend,
    repayHistory,
  }
}

// F-B1 Risk overview (by date range)
export type OverviewRange = 30 | 60 | 90

function buildRiskTrend(days: number, seedOffset = 0) {
  return Array.from({ length: days }).map((_, d) => ({
    label: `${d + 1}`,
    green: Math.round(880 + rand(d + 1 + seedOffset) * 80 + days * 0.4),
    yellow: Math.round(200 + rand(d + 7 + seedOffset) * 50 + days * 0.15),
    orange: Math.round(80 + rand(d + 13 + seedOffset) * 40 + days * 0.1),
    red: Math.round(25 + rand(d + 21 + seedOffset) * 30 + days * 0.08),
  }))
}

function buildConversionTrend(weeks: number, seedOffset = 0) {
  return Array.from({ length: weeks }).map((_, w) => ({
    label: `W${w + 1}`,
    rate: Math.round(48 + rand(w + 3 + seedOffset) * 30 + weeks * 0.3),
    roi: +(1.8 + rand(w + 9 + seedOffset) * 2.8).toFixed(1),
  }))
}

const overviewByRange: Record<
  OverviewRange,
  {
    kpis: {
      key: string
      label: string
      value: string | number
      delta: string
      trend: 'up' | 'down'
    }[]
    riskTrend: ReturnType<typeof buildRiskTrend>
    riskReasons: { name: string; value: number }[]
    conversionTrend: ReturnType<typeof buildConversionTrend>
  }
> = {
  30: {
    kpis: [
      { key: 'active', label: 'Active financed riders', value: 1284, delta: '+42', trend: 'up' },
      { key: 'newHigh', label: 'New high-risk', value: 37, delta: '+8', trend: 'down' },
      { key: 'predicted', label: 'Predicted new overdue', value: 21, delta: '-5', trend: 'up' },
      { key: 'conversion', label: 'Post-intervention conversion', value: '68%', delta: '+6%', trend: 'up' },
    ],
    riskTrend: buildRiskTrend(30, 0),
    riskReasons: [
      { name: 'Income drop', value: 34 },
      { name: 'Online hours drop', value: 22 },
      { name: 'Thin buffer', value: 18 },
      { name: 'Prior overdue', value: 14 },
      { name: 'Repair cost', value: 12 },
    ],
    conversionTrend: buildConversionTrend(4, 0),
  },
  60: {
    kpis: [
      { key: 'active', label: 'Active financed riders', value: 1356, delta: '+98', trend: 'up' },
      { key: 'newHigh', label: 'New high-risk', value: 71, delta: '+15', trend: 'down' },
      { key: 'predicted', label: 'Predicted new overdue', value: 48, delta: '-9', trend: 'up' },
      { key: 'conversion', label: 'Post-intervention conversion', value: '64%', delta: '+3%', trend: 'up' },
    ],
    riskTrend: buildRiskTrend(60, 100),
    riskReasons: [
      { name: 'Income drop', value: 28 },
      { name: 'Online hours drop', value: 26 },
      { name: 'Thin buffer', value: 20 },
      { name: 'Prior overdue', value: 16 },
      { name: 'Repair cost', value: 10 },
    ],
    conversionTrend: buildConversionTrend(8, 20),
  },
  90: {
    kpis: [
      { key: 'active', label: 'Active financed riders', value: 1420, delta: '+162', trend: 'up' },
      { key: 'newHigh', label: 'New high-risk', value: 112, delta: '+22', trend: 'down' },
      { key: 'predicted', label: 'Predicted new overdue', value: 79, delta: '-12', trend: 'up' },
      { key: 'conversion', label: 'Post-intervention conversion', value: '61%', delta: '+1%', trend: 'up' },
    ],
    riskTrend: buildRiskTrend(90, 200),
    riskReasons: [
      { name: 'Income drop', value: 30 },
      { name: 'Online hours drop', value: 19 },
      { name: 'Thin buffer', value: 24 },
      { name: 'Prior overdue', value: 17 },
      { name: 'Repair cost', value: 10 },
    ],
    conversionTrend: buildConversionTrend(12, 40),
  },
}

export function getOverviewByRange(range: OverviewRange) {
  return overviewByRange[range]
}

/** @deprecated use getOverviewByRange(30) */
export const overviewKpis = overviewByRange[30].kpis
export const riskTrend30d = overviewByRange[30].riskTrend
export const riskReasonDistribution = overviewByRange[30].riskReasons
export const conversionTrend = overviewByRange[30].conversionTrend

// F-B6 Intervention log
export const interventions: Intervention[] = riders.slice(0, 12).map((r, i) => {
  const outcome =
    i % 3 === 0 ? 'recovered' : i % 3 === 1 ? 'partial' : 'failed'
  const type = (['sms', 'call', 'meeting', 'sms'] as const)[i % 4]
  return {
    interventionId: `int_${String(i + 1).padStart(3, '0')}`,
    riderId: r.riderId,
    type,
    content:
      type === 'sms'
        ? 'SMS reminder: 3 days until repayment — enable Repayment sprint mode.'
        : type === 'call'
          ? 'Call follow-up: confirm income drop cause and negotiate flexible repayment.'
          : 'In-person meeting: assess vehicle condition and operating hardship.',
    sentAt: new Date(Date.now() - i * 86400000).toISOString(),
    sentBy: 'kevin_risk',
    outcome: {
      response7d: { ordersCompleted: 12 + i, incomeRecovered: 8000 + i * 900 },
      response14d: { ordersCompleted: 24 + i, incomeRecovered: 16000 + i * 1200 },
      finalOutcome: outcome as 'recovered' | 'partial' | 'failed',
    },
  }
})

export const interventionKpis = [
  { key: 'count', label: 'Riders intervened this month', value: 96, delta: '+12' },
  { key: 'conv7', label: '7-day post-intervention conversion', value: '64%', delta: '+5%' },
  { key: 'roi', label: 'Intervention ROI', value: '3.4x', delta: '+0.3' },
  { key: 'recover', label: 'Avg recovery time', value: '5.2 days', delta: '-0.8' },
]

export const currentFinanceUser = {
  name: 'Kevin Mwangi',
  role: 'Risk Manager',
  company: 'MAX · Lagos Branch',
  avatar: 'https://i.pravatar.cc/80?img=53',
}
