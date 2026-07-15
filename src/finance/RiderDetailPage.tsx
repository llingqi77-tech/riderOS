import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowLeft, FileDown } from 'lucide-react'
import {
  buildPrediction,
  buildRiderDetail,
  ridersById,
} from '@/mocks/financeData'
import { formatNGN, formatPercent } from '@/lib/format'
import { RISK_META, cn } from '@/lib/cn'
import RiskLevelBadge from '@/components/finance/RiskLevelBadge'
import InterventionModal from '@/components/finance/InterventionModal'

const TABS = ['Income & repayment', 'Risk forecast', 'Risk drivers'] as const
type Tab = (typeof TABS)[number]

export default function RiderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const rider = id ? ridersById[id] : undefined
  const [tab, setTab] = useState<Tab>('Income & repayment')
  const [modal, setModal] = useState(false)

  if (!rider) {
    return (
      <div className="rounded-card bg-white p-10 text-center text-neutral-500 shadow-card">
        Rider not found
      </div>
    )
  }

  const detail = buildRiderDetail(rider)
  const pred = buildPrediction(rider)

  const probBars = [
    { label: '7d', value: Math.round(pred.overdueProbability7d * 100) },
    { label: '14d', value: Math.round(pred.overdueProbability14d * 100) },
    { label: '30d', value: Math.round(pred.overdueProbability30d * 100) },
  ]

  return (
    <div>
      <button
        onClick={() => navigate('/finance/risk-list')}
        className="mb-4 flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft size={15} /> Back to list
      </button>

      {/* Header */}
      <section className="mb-5 flex items-center gap-4 rounded-card bg-white p-5 shadow-card">
        <img src={rider.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">{rider.name}</h1>
            <RiskLevelBadge level={rider.riskLevel} large />
            <span className="num-big text-lg" style={{ color: RISK_META[rider.riskLevel].color }}>
              {Math.round(rider.riskProbability * 100)}%
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-500">
            {rider.riderId} · {rider.city} · {rider.financeCompany} · Credit score{' '}
            <span className="font-semibold text-neutral-900">{rider.creditScore}</span>
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-btn border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-500">
          <FileDown size={15} /> Export PDF
        </button>
        <button
          onClick={() => setModal(true)}
          className="rounded-btn bg-info px-5 py-2 text-sm font-semibold text-white"
        >
          Intervene now
        </button>
      </section>

      {/* KPI */}
      <div className="mb-5 grid grid-cols-4 gap-4">
        <MiniKpi label="30d avg daily net" value={formatNGN(detail.avgDailyNet)} />
        <MiniKpi label="Current DPD" value={`${detail.dpd} days`} />
        <MiniKpi label="Days until due" value={`${detail.daysUntilDue} days`} />
        <MiniKpi label="Historical on-time rate" value={formatPercent(detail.onTimeRate)} />
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 border-b border-neutral-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'border-b-2 px-4 py-2.5 text-sm font-medium transition',
              tab === t
                ? 'border-info text-info'
                : 'border-transparent text-neutral-500 hover:text-neutral-900',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'Income & repayment' && (
        <div className="grid grid-cols-3 gap-4">
          <section className="col-span-2 rounded-card bg-white p-5 shadow-card">
            <p className="mb-4 text-base font-bold">30d avg daily net</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={detail.trend}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip formatter={(v: number) => formatNGN(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="net" name="Net income" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </section>
          <section className="rounded-card bg-white p-5 shadow-card">
            <p className="mb-4 text-base font-bold">12-period repayment history</p>
            <div className="grid grid-cols-4 gap-2">
              {detail.repayHistory.map((h) => (
                <div
                  key={h.period}
                  className={cn(
                    'flex aspect-square flex-col items-center justify-center rounded-btn text-xs font-semibold',
                    h.status === 'paid'
                      ? 'bg-risk-green/15 text-risk-green'
                      : 'bg-risk-red/15 text-risk-red',
                  )}
                >
                  <span className="text-sm">{h.period}</span>
                  {h.status === 'paid' ? 'Paid' : 'Late'}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === 'Risk forecast' && (
        <section className="rounded-card bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-base font-bold">Overdue probability forecast</p>
            <p className="text-xs text-neutral-500">
              Model updated {new Date(pred.predictedAt).toLocaleString('en-GB')}
            </p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={probBars}>
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={32} unit="%" />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="value" name="Overdue probability" radius={[6, 6, 0, 0]}>
                {probBars.map((_, i) => (
                  <Cell key={i} fill={RISK_META[rider.riskLevel].color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-3 rounded-tag bg-canvas px-3 py-2 text-xs text-neutral-500">
            Thresholds: ≥70% Critical (red), 45–70% Warning (orange), 25–45% Watch (yellow).
          </p>
        </section>
      )}

      {tab === 'Risk drivers' && (
        <section className="rounded-card bg-white p-5 shadow-card">
          <p className="mb-4 text-base font-bold">Risk driver analysis (SHAP contribution)</p>
          <div className="space-y-4">
            {pred.reasons.map((r) => (
              <div key={r.factor}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{r.factor}</span>
                  <span className="num-big text-info">
                    {formatPercent(r.contribution)}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-info"
                    style={{ width: `${r.contribution * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-neutral-500">{r.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {modal && <InterventionModal rider={rider} onClose={() => setModal(false)} />}
    </div>
  )
}

function MiniKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card bg-white p-4 shadow-card">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="num-big mt-1.5 text-2xl text-neutral-900">{value}</p>
    </div>
  )
}
