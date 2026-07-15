import { useNavigate } from 'react-router-dom'
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { MessageSquare, Phone, Users } from 'lucide-react'
import {
  interventionKpis,
  interventions,
  ridersById,
} from '@/mocks/financeData'
import KpiCard from '@/components/finance/KpiCard'
import { formatNGN } from '@/lib/format'
import { cn } from '@/lib/cn'

const TYPE_META: Record<string, { label: string; icon: typeof Phone }> = {
  sms: { label: 'SMS', icon: MessageSquare },
  call: { label: 'Call', icon: Phone },
  meeting: { label: 'Meeting', icon: Users },
  repossess: { label: 'Repossess', icon: Users },
}

const OUTCOME_META: Record<string, { label: string; cls: string }> = {
  recovered: { label: 'Recovered', cls: 'bg-risk-green/15 text-risk-green' },
  partial: { label: 'Partial', cls: 'bg-risk-yellow/15 text-risk-yellow' },
  failed: { label: 'Failed', cls: 'bg-risk-red/15 text-risk-red' },
}

const effectData = [
  { label: 'SMS', d7: 58, d14: 66, d30: 71 },
  { label: 'Call', d7: 64, d14: 74, d30: 80 },
  { label: 'Meeting', d7: 72, d14: 82, d30: 88 },
]

export default function InterventionsPage() {
  const navigate = useNavigate()
  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Interventions</h1>

      <div className="mb-6 grid grid-cols-4 gap-4">
        {interventionKpis.map((k) => (
          <KpiCard key={k.key} label={k.label} value={k.value} delta={k.delta} />
        ))}
      </div>

      <section className="mb-6 rounded-card bg-white p-5 shadow-card">
        <p className="mb-4 text-base font-bold">Impact by channel · 7/14/30-day conversion</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={effectData}>
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={32} unit="%" />
            <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="d7" name="7d" fill="#B8ADFC" radius={[4, 4, 0, 0]} />
            <Bar dataKey="d14" name="14d" fill="#9B8AFB" radius={[4, 4, 0, 0]} />
            <Bar dataKey="d30" name="30d" fill="#6E5FD4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="rounded-card bg-white p-5 shadow-card">
        <p className="mb-4 text-base font-bold">Intervention log</p>
        <div className="space-y-2">
          {interventions.map((it) => {
            const rider = ridersById[it.riderId]
            const meta = TYPE_META[it.type]
            const outcome = OUTCOME_META[it.outcome.finalOutcome ?? 'partial']
            const Icon = meta.icon
            return (
              <div
                key={it.interventionId}
                className="flex items-center gap-4 rounded-btn border border-neutral-200 p-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand-dark">
                  <Icon size={16} />
                </span>
                <div className="w-36 shrink-0">
                  <p className="text-sm font-semibold">{rider?.name}</p>
                  <p className="text-xs text-neutral-500">{meta.label}</p>
                </div>
                <p className="min-w-0 flex-1 truncate text-sm text-neutral-500">
                  {it.content}
                </p>
                <div className="w-40 shrink-0 text-right text-xs text-neutral-500">
                  <p>7d recovered {formatNGN(it.outcome.response7d?.incomeRecovered ?? 0)}</p>
                  <p>{it.outcome.response7d?.ordersCompleted ?? 0} orders completed</p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-tag px-2.5 py-1 text-xs font-semibold',
                    outcome.cls,
                  )}
                >
                  {outcome.label}
                </span>
                <button
                  onClick={() => navigate(`/finance/rider/${it.riderId}`)}
                  className="shrink-0 rounded-btn border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 hover:bg-neutral-50"
                >
                  View details
                </button>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
