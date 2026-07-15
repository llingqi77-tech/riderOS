export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export interface RiskMeta {
  label: string
  color: string
  bg: string
  text: string
}

export const RISK_META: Record<string, RiskMeta> = {
  green: { label: 'Healthy', color: '#10B981', bg: 'bg-risk-green/10', text: 'text-risk-green' },
  yellow: { label: 'Watch', color: '#F59E0B', bg: 'bg-risk-yellow/10', text: 'text-risk-yellow' },
  orange: { label: 'Warning', color: '#FB923C', bg: 'bg-risk-orange/10', text: 'text-risk-orange' },
  red: { label: 'Critical', color: '#EF4444', bg: 'bg-risk-red/10', text: 'text-risk-red' },
}

export function getReminderLevel(daysUntilDue: number): {
  level: string
  color: string
  label: string
} {
  if (daysUntilDue > 7) return { level: 'none', color: '#6B7280', label: 'On track' }
  if (daysUntilDue >= 3) return { level: 'observe', color: '#F59E0B', label: 'Watch period' }
  if (daysUntilDue >= 1) return { level: 'urgent', color: '#FB923C', label: 'High priority' }
  if (daysUntilDue === 0) return { level: 'deadline', color: '#EF4444', label: 'Due today' }
  return { level: 'overdue', color: '#EF4444', label: 'Overdue' }
}
