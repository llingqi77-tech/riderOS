import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bar,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  getOverviewByRange,
  type OverviewRange,
} from '@/mocks/financeData'
import KpiCard from '@/components/finance/KpiCard'
import { cn } from '@/lib/cn'

const PIE_COLORS = ['#EF4444', '#FB923C', '#F59E0B', '#9B8AFB', '#6B7280']
const RANGES: OverviewRange[] = [30, 60, 90]

export default function OverviewPage() {
  const navigate = useNavigate()
  const [range, setRange] = useState<OverviewRange>(30)

  const { kpis, riskTrend, riskReasons, conversionTrend } = useMemo(
    () => getOverviewByRange(range),
    [range],
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Risk Overview</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Daily batch at 9:00 · showing last {range} days
          </p>
        </div>
        <div className="flex rounded-btn border border-neutral-200 bg-white p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'rounded-[6px] px-3 py-1.5 text-sm font-medium transition',
                range === r
                  ? 'bg-[linear-gradient(90deg,rgba(159,137,210,1)_36%,rgba(191,165,230,1)_64%)] text-white'
                  : 'text-neutral-500',
              )}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        {kpis.map((k) => (
          <KpiCard
            key={k.key}
            label={`${k.label} (${range}d)`}
            value={k.value}
            delta={k.delta}
            positive={k.trend === 'up'}
            onClick={() => navigate('/finance/risk-list')}
          />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <section className="col-span-2 rounded-card bg-white p-5 shadow-card">
          <p className="mb-4 text-base font-bold">Risk headcount trend ({range}d)</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={riskTrend}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
                interval={range === 30 ? 4 : range === 60 ? 9 : 14}
              />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={32} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="green" name="Healthy" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="yellow" name="Watch" stroke="#F59E0B" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="orange" name="Warning" stroke="#FB923C" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="red" name="Critical" stroke="#EF4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-card bg-white p-5 shadow-card">
          <p className="mb-4 text-base font-bold">Risk reason mix ({range}d)</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={riskReasons}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={2}
                onClick={() => navigate('/finance/risk-list')}
              >
                {riskReasons.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} cursor="pointer" />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {riskReasons.map((r, i) => (
              <div key={r.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  {r.name}
                </span>
                <span className="font-semibold">{r.value}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-card bg-white p-5 shadow-card">
        <p className="mb-4 text-base font-bold">
          Intervention impact (last {conversionTrend.length} weeks · conversion & ROI)
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={conversionTrend}>
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={32} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="rate" name="Conversion %" fill="#9B8AFB" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="roi" name="ROI (x)" stroke="#6E5FD4" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </section>
    </div>
  )
}
