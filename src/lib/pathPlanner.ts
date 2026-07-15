import type { Order, Rider } from '@/types'

export type PlanMode = 'optimal' | 'repayment' | 'low_intensity'

export interface PlanRequest {
  orders: Order[]
  rider: Rider
  mode: PlanMode
  horizon: number // hours
  origin?: { lat: number; lng: number }
}

export interface PlanResult {
  sequence: Order[]
  totalEarnings: number
  totalDuration: number // minutes
  totalDistance: number // km
}

/** Haversine-ish planar distance is unnecessary here; orders already carry distance. */
function haversine(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return R * 2 * Math.asin(Math.sqrt(h))
}

const FUEL_COST_PER_KM = 45 // NGN estimate

/**
 * Greedy nearest-neighbour route planner.
 * Mode controls how many orders we recommend (density / pace), not exclusivity.
 */
export function planRoute(req: PlanRequest): PlanResult {
  const { orders, mode, horizon, origin = { lat: 6.5244, lng: 3.3792 } } = req

  const perHour = mode === 'repayment' ? 2.5 : mode === 'low_intensity' ? 1 : 1.8
  const targetCount = Math.max(1, Math.round(perHour * horizon))

  const pool = [...orders]
  const sequence: Order[] = []
  let cursor = origin

  while (sequence.length < targetCount && pool.length > 0) {
    let bestIdx = 0
    let bestScore = -Infinity
    for (let i = 0; i < pool.length; i++) {
      const o = pool[i]
      const legDist = haversine(cursor, o.merchantLocation) + o.distance
      const net = o.estimatedEarnings - legDist * FUEL_COST_PER_KM
      // repayment mode maximises earnings; low_intensity prefers short trips
      const score =
        mode === 'low_intensity'
          ? -o.estimatedDuration
          : mode === 'repayment'
            ? net
            : net / Math.max(o.estimatedDuration, 1)
      if (score > bestScore) {
        bestScore = score
        bestIdx = i
      }
    }
    const picked = pool.splice(bestIdx, 1)[0]
    sequence.push(picked)
    cursor = picked.deliveryLocation
  }

  const totalEarnings = sequence.reduce((s, o) => s + o.estimatedEarnings, 0)
  const totalDuration = sequence.reduce((s, o) => s + o.estimatedDuration, 0)
  const totalDistance = sequence.reduce((s, o) => s + o.distance, 0)

  return { sequence, totalEarnings, totalDuration, totalDistance }
}

/** Net income = platform gross - platform fee (15%) - expenses */
export function calculateNetIncome(gross: number, expenses: number): number {
  const platformFee = gross * 0.15
  return Math.round(gross - platformFee - expenses)
}
