import { RISK_META } from '@/lib/cn'
import type { RiskLevel } from '@/types'

export default function RiskLevelBadge({
  level,
  large = false,
}: {
  level: RiskLevel
  large?: boolean
}) {
  const meta = RISK_META[level]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-tag font-semibold text-white"
      style={{
        backgroundColor: meta.color,
        padding: large ? '6px 14px' : '3px 9px',
        fontSize: large ? 14 : 12,
      }}
    >
      {meta.label}
    </span>
  )
}
