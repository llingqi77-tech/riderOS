import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildPrediction, riders } from '@/mocks/financeData'
import type { Rider, RiskLevel } from '@/types'
import RiskLevelBadge from '@/components/finance/RiskLevelBadge'
import InterventionModal from '@/components/finance/InterventionModal'
import { RISK_META, cn } from '@/lib/cn'

const LEVELS: RiskLevel[] = ['red', 'orange', 'yellow', 'green']
const CITIES = ['全部', 'Lagos', 'Abuja', 'Kano', 'Ibadan', 'Nairobi', 'Mombasa']
type Sort = 'prob' | 'level' | 'due'

export default function RiskListPage() {
  const navigate = useNavigate()
  const [levelFilter, setLevelFilter] = useState<RiskLevel[]>(['red', 'orange'])
  const [city, setCity] = useState('全部')
  const [sort, setSort] = useState<Sort>('prob')
  const [modalRider, setModalRider] = useState<Rider | null>(null)

  const filtered = useMemo(() => {
    let list = riders.filter(
      (r) =>
        (levelFilter.length === 0 || levelFilter.includes(r.riskLevel)) &&
        (city === '全部' || r.city === city),
    )
    list = [...list].sort((a, b) => {
      if (sort === 'prob') return b.riskProbability - a.riskProbability
      if (sort === 'level') return LEVELS.indexOf(a.riskLevel) - LEVELS.indexOf(b.riskLevel)
      return a.creditScore - b.creditScore
    })
    return list
  }, [levelFilter, city, sort])

  function toggleLevel(l: RiskLevel) {
    setLevelFilter((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l],
    )
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">高风险骑手列表</h1>
      <p className="mb-5 text-sm text-neutral-500">
        共 {filtered.length} 位骑手符合筛选条件
      </p>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-card bg-white p-4 shadow-card">
        <span className="text-sm font-semibold text-neutral-500">风险等级</span>
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => toggleLevel(l)}
            className={cn(
              'rounded-tag px-3 py-1 text-xs font-semibold transition',
              levelFilter.includes(l)
                ? 'text-white'
                : 'bg-neutral-100 text-neutral-500',
            )}
            style={levelFilter.includes(l) ? { backgroundColor: RISK_META[l].color } : {}}
          >
            {RISK_META[l].label}
          </button>
        ))}
        <div className="mx-2 h-5 w-px bg-neutral-200" />
        <span className="text-sm font-semibold text-neutral-500">城市</span>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-btn border border-neutral-200 bg-canvas px-3 py-1.5 text-sm outline-none"
        >
          {CITIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-500">排序</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-btn border border-neutral-200 bg-canvas px-3 py-1.5 text-sm outline-none"
          >
            <option value="prob">逾期概率</option>
            <option value="level">风险等级</option>
            <option value="due">信用分</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((r) => {
          const pred = buildPrediction(r)
          return (
            <div
              key={r.riderId}
              className="flex items-center gap-4 rounded-card bg-white p-4 shadow-card transition hover:shadow-md"
            >
              <img src={r.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div className="w-40 shrink-0">
                <p className="font-semibold">{r.name}</p>
                <p className="text-xs text-neutral-500">
                  {r.riderId} · {r.city}
                </p>
                <div className="mt-1">
                  <RiskLevelBadge level={r.riskLevel} />
                </div>
              </div>

              <div className="w-32 shrink-0">
                <p className="num-big text-xl" style={{ color: RISK_META[r.riskLevel].color }}>
                  {Math.round(r.riskProbability * 100)}%
                </p>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${r.riskProbability * 100}%`,
                      backgroundColor: RISK_META[r.riskLevel].color,
                    }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-neutral-500">逾期概率</p>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-neutral-900">
                  主因：{pred.reasons[0]?.factor}
                </p>
                <p className="mt-0.5 truncate text-xs text-neutral-500">
                  建议：{pred.recommendedAction.template}
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-2">
                <button
                  onClick={() => navigate(`/finance/rider/${r.riderId}`)}
                  className="rounded-btn border border-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-500 hover:bg-neutral-50"
                >
                  查看详情
                </button>
                <button
                  onClick={() => setModalRider(r)}
                  className="rounded-btn bg-info px-4 py-1.5 text-sm font-semibold text-white"
                >
                  立即干预
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {modalRider && (
        <InterventionModal rider={modalRider} onClose={() => setModalRider(null)} />
      )}
    </div>
  )
}
