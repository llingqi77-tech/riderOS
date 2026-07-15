import { useState } from 'react'
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { useRiderStore } from '@/store/riderStore'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/cn'
import AIInsightCard from '@/components/rider/AIInsightCard'

type Range = 'today' | 'week' | 'month'
const RANGES: { key: Range; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
]

const PIE_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#FB923C', '#6B7280']

export default function IncomePage() {
  const data = useRiderStore((s) => s.cityData())
  const [range, setRange] = useState<Range>('today')
  const summary = data.incomeSummary[range]
  const trend = data.incomeTrend[range]
  const delta = summary.net - summary.prev
  const targetPct = Math.round((summary.net / summary.target) * 100)
  const fmt = (v: number) => formatCurrency(v, data.currency)

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">Net income · {data.name}</h1>

      <div className="flex rounded-btn bg-neutral-200/60 p-1">
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={cn(
              'flex-1 rounded-[6px] py-1.5 text-sm font-medium transition',
              range === r.key ? 'bg-white text-brand shadow-card' : 'text-neutral-500',
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      <section className="rounded-card bg-white p-5 shadow-card">
        <p className="text-sm text-neutral-500">Current net income</p>
        <p className="num-big mt-1 text-[40px] leading-none text-neutral-900">
          {fmt(summary.net)}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <p
              className={cn(
                'flex items-center justify-center gap-0.5 text-sm font-semibold',
                delta >= 0 ? 'text-brand' : 'text-danger',
              )}
            >
              {delta >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {fmt(Math.abs(delta))}
            </p>
            <p className="text-[11px] text-neutral-500">vs prior period</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">{targetPct}%</p>
            <p className="text-[11px] text-neutral-500">Target progress</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">{fmt(summary.best)}</p>
            <p className="text-[11px] text-neutral-500">All-time best</p>
          </div>
        </div>
      </section>

      <section className="rounded-card bg-white p-4 shadow-card">
        <p className="mb-2 text-sm font-bold">Income & expense trend</p>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={trend} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
            <defs>
              <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v: number) => fmt(v)}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#inc)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#EF4444"
              strokeWidth={2}
              fill="url(#exp)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-card bg-white p-3 shadow-card">
          <p className="mb-1 text-xs font-bold">Income sources</p>
          <ResponsiveContainer width="100%" height={110}>
            <PieChart>
              <Pie
                data={data.incomeBreakdown.sources}
                dataKey="value"
                innerRadius={28}
                outerRadius={45}
                paddingAngle={2}
              >
                {data.incomeBreakdown.sources.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-card bg-white p-3 shadow-card">
          <p className="mb-1 text-xs font-bold">Expense mix</p>
          <ResponsiveContainer width="100%" height={110}>
            <PieChart>
              <Pie
                data={data.incomeBreakdown.expenses.filter((e) => e.value > 0)}
                dataKey="value"
                innerRadius={28}
                outerRadius={45}
                paddingAngle={2}
              >
                {data.incomeBreakdown.expenses.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-card bg-white p-4 shadow-card">
        <p className="mb-2 text-sm font-bold">Transactions</p>
        <ul className="divide-y divide-neutral-200">
          {data.incomeRecords.map((r) => (
            <li key={r.recordId} className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm font-medium">
                  {r.type === 'order' ? r.platform : `Expense · ${r.note ?? ''}`}
                </p>
                <p className="text-[11px] text-neutral-500">
                  {new Date(r.timestamp).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {r.note && r.type === 'order' ? ` · ${r.note}` : ''}
                </p>
              </div>
              <span
                className={cn(
                  'num-big text-sm',
                  r.type === 'order' ? 'text-brand' : 'text-danger',
                )}
              >
                {r.type === 'order' ? '+' : '-'}
                {fmt(r.amount)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <AIInsightCard text={data.todaySnapshot.aiInsight} />
    </div>
  )
}
