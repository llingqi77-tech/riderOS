import { useEffect, useMemo, useState } from 'react'
import { Clock, Route, Wallet } from 'lucide-react'
import { useRiderStore } from '@/store/riderStore'
import { planRoute, type PlanMode } from '@/lib/pathPlanner'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/cn'
import OrderCard from '@/components/rider/OrderCard'

const MODES: { key: PlanMode; label: string }[] = [
  { key: 'optimal', label: 'Optimal path' },
  { key: 'repayment', label: 'Repayment sprint' },
  { key: 'low_intensity', label: 'Low intensity' },
]

export default function OrdersPage() {
  const city = useRiderStore((s) => s.city)
  const data = useRiderStore((s) => s.cityData())
  const [mode, setMode] = useState<PlanMode>('optimal')
  const [skipped, setSkipped] = useState<string[]>([])
  const [accepted, setAccepted] = useState<string[]>([])

  // Reset order state when city changes
  useEffect(() => {
    setSkipped([])
    setAccepted([])
  }, [city])

  const allOrders = data.orders
  const fmt = (v: number) => formatCurrency(v, data.currency)

  const pool = useMemo(
    () => allOrders.filter((o) => !skipped.includes(o.orderId) && !accepted.includes(o.orderId)),
    [allOrders, skipped, accepted],
  )

  const plan = useMemo(
    () =>
      planRoute({
        orders: pool,
        rider: data.rider,
        mode,
        horizon: 2,
        origin: data.origin,
      }),
    [pool, data.rider, data.origin, mode],
  )

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">Action sequence · {data.name}</h1>

      <div className="flex rounded-btn bg-neutral-200/60 p-1">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={cn(
              'flex-1 rounded-[6px] py-1.5 text-sm font-medium transition',
              mode === m.key ? 'bg-white text-brand shadow-card' : 'text-neutral-500',
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <section className="rounded-card bg-gradient-to-br from-brand to-brand-dark p-5 text-white shadow-card">
        <p className="text-sm text-white/85">
          Next 2 hours: take {plan.sequence.length} orders
        </p>
        <p className="num-big mt-1 text-4xl">{fmt(plan.totalEarnings)}</p>
        <div className="mt-3 flex gap-4 text-xs text-white/85">
          <span className="flex items-center gap-1">
            <Clock size={13} /> ~{plan.totalDuration} min
          </span>
          <span className="flex items-center gap-1">
            <Route size={13} /> {plan.totalDistance.toFixed(1)} km
          </span>
          <span className="flex items-center gap-1">
            <Wallet size={13} /> Net after fuel/battery
          </span>
        </div>
      </section>

      <div className="relative h-28 overflow-hidden rounded-card bg-[linear-gradient(135deg,#dcfce7_0%,#dbeafe_100%)]">
        <svg viewBox="0 0 300 100" className="h-full w-full">
          <polyline
            points="20,80 80,40 150,60 220,25 280,50"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeDasharray="6 5"
          />
          {[
            [20, 80],
            [80, 40],
            [150, 60],
            [220, 25],
            [280, 50],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 0 ? 5 : 4} fill="#059669" />
          ))}
        </svg>
        <span className="absolute left-3 top-2 rounded-tag bg-white/80 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
          {data.name} route preview
        </span>
      </div>

      <div className="space-y-2.5">
        {plan.sequence.length === 0 ? (
          <div className="rounded-card bg-white p-8 text-center text-sm text-neutral-500">
            No orders in {data.name} — check back later
          </div>
        ) : (
          plan.sequence.map((o, i) => (
            <OrderCard
              key={o.orderId}
              order={o}
              index={i + 1}
              currency={data.currency}
              onAccept={() => setAccepted((a) => [...a, o.orderId])}
              onSkip={() => setSkipped((s) => [...s, o.orderId])}
            />
          ))
        )}
      </div>

      <button
        onClick={() => {
          setSkipped([])
          setAccepted([])
        }}
        className="w-full rounded-btn border border-neutral-200 bg-white py-2.5 text-sm font-medium text-neutral-500"
      >
        Replan · view all orders ({allOrders.length})
      </button>
    </div>
  )
}
