import { useState } from 'react'
import {
  ChevronRight,
  Globe,
  HelpCircle,
  LogOut,
  MapPin,
  Receipt,
  Shield,
  Trash2,
} from 'lucide-react'
import { useRiderStore } from '@/store/riderStore'
import { formatCurrency } from '@/lib/format'
import ExpenseInputSheet from '@/components/rider/ExpenseInputSheet'
import RiskBadge from '@/components/rider/RiskBadge'

export default function MePage() {
  const data = useRiderStore((s) => s.cityData())
  const rider = data.rider
  const extraExpense = useRiderStore((s) => s.extraExpense)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [lang, setLang] = useState<'en' | 'sw-KE'>('en')
  const fmt = (v: number) => formatCurrency(v, data.currency)

  return (
    <div className="space-y-4">
      <section className="hero-lavender">
        <div className="flex items-center gap-3">
          <img
            src={rider.avatar}
            alt=""
            className="h-14 w-14 rounded-full border-2 border-black/20 object-cover"
          />
          <div>
            <p className="text-lg font-bold">{rider.name}</p>
            <p className="text-xs text-[rgba(41,41,41,0.8)]">
              {rider.riderId} · {rider.financeCompany}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-[rgba(41,41,41,0.7)]">
              <MapPin size={11} /> Current city: {data.name}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="num-big text-xl">{rider.creditScore}</p>
            <p className="text-[11px] text-[rgba(41,41,41,0.8)]">Credit score</p>
          </div>
          <div>
            <p className="num-big text-xl">
              {rider.currentPeriod}/{rider.totalPeriods}
            </p>
            <p className="text-[11px] text-[rgba(41,41,41,0.8)]">Periods paid</p>
          </div>
          <div>
            <div className="flex justify-center">
              <RiskBadge level={rider.riskLevel} size="sm" />
            </div>
            <p className="mt-1 text-[11px] text-[rgba(41,41,41,0.8)]">Risk level</p>
          </div>
        </div>
      </section>

      <button
        onClick={() => setSheetOpen(true)}
        className="flex w-full items-center gap-3 rounded-card bg-white p-4 shadow-card"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Receipt size={20} />
        </span>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold">Log expense</p>
          <p className="text-xs text-neutral-500">Logged today {fmt(extraExpense)}</p>
        </div>
        <ChevronRight size={18} className="text-neutral-500" />
      </button>

      <section className="overflow-hidden rounded-card bg-white shadow-card">
        <SettingRow icon={Shield} label="Data & privacy" desc="Permissions" />
        <SettingRow
          icon={Globe}
          label="Language"
          desc={lang === 'en' ? 'English' : 'Kiswahili'}
          onClick={() => setLang((l) => (l === 'en' ? 'sw-KE' : 'en'))}
        />
        <SettingRow icon={Trash2} label="Clear cache" desc="12.4 MB" />
        <SettingRow icon={HelpCircle} label="About / Help" />
      </section>

      <button className="flex w-full items-center justify-center gap-1.5 rounded-card bg-white py-3 text-sm font-semibold text-danger shadow-card">
        <LogOut size={16} />
        Log out
      </button>

      <ExpenseInputSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}

function SettingRow({
  icon: Icon,
  label,
  desc,
  onClick,
}: {
  icon: typeof Shield
  label: string
  desc?: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-neutral-200 px-4 py-3.5 last:border-0"
    >
      <Icon size={18} className="text-neutral-500" />
      <span className="flex-1 text-left text-sm font-medium">{label}</span>
      {desc && <span className="text-xs text-neutral-500">{desc}</span>}
      <ChevronRight size={16} className="text-neutral-200" />
    </button>
  )
}
