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
  { factor: '日均净收入下降', description: '过去 14 天日均净收入较基线下降 32%，接单频率明显走低。' },
  { factor: '在线时长骤减', description: '最近一周日均在线时长从 8h 降到 4.5h，工作强度下降。' },
  { factor: '还款缓冲不足', description: '当前周期已净收入仅覆盖应还金额的 61%，缓冲垫过薄。' },
  { factor: '历史逾期记录', description: '过去 12 期中出现 1 次逾期，履约稳定性偏弱。' },
  { factor: '维修成本上升', description: '近 30 天维修支出占净收入比重升至 14%，侵蚀现金流。' },
  { factor: '订单取消率升高', description: '订单取消率升至 9%，高于城市均值 3 个百分点。' },
]

function buildRider(i: number): Rider {
  const r = rand(i + 1)
  const r2 = rand(i + 99)
  // 让第 1 个是红色高风险样本
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
      ? { type: 'call' as const, template: `致电 ${rider.name}，确认近期收入骤降原因，并协商本期弹性还款方案。`, expectedImpact: '预计 7 天内挽回概率 +45%' }
      : rider.riskLevel === 'orange'
        ? { type: 'call' as const, template: `电话回访 ${rider.name}，提醒还款节奏并推荐"还款冲刺"模式。`, expectedImpact: '预计 14 天内达标率 +30%' }
        : { type: 'sms' as const, template: `发送短信提醒 ${rider.name}：距下次还款还有数天，建议提前储备。`, expectedImpact: '预计降低逾期概率 15%' }
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

// 骑手详情：收入 / 还款历史
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

// F-B1 风险总览（按时间范围分套数据）
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
      { key: 'active', label: '在贷骑手数', value: 1284, delta: '+42', trend: 'up' },
      { key: 'newHigh', label: '新增高风险', value: 37, delta: '+8', trend: 'down' },
      { key: 'predicted', label: '预测新增逾期', value: 21, delta: '-5', trend: 'up' },
      { key: 'conversion', label: '干预后转化率', value: '68%', delta: '+6%', trend: 'up' },
    ],
    riskTrend: buildRiskTrend(30, 0),
    riskReasons: [
      { name: '收入下降', value: 34 },
      { name: '在线骤减', value: 22 },
      { name: '缓冲不足', value: 18 },
      { name: '历史逾期', value: 14 },
      { name: '维修成本', value: 12 },
    ],
    conversionTrend: buildConversionTrend(4, 0),
  },
  60: {
    kpis: [
      { key: 'active', label: '在贷骑手数', value: 1356, delta: '+98', trend: 'up' },
      { key: 'newHigh', label: '新增高风险', value: 71, delta: '+15', trend: 'down' },
      { key: 'predicted', label: '预测新增逾期', value: 48, delta: '-9', trend: 'up' },
      { key: 'conversion', label: '干预后转化率', value: '64%', delta: '+3%', trend: 'up' },
    ],
    riskTrend: buildRiskTrend(60, 100),
    riskReasons: [
      { name: '收入下降', value: 28 },
      { name: '在线骤减', value: 26 },
      { name: '缓冲不足', value: 20 },
      { name: '历史逾期', value: 16 },
      { name: '维修成本', value: 10 },
    ],
    conversionTrend: buildConversionTrend(8, 20),
  },
  90: {
    kpis: [
      { key: 'active', label: '在贷骑手数', value: 1420, delta: '+162', trend: 'up' },
      { key: 'newHigh', label: '新增高风险', value: 112, delta: '+22', trend: 'down' },
      { key: 'predicted', label: '预测新增逾期', value: 79, delta: '-12', trend: 'up' },
      { key: 'conversion', label: '干预后转化率', value: '61%', delta: '+1%', trend: 'up' },
    ],
    riskTrend: buildRiskTrend(90, 200),
    riskReasons: [
      { name: '收入下降', value: 30 },
      { name: '在线骤减', value: 19 },
      { name: '缓冲不足', value: 24 },
      { name: '历史逾期', value: 17 },
      { name: '维修成本', value: 10 },
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

// F-B6 干预记录
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
        ? '短信提醒：距下次还款还有 3 天，建议开启还款冲刺模式。'
        : type === 'call'
          ? '电话回访：确认收入下降原因，协商弹性还款。'
          : '线下面谈：评估车辆状况与经营困难。',
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
  { key: 'count', label: '本月已干预骑手', value: 96, delta: '+12' },
  { key: 'conv7', label: '干预后 7 天转化率', value: '64%', delta: '+5%' },
  { key: 'roi', label: '干预 ROI', value: '3.4x', delta: '+0.3' },
  { key: 'recover', label: '平均挽回时长', value: '5.2 天', delta: '-0.8' },
]

export const currentFinanceUser = {
  name: 'Kevin Mwangi',
  role: '风控经理',
  company: 'MAX · Lagos 分公司',
  avatar: 'https://i.pravatar.cc/80?img=53',
}
