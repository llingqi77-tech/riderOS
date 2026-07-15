import { useState } from 'react'
import { MessageSquare, Phone, Users, X } from 'lucide-react'
import type { Rider } from '@/types'
import { buildPrediction } from '@/mocks/financeData'
import RiskLevelBadge from './RiskLevelBadge'
import { cn } from '@/lib/cn'

const TYPES = [
  { key: 'sms', label: 'SMS', icon: MessageSquare },
  { key: 'call', label: 'Call', icon: Phone },
  { key: 'meeting', label: 'Meeting', icon: Users },
] as const

export default function InterventionModal({
  rider,
  onClose,
}: {
  rider: Rider
  onClose: () => void
}) {
  const prediction = buildPrediction(rider)
  const [type, setType] = useState<'sms' | 'call' | 'meeting'>(
    prediction.recommendedAction.type === 'repossess'
      ? 'meeting'
      : prediction.recommendedAction.type,
  )
  const [sent, setSent] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-card bg-white p-6 shadow-phone">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img src={rider.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
            <div>
              <p className="font-bold">{rider.name}</p>
              <div className="mt-0.5 flex items-center gap-2">
                <RiskLevelBadge level={rider.riskLevel} />
                <span className="text-xs text-neutral-500">
                  Overdue probability {Math.round(rider.riskProbability * 100)}%
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-500">
            <X size={20} />
          </button>
        </div>

        {sent ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <MessageSquare size={22} />
            </div>
            <p className="font-semibold">Intervention sent</p>
            <p className="mt-1 text-sm text-neutral-500">
              {prediction.recommendedAction.expectedImpact}. Impact will appear in Interventions.
            </p>
            <button
              onClick={onClose}
              className="mt-5 rounded-btn bg-brand px-6 py-2 text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="mb-2 text-sm font-semibold">Choose channel</p>
            <div className="mb-4 grid grid-cols-3 gap-2">
              {TYPES.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setType(key)}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-btn border py-3 text-sm transition',
                    type === key
                      ? 'border-info bg-info/10 text-info'
                      : 'border-neutral-200 text-neutral-500',
                  )}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>

            <p className="mb-2 text-sm font-semibold">Suggested script (editable)</p>
            <textarea
              defaultValue={prediction.recommendedAction.template}
              rows={3}
              className="w-full rounded-btn border border-neutral-200 bg-canvas p-3 text-sm outline-none focus:border-info"
            />
            <p className="mt-2 rounded-tag bg-brand/10 px-3 py-2 text-xs text-brand-dark">
              Expected impact: {prediction.recommendedAction.expectedImpact}
            </p>

            <div className="mt-5 flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 rounded-btn border border-neutral-200 py-2.5 text-sm font-medium text-neutral-500"
              >
                Cancel
              </button>
              <button
                onClick={() => setSent(true)}
                className="flex-[2] rounded-btn bg-info py-2.5 text-sm font-semibold text-white"
              >
                Send intervention
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
