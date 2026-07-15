import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'

export default function KpiCard({
  label,
  value,
  delta,
  positive = true,
  onClick,
}: {
  label: string
  value: string | number
  delta?: string
  positive?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'hero-lavender text-left transition',
        onClick && 'hover:-translate-y-0.5 hover:shadow-md',
      )}
    >
      <p className="text-sm text-[rgba(41,41,41,0.8)]">{label}</p>
      <p className="num-big mt-2 text-3xl">{value}</p>
      {delta && (
        <p
          className={cn(
            'mt-1.5 flex items-center gap-0.5 text-xs font-semibold',
            positive ? 'text-white/85' : 'text-danger',
          )}
        >
          {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {delta} vs last month
        </p>
      )}
    </button>
  )
}
