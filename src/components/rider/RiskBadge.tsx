import { RISK_META } from '@/lib/cn'
import type { RiskLevel } from '@/types'

export default function RiskBadge({
  level,
  size = 'md',
}: {
  level: RiskLevel
  size?: 'sm' | 'md'
}) {
  const meta = RISK_META[level]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-tag font-semibold ${meta.bg} ${meta.text} ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {meta.label}
    </span>
  )
}
