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
  sms: { label: '短信', icon: MessageSquare },
  call: { label: '电话', icon: Phone },
  meeting: { label: '面谈', icon: Users },
  repossess: { label: '收回', icon: Users },
}

const OUTCOME_META: Record<string, { label: string; cls: string }> = {
  recovered: { label: '已挽回', cls: 'bg-risk-green/15 text-risk-green' },
  partial: { label: '部分挽回', cls: 'bg-risk-yellow/15 text-risk-yellow' },
  failed: { label: '失败', cls: 'bg-risk-red/15 text-risk-red' },
}

const effectData = [
  { label: '短信', d7: 58, d14: 66, d30: 71 },
  { label: '电话', d7: 64, d14: 74, d30: 80 },
  { label: '面谈', d7: 72, d14: 82, d30: 88 },
]

export default function InterventionsPage() {
  const navigate = useNavigate()
  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">干预追踪</h1>

      <div className="mb-6 grid grid-cols-4 gap-4">
        {interventionKpis.map((k) => (
          <KpiCard key={k.key} label={k.label} value={k.value} delta={k.delta} />
        ))}
      </div>

      <section className="mb-6 rounded-card bg-white p-5 shadow-card">
        <p className="mb-4 text-base font-bold">干预效果分布（按类型 · 7/14/30 天转化率）</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={effectData}>
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={32} unit="%" />
            <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="d7" name="7 天" fill="#93C5FD" radius={[4, 4, 0, 0]} />
            <Bar dataKey="d14" name="14 天" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="d30" name="30 天" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="rounded-card bg-white p-5 shadow-card">
        <p className="mb-4 text-base font-bold">干预记录</p>
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
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-info/10 text-info">
                  <Icon size={16} />
                </span>
                <div className="w-36 shrink-0">
                  <p className="text-sm font-semibold">{rider?.name}</p>
                  <p className="text-xs text-neutral-500">{meta.label}干预</p>
                </div>
                <p className="min-w-0 flex-1 truncate text-sm text-neutral-500">
                  {it.content}
                </p>
                <div className="w-40 shrink-0 text-right text-xs text-neutral-500">
                  <p>7 天挽回 {formatNGN(it.outcome.response7d?.incomeRecovered ?? 0)}</p>
                  <p>完成 {it.outcome.response7d?.ordersCompleted ?? 0} 单</p>
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
                  查看详情
                </button>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
