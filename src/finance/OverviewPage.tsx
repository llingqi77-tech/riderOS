import { useState } from 'react'
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
  conversionTrend,
  overviewKpis,
  riskReasonDistribution,
  riskTrend30d,
} from '@/mocks/financeData'
import KpiCard from '@/components/finance/KpiCard'
import { cn } from '@/lib/cn'

const PIE_COLORS = ['#EF4444', '#FB923C', '#F59E0B', '#3B82F6', '#6B7280']
const RANGES = [30, 60, 90]

export default function OverviewPage() {
  const navigate = useNavigate()
  const [range, setRange] = useState(30)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">风险总览</h1>
          <p className="mt-1 text-sm text-neutral-500">
            每日 9:00 自动跑批 · 数据更新于 5 分钟前
          </p>
        </div>
        <div className="flex rounded-btn border border-neutral-200 bg-white p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'rounded-[6px] px-3 py-1.5 text-sm font-medium transition',
                range === r ? 'bg-info text-white' : 'text-neutral-500',
              )}
            >
              {r} 天
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {overviewKpis.map((k) => (
          <KpiCard
            key={k.key}
            label={k.label}
            value={k.value}
            delta={k.delta}
            positive={k.trend === 'up'}
            onClick={() => navigate('/finance/risk-list')}
          />
        ))}
      </div>

      {/* Trend + Pie */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <section className="col-span-2 rounded-card bg-white p-5 shadow-card">
          <p className="mb-4 text-base font-bold">风险人数趋势（{range} 天）</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={riskTrend30d}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={32} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="green" name="健康" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="yellow" name="关注" stroke="#F59E0B" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="orange" name="警告" stroke="#FB923C" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="red" name="危险" stroke="#EF4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-card bg-white p-5 shadow-card">
          <p className="mb-4 text-base font-bold">风险原因分布</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={riskReasonDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={2}
                onClick={() => navigate('/finance/risk-list')}
              >
                {riskReasonDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} cursor="pointer" />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {riskReasonDistribution.map((r, i) => (
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

      {/* Conversion */}
      <section className="rounded-card bg-white p-5 shadow-card">
        <p className="mb-4 text-base font-bold">干预效果趋势（转化率 & ROI）</p>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={conversionTrend}>
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={32} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="rate" name="转化率 %" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="roi" name="ROI (x)" stroke="#3B82F6" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </section>
    </div>
  )
}
