import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BatteryCharging,
  CalendarClock,
  Fuel,
  UtensilsCrossed,
  Wrench,
} from 'lucide-react'
import { useRiderStore } from '@/store/riderStore'
import { formatCurrency } from '@/lib/format'
import AIInsightCard from '@/components/rider/AIInsightCard'
import ExpenseInputSheet from '@/components/rider/ExpenseInputSheet'
import type { ExpenseCategory } from '@/types'

const QUICK_EXPENSE = [
  { key: 'fuel' as const, label: 'Fuel', icon: Fuel },
  { key: 'electricity' as const, label: 'Battery', icon: BatteryCharging },
  { key: 'food' as const, label: 'Food', icon: UtensilsCrossed },
  { key: 'maintenance' as const, label: 'Repair', icon: Wrench },
]

export default function HomePage() {
  const navigate = useNavigate()
  const data = useRiderStore((s) => s.cityData())
  const net = useRiderStore((s) => s.netIncome())
  const [sheetOpen, setSheetOpen] = useState(false)
  const [cat, setCat] = useState<ExpenseCategory>('fuel')

  const { todaySnapshot, nextRepayment, currency } = data
  const fmt = (v: number) => formatCurrency(v, currency)
  const progress = Math.min(1, net / todaySnapshot.todayTarget)
  const gap = todaySnapshot.todayTarget - net

  function openSheet(c: ExpenseCategory) {
    setCat(c)
    setSheetOpen(true)
  }

  return (
    <div className="space-y-4">
      <section className="rounded-card bg-gradient-to-br from-brand to-brand-dark p-5 text-white shadow-card">
        <p className="text-sm text-white/80">Today&apos;s net income · {data.name}</p>
        <p className="num-big mt-1 text-[44px] leading-none">{fmt(net)}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-white/85">
          <span>Target {fmt(todaySnapshot.todayTarget)}</span>
          <span>{Math.round(progress * 100)}% complete</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="mt-3 text-sm font-medium">
          {gap > 0
            ? `Earn ${fmt(gap)} more to hit today's target · ${todaySnapshot.dailyEta}`
            : "Today's target hit — great work!"}
        </p>
      </section>

      <button
        onClick={() => navigate('/rider/orders')}
        className="flex w-full items-center justify-between rounded-card bg-white p-4 text-left shadow-card active:scale-[0.99]"
      >
        <div>
          <p className="text-sm font-bold">Recommended action sequence</p>
          <p className="mt-0.5 text-xs text-neutral-500">
            Next 2 hours: take <span className="font-semibold text-brand">3 orders</span>
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-btn bg-brand/10 px-3 py-2 text-sm font-semibold text-brand">
          Go accept <ArrowRight size={15} />
        </span>
      </button>

      <button
        onClick={() => navigate('/rider/repayment')}
        className="flex w-full items-center gap-3 rounded-card border border-warn/30 bg-warn/10 p-4 text-left active:scale-[0.99]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-warn/20 text-warn">
          <CalendarClock size={20} />
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold text-neutral-900">
            {nextRepayment.daysUntilDue} days until repayment
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">
            Due {fmt(nextRepayment.amount)} · expected attainment{' '}
            {Math.round(data.repaymentAnalysis.attainmentRate * 100)}%
          </p>
        </div>
        <ArrowRight size={16} className="text-warn" />
      </button>

      <section className="rounded-card bg-white p-4 shadow-card">
        <p className="mb-3 text-sm font-bold">Quick expense log</p>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_EXPENSE.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => openSheet(key)}
              className="flex flex-col items-center gap-1.5 rounded-btn bg-canvas py-3 text-xs text-neutral-500 hover:bg-neutral-200"
            >
              <Icon size={20} className="text-neutral-900" />
              {label}
            </button>
          ))}
        </div>
      </section>

      <AIInsightCard text={todaySnapshot.aiInsight} />

      <ExpenseInputSheet
        open={sheetOpen}
        initialCategory={cat}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  )
}
