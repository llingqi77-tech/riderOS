import type {
  IncomeRecord,
  Order,
  Platform,
  RepaymentSchedule,
  Rider,
} from '@/types'

export type CityId = 'lagos' | 'nairobi' | 'abuja'
export type CityCurrency = 'NGN' | 'KES'

export interface CityProfile {
  id: CityId
  name: string
  country: string
  currency: CityCurrency
  locale: string
  origin: { lat: number; lng: number }
  rider: Rider
  todaySnapshot: {
    dailyIncome: number
    todayTarget: number
    dailyEta: string
    ordersCompleted: number
    onlineHours: number
    aiInsight: string
  }
  orders: Order[]
  incomeRecords: IncomeRecord[]
  incomeTrend: {
    today: { label: string; income: number; expense: number }[]
    week: { label: string; income: number; expense: number }[]
    month: { label: string; income: number; expense: number }[]
  }
  incomeSummary: {
    today: { net: number; gross: number; prev: number; best: number; target: number }
    week: { net: number; gross: number; prev: number; best: number; target: number }
    month: { net: number; gross: number; prev: number; best: number; target: number }
  }
  incomeBreakdown: {
    sources: { name: string; value: number }[]
    expenses: { name: string; value: number }[]
  }
  nextRepayment: RepaymentSchedule
  repaymentAnalysis: {
    earnedSoFar: number
    projected: number
    required: number
    attainmentRate: number
    gap: number
    overtimeSuggestion: string
  }
  repaymentHistory: RepaymentSchedule[]
}

export const CITY_LIST: { id: CityId; name: string; country: string }[] = [
  { id: 'lagos', name: 'Lagos', country: '尼日利亚' },
  { id: 'nairobi', name: 'Nairobi', country: '肯尼亚' },
  { id: 'abuja', name: 'Abuja', country: '尼日利亚' },
]

const PLATFORMS: Platform[] = ['chowdeck', 'glovo', 'bolt_food', 'uber_eats']

function iso(offsetMin: number): string {
  return new Date(Date.now() + offsetMin * 60_000).toISOString()
}

