import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock3, TrendingUp } from 'lucide-react'
import { useRiderStore } from '@/store/riderStore'
import { formatCurrency } from '@/lib/format'
import { getReminderLevel, cn } from '@/lib/cn'

export default function RepaymentPage() {
  const navigate = useNavigate()
  const data = useRiderStore((s) => s.cityData())
  const [paid, setPaid] = useState(false)

  const { nextRepayment, repaymentAnalysis, repaymentHistory, currency } = data
  const fmt = (v: number) => formatCurrency(v, currency)
  const reminder = getReminderLevel(nextRepayment.daysUntilDue)
  const rate = repaymentAnalysis.attainmentRate

  const rateColor =
    rate >= 0.9 ? '#10B981' : rate >= 0.7 ? '#F59E0B' : rate >= 0.5 ? '#FB923C' : '#EF4444'

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">Repayment · {data.name}</h1>

      <section
        className="rounded-card p-5 text-white shadow-card"
        style={{ background: `linear-gradient(135deg, ${rateColor}, ${rateColor}cc)` }}
      >
        <p className="text-sm text-white/85">Days until next repayment</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="num-big text-[44px] leading-none">
            {nextRepayment.daysUntilDue}
          </span>
          <span className="text-lg">days</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span>Due {fmt(nextRepayment.amount)}</span>
          <span className="rounded-tag bg-white/20 px-2 py-0.5 text-xs font-semibold">
            {reminder.label} · {Math.round(rate * 100)}% on track
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${rate * 100}%` }}
          />
        </div>
      </section>

      <section className="rounded-card bg-white p-4 shadow-card">
        <p className="mb-3 text-sm font-bold">Attainment analysis</p>
        <div className="space-y-2 text-sm">
          <Row label="Net earned this cycle" value={fmt(repaymentAnalysis.earnedSoFar)} />
          <Row label="Projected net (14-day avg)" value={fmt(repaymentAnalysis.projected)} />
          <Row label="Amount due" value={fmt(repaymentAnalysis.required)} />
          <div className="my-2 border-t border-dashed border-neutral-200" />
          <Row
            label="Projected gap"
            value={`${repaymentAnalysis.gap >= 0 ? '+' : '-'}${fmt(Math.abs(repaymentAnalysis.gap))}`}
            highlight={repaymentAnalysis.gap >= 0 ? 'brand' : 'danger'}
          />
        </div>
        <button
          onClick={() => navigate('/rider/orders')}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-btn bg-brand/10 py-2.5 text-sm font-semibold text-brand-dark"
        >
          <TrendingUp size={15} />
          Tip: enable &quot;Repayment sprint&quot; mode
        </button>
      </section>

      <section className="rounded-card border border-warn/30 bg-warn/10 p-4">
        <div className="flex items-center gap-2">
          <Clock3 size={18} className="text-warn" />
          <p className="text-sm font-bold">
            {nextRepayment.daysUntilDue <= 3 ? '3-day early reminder' : 'Repayment watch period'}
          </p>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-neutral-900">
          {repaymentAnalysis.overtimeSuggestion}
        </p>
      </section>

      <button
        onClick={() => setPaid(true)}
        disabled={paid}
        className={cn(
          'flex w-full items-center justify-center gap-1.5 rounded-btn py-3 font-semibold text-white transition',
          paid ? 'bg-neutral-500' : 'bg-brand active:scale-[0.99]',
        )}
      >
        <CheckCircle2 size={18} />
        {paid ? 'Synced to lender systems' : 'I have repaid'}
      </button>

      <section className="rounded-card bg-white p-4 shadow-card">
        <p className="mb-3 text-sm font-bold">Repayment history (last 12 periods)</p>
        <div className="grid grid-cols-6 gap-2">
          {repaymentHistory.map((h) => {
            const color =
              h.status === 'paid'
                ? 'bg-risk-green/15 text-risk-green'
                : h.status === 'overdue'
                  ? 'bg-risk-red/15 text-risk-red'
                  : 'bg-risk-yellow/15 text-risk-yellow'
            return (
              <div
                key={h.scheduleId}
                className={`flex aspect-square flex-col items-center justify-center rounded-btn text-[10px] font-semibold ${color}`}
              >
                <span className="text-sm">{h.scheduleId.replace('sch_', '')}</span>
                {h.status === 'paid' ? 'Paid' : h.status === 'overdue' ? 'Late' : 'Due'}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: 'brand' | 'danger'
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-neutral-500">{label}</span>
      <span
        className={cn(
          'num-big text-sm',
          highlight === 'brand' && 'text-brand',
          highlight === 'danger' && 'text-danger',
          !highlight && 'text-neutral-900',
        )}
      >
        {value}
      </span>
    </div>
  )
}