function rand(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function buildOrders(
  citySeed: number,
  origin: { lat: number; lng: number },
  merchants: string[],
  count = 20,
): Order[] {
  return Array.from({ length: count }).map((_, i) => {
    const r = rand(citySeed + i + 1)
    const r2 = rand(citySeed + i + 50)
    const distance = +(1.2 + r * 6).toFixed(1)
    const earnings = Math.round(700 + r2 * 2100)
    const lat = origin.lat + r * 0.12
    const lng = origin.lng + r2 * 0.12
    return {
      orderId: `ord_${citySeed}_${String(i + 1).padStart(3, '0')}`,
      platform: PLATFORMS[i % PLATFORMS.length],
      merchantName: merchants[i % merchants.length],
      merchantLocation: { lat, lng },
      deliveryLocation: {
        lat: lat + (r - 0.5) * 0.05,
        lng: lng + (r2 - 0.5) * 0.05,
      },
      distance,
      estimatedEarnings: earnings,
      estimatedDuration: Math.round(12 + distance * 4),
      pickupEta: Math.round(5 + r * 12),
      createdAt: iso(-i * 3),
      expiresAt: iso(30 - i),
    }
  })
}

const LAGOS_MERCHANTS = [
  'Mama Cass Restaurant',
  'Chicken Republic Ikeja',
  'The Place Lekki',
  'Kilimanjaro Yaba',
  "Domino's Surulere",
  'Sweet Sensation VI',
  'Iya Basira Buka',
  'Ofada Boy',
  'Cold Stone Ikoyi',
  'Debonairs Pizza',
]

const NAIROBI_MERCHANTS = [
  'Java House Westlands',
  'Artcaffe Karen',
  'KFC Sarit Centre',
  'Pizza Inn CBD',
  'Nyama Mama',
  'Talisman Restaurant',
  'Carnivore Simba Saloon',
  'Galitos Lavington',
  'Burger King Two Rivers',
  'Mama Oliech',
]

const ABUJA_MERCHANTS = [
  'Nkoyo Restaurant',
  'Bistro 7 Wuse',
  'Santorini Abuja',
  'Bungalow Restaurant',
  'Blu Cabana',
  'Cantina Restaurant',
  'The Vue',
  'Honey and Spice',
  'Pizza Jungle',
  'Transcorp Hilton Grill',
]

function baseRider(overrides: Partial<Rider>): Rider {
  return {
    riderId: 'rider_aminu',
    name: 'Aminu Okafor',
    avatar: 'https://i.pravatar.cc/120?img=12',
    phone: '+234 803 555 0142',
    city: 'Lagos',
    vehicle: 'motorcycle',
    vehicleId: 'LAG-MC-2291',
    financeCompany: 'MAX',
    installmentAmount: 18500,
    installmentCycle: 'weekly',
    totalPeriods: 52,
    currentPeriod: 17,
    creditScore: 682,
    riskLevel: 'yellow',
    riskProbability: 0.31,
    registeredAt: '2025-11-04T09:00:00+01:00',
    ...overrides,
  }
}

function buildRepaymentHistory(
  riderId: string,
  amount: number,
  daysUntilDue: number,
): RepaymentSchedule[] {
  return Array.from({ length: 12 }).map((_, i) => {
    const period = 17 - i
    const overdue = i === 4
    return {
      scheduleId: `sch_${String(period).padStart(3, '0')}`,
      riderId,
      dueDate: iso(-(i + 1) * 7 * 24 * 60),
      amount,
      status: i === 0 ? 'pending' : overdue ? 'overdue' : 'paid',
      daysUntilDue: i === 0 ? daysUntilDue : -(i + 1) * 7,
    }
  })
}

export const CITIES: Record<CityId, CityProfile> = {
  lagos: {
    id: 'lagos',
    name: 'Lagos',
    country: '尼日利亚',
    currency: 'NGN',
    locale: 'en-NG',
    origin: { lat: 6.5244, lng: 3.3792 },
    rider: baseRider({ city: 'Lagos', vehicleId: 'LAG-MC-2291' }),
    todaySnapshot: {
      dailyIncome: 6500,
      todayTarget: 7000,
      dailyEta: '约 40 分钟后达标',
      ordersCompleted: 9,
      onlineHours: 5.5,
      aiInsight:
        '你今天的单均净收入比昨天高 8%。再跑 2 单（约 40 分钟）即可达到今日目标 ₦7,000。',
    },
    orders: buildOrders(1, { lat: 6.5244, lng: 3.3792 }, LAGOS_MERCHANTS),
    incomeRecords: [
      { recordId: 'rec_l1', riderId: 'rider_aminu', type: 'order', amount: 1450, platform: 'Chowdeck', timestamp: iso(-320), note: 'Mama Cass → Ikeja GRA' },
      { recordId: 'rec_l2', riderId: 'rider_aminu', type: 'order', amount: 980, platform: 'Glovo', timestamp: iso(-290) },
      { recordId: 'rec_l3', riderId: 'rider_aminu', type: 'expense', category: 'fuel', amount: 1200, timestamp: iso(-280), note: '加油 3L' },
      { recordId: 'rec_l4', riderId: 'rider_aminu', type: 'order', amount: 1720, platform: 'Bolt Food', timestamp: iso(-240) },
      { recordId: 'rec_l5', riderId: 'rider_aminu', type: 'order', amount: 1100, platform: 'Chowdeck', timestamp: iso(-200) },
      { recordId: 'rec_l6', riderId: 'rider_aminu', type: 'expense', category: 'food', amount: 600, timestamp: iso(-180), note: '午餐' },
      { recordId: 'rec_l7', riderId: 'rider_aminu', type: 'order', amount: 2050, platform: 'Uber Eats', timestamp: iso(-120) },
      { recordId: 'rec_l8', riderId: 'rider_aminu', type: 'order', amount: 1330, platform: 'Glovo', timestamp: iso(-70) },
      { recordId: 'rec_l9', riderId: 'rider_aminu', type: 'expense', category: 'maintenance', amount: 500, timestamp: iso(-40), note: '补胎' },
    ],
    incomeTrend: {
      today: [
        { label: '08:00', income: 900, expense: 300 },
        { label: '10:00', income: 2100, expense: 1500 },
        { label: '12:00', income: 3400, expense: 2100 },
        { label: '14:00', income: 4800, expense: 2600 },
        { label: '16:00', income: 6100, expense: 3100 },
        { label: '18:00', income: 8200, expense: 3400 },
      ],
      week: [
        { label: '周一', income: 7200, expense: 2600 },
        { label: '周二', income: 6800, expense: 2400 },
        { label: '周三', income: 8100, expense: 2900 },
        { label: '周四', income: 5900, expense: 2200 },
        { label: '周五', income: 9200, expense: 3300 },
        { label: '周六', income: 10400, expense: 3600 },
        { label: '周日', income: 8200, expense: 3400 },
      ],
      month: [
        { label: '第 1 周', income: 48000, expense: 17000 },
        { label: '第 2 周', income: 52000, expense: 18500 },
        { label: '第 3 周', income: 46000, expense: 16000 },
        { label: '第 4 周', income: 55800, expense: 19200 },
      ],
    },
    incomeSummary: {
      today: { net: 6500, gross: 10680, prev: 6020, best: 8300, target: 7000 },
      week: { net: 39100, gross: 55800, prev: 36400, best: 44200, target: 42000 },
      month: { net: 165600, gross: 201800, prev: 152000, best: 178000, target: 180000 },
    },
    incomeBreakdown: {
      sources: [
        { name: 'Chowdeck', value: 4200 },
        { name: 'Glovo', value: 2900 },
        { name: 'Bolt Food', value: 2100 },
        { name: 'Uber Eats', value: 1480 },
      ],
      expenses: [
        { name: '加油', value: 1200 },
        { name: '换电', value: 0 },
        { name: '餐食', value: 600 },
        { name: '维修', value: 500 },
        { name: '平台抽成', value: 1600 },
      ],
    },
    nextRepayment: {
      scheduleId: 'sch_018',
      riderId: 'rider_aminu',
      dueDate: iso(3 * 24 * 60),
      amount: 18500,
      status: 'pending',
      daysUntilDue: 3,
    },
    repaymentAnalysis: {
      earnedSoFar: 12300,
      projected: 18000,
      required: 18500,
      attainmentRate: 0.78,
      gap: -500,
      overtimeSuggestion: '本周还差约 ₦500，建议在还款日前多接 1 单即可覆盖。',
    },
    repaymentHistory: buildRepaymentHistory('rider_aminu', 18500, 3),
  },

  nairobi: {
    id: 'nairobi',
    name: 'Nairobi',
    country: '肯尼亚',
    currency: 'KES',
    locale: 'en-KE',
    origin: { lat: -1.2921, lng: 36.8219 },
    rider: baseRider({
      city: 'Nairobi',
      vehicleId: 'NBO-MC-1187',
      phone: '+254 712 345 678',
      financeCompany: 'Watu',
      installmentAmount: 3200,
    }),
    todaySnapshot: {
      dailyIncome: 4200,
      todayTarget: 5500,
      dailyEta: '约 55 分钟后达标',
      ordersCompleted: 7,
      onlineHours: 4.5,
      aiInsight:
        'Westlands 商圈午高峰单量上升 15%。再跑 2 单（约 55 分钟）即可达到今日目标 KSh 5,500。',
    },
    orders: buildOrders(2, { lat: -1.2921, lng: 36.8219 }, NAIROBI_MERCHANTS, 18),
    incomeRecords: [
      { recordId: 'rec_n1', riderId: 'rider_aminu', type: 'order', amount: 890, platform: 'Glovo', timestamp: iso(-300), note: 'Java House → Karen' },
      { recordId: 'rec_n2', riderId: 'rider_aminu', type: 'order', amount: 720, platform: 'Bolt Food', timestamp: iso(-260) },
      { recordId: 'rec_n3', riderId: 'rider_aminu', type: 'expense', category: 'fuel', amount: 450, timestamp: iso(-250), note: '加油 2L' },
      { recordId: 'rec_n4', riderId: 'rider_aminu', type: 'order', amount: 1050, platform: 'Uber Eats', timestamp: iso(-200) },
      { recordId: 'rec_n5', riderId: 'rider_aminu', type: 'order', amount: 680, platform: 'Glovo', timestamp: iso(-150) },
      { recordId: 'rec_n6', riderId: 'rider_aminu', type: 'expense', category: 'food', amount: 350, timestamp: iso(-130), note: '午餐' },
      { recordId: 'rec_n7', riderId: 'rider_aminu', type: 'order', amount: 960, platform: 'Bolt Food', timestamp: iso(-80) },
    ],
    incomeTrend: {
      today: [
        { label: '08:00', income: 600, expense: 200 },
        { label: '10:00', income: 1400, expense: 550 },
        { label: '12:00', income: 2300, expense: 900 },
        { label: '14:00', income: 3100, expense: 1200 },
        { label: '16:00', income: 3900, expense: 1500 },
        { label: '18:00', income: 5200, expense: 1700 },
      ],
      week: [
        { label: '周一', income: 4800, expense: 1800 },
        { label: '周二', income: 4500, expense: 1600 },
        { label: '周三', income: 5200, expense: 1900 },
        { label: '周四', income: 4100, expense: 1500 },
        { label: '周五', income: 5800, expense: 2100 },
        { label: '周六', income: 6500, expense: 2300 },
        { label: '周日', income: 5100, expense: 1900 },
      ],
      month: [
        { label: '第 1 周', income: 32000, expense: 11500 },
        { label: '第 2 周', income: 34500, expense: 12200 },
        { label: '第 3 周', income: 30000, expense: 10800 },
        { label: '第 4 周', income: 36800, expense: 13000 },
      ],
    },
    incomeSummary: {
      today: { net: 4200, gross: 6800, prev: 3900, best: 5800, target: 5500 },
      week: { net: 24800, gross: 35200, prev: 23100, best: 28500, target: 27000 },
      month: { net: 102000, gross: 128000, prev: 96000, best: 112000, target: 115000 },
    },
    incomeBreakdown: {
      sources: [
        { name: 'Glovo', value: 1800 },
        { name: 'Bolt Food', value: 1500 },
        { name: 'Uber Eats', value: 1200 },
        { name: 'Chowdeck', value: 800 },
      ],
      expenses: [
        { name: '加油', value: 450 },
        { name: '换电', value: 0 },
        { name: '餐食', value: 350 },
        { name: '维修', value: 0 },
        { name: '平台抽成', value: 1020 },
      ],
    },
    nextRepayment: {
      scheduleId: 'sch_018',
      riderId: 'rider_aminu',
      dueDate: iso(5 * 24 * 60),
      amount: 3200,
      status: 'pending',
      daysUntilDue: 5,
    },
    repaymentAnalysis: {
      earnedSoFar: 2100,
      projected: 3100,
      required: 3200,
      attainmentRate: 0.85,
      gap: -100,
      overtimeSuggestion: '本周还差约 KSh 100，建议晚高峰多接 1 单即可覆盖。',
    },
    repaymentHistory: buildRepaymentHistory('rider_aminu', 3200, 5),
  },

  abuja: {
    id: 'abuja',
    name: 'Abuja',
    country: '尼日利亚',
    currency: 'NGN',
    locale: 'en-NG',
    origin: { lat: 9.0765, lng: 7.3986 },
    rider: baseRider({
      city: 'Abuja',
      vehicleId: 'ABJ-MC-3340',
      installmentAmount: 16000,
      creditScore: 710,
      riskLevel: 'green',
      riskProbability: 0.18,
    }),
    todaySnapshot: {
      dailyIncome: 5800,
      todayTarget: 6500,
      dailyEta: '约 35 分钟后达标',
      ordersCompleted: 8,
      onlineHours: 5,
      aiInsight:
        'Wuse 区订单密度较高，单均距离比 Lagos 短 12%。再跑 1 单（约 35 分钟）即可达到今日目标 ₦6,500。',
    },
    orders: buildOrders(3, { lat: 9.0765, lng: 7.3986 }, ABUJA_MERCHANTS, 16),
    incomeRecords: [
      { recordId: 'rec_a1', riderId: 'rider_aminu', type: 'order', amount: 1280, platform: 'Chowdeck', timestamp: iso(-310), note: 'Nkoyo → Maitama' },
      { recordId: 'rec_a2', riderId: 'rider_aminu', type: 'order', amount: 920, platform: 'Bolt Food', timestamp: iso(-270) },
      { recordId: 'rec_a3', riderId: 'rider_aminu', type: 'expense', category: 'fuel', amount: 1000, timestamp: iso(-260), note: '加油 2.5L' },
      { recordId: 'rec_a4', riderId: 'rider_aminu', type: 'order', amount: 1560, platform: 'Glovo', timestamp: iso(-220) },
      { recordId: 'rec_a5', riderId: 'rider_aminu', type: 'order', amount: 1040, platform: 'Chowdeck', timestamp: iso(-160) },
      { recordId: 'rec_a6', riderId: 'rider_aminu', type: 'expense', category: 'food', amount: 500, timestamp: iso(-140), note: '午餐' },
    ],
    incomeTrend: {
      today: [
        { label: '08:00', income: 800, expense: 250 },
        { label: '10:00', income: 1900, expense: 1200 },
        { label: '12:00', income: 3000, expense: 1800 },
        { label: '14:00', income: 4200, expense: 2200 },
        { label: '16:00', income: 5400, expense: 2700 },
        { label: '18:00', income: 7100, expense: 3000 },
      ],
      week: [
        { label: '周一', income: 6500, expense: 2300 },
        { label: '周二', income: 6100, expense: 2100 },
        { label: '周三', income: 7200, expense: 2500 },
        { label: '周四', income: 5500, expense: 2000 },
        { label: '周五', income: 8000, expense: 2900 },
        { label: '周六', income: 9000, expense: 3200 },
        { label: '周日', income: 7000, expense: 2800 },
      ],
      month: [
        { label: '第 1 周', income: 42000, expense: 15000 },
        { label: '第 2 周', income: 45000, expense: 16000 },
        { label: '第 3 周', income: 40000, expense: 14000 },
        { label: '第 4 周', income: 48000, expense: 17000 },
      ],
    },
    incomeSummary: {
      today: { net: 5800, gross: 9200, prev: 5400, best: 7200, target: 6500 },
      week: { net: 34500, gross: 49300, prev: 32200, best: 39000, target: 38000 },
      month: { net: 142000, gross: 175000, prev: 135000, best: 155000, target: 160000 },
    },
    incomeBreakdown: {
      sources: [
        { name: 'Chowdeck', value: 3600 },
        { name: 'Glovo', value: 2400 },
        { name: 'Bolt Food', value: 1800 },
        { name: 'Uber Eats', value: 1400 },
      ],
      expenses: [
        { name: '加油', value: 1000 },
        { name: '换电', value: 0 },
        { name: '餐食', value: 500 },
        { name: '维修', value: 0 },
        { name: '平台抽成', value: 1380 },
      ],
    },
    nextRepayment: {
      scheduleId: 'sch_018',
      riderId: 'rider_aminu',
      dueDate: iso(7 * 24 * 60),
      amount: 16000,
      status: 'pending',
      daysUntilDue: 7,
    },
    repaymentAnalysis: {
      earnedSoFar: 11200,
      projected: 16800,
      required: 16000,
      attainmentRate: 0.92,
      gap: 800,
      overtimeSuggestion: '当前已超额达标，保持现有节奏即可按时还款。',
    },
    repaymentHistory: buildRepaymentHistory('rider_aminu', 16000, 7),
  },
}

export function getCityData(cityId: CityId): CityProfile {
  return CITIES[cityId]
}
