import { Bike, Clock, MapPin } from 'lucide-react'
import type { Order } from '@/types'
import { PLATFORM_LABEL } from '@/mocks/riderData'
import type { CityCurrency } from '@/mocks/cities'
import { formatCurrency } from '@/lib/format'

const PLATFORM_COLOR: Record<string, string> = {
  chowdeck: 'bg-emerald-100 text-emerald-700',
  glovo: 'bg-yellow-100 text-yellow-700',
  bolt_food: 'bg-green-100 text-green-700',
  uber_eats: 'bg-neutral-900 text-white',
}

export default function OrderCard({
  order,
  index,
  currency = 'NGN',
  onAccept,
  onSkip,
}: {
  order: Order
  index: number
  currency?: CityCurrency
  onAccept: () => void
  onSkip: () => void
}) {
  const fmt = (v: number) => formatCurrency(v, currency)
  return (
    <div className="rounded-card border border-neutral-200 bg-white p-3">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-tag px-1.5 py-0.5 text-[10px] font-semibold ${
                PLATFORM_COLOR[order.platform] ?? 'bg-neutral-100'
              }`}
            >
              {PLATFORM_LABEL[order.platform]}
            </span>
            <span className="truncate text-sm font-semibold">
              {order.merchantName}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-3 text-xs text-neutral-500">
            <span className="flex items-center gap-0.5">
              <MapPin size={12} /> {order.distance} km
            </span>
            <span className="flex items-center gap-0.5">
              <Clock size={12} /> {order.estimatedDuration} min
            </span>
            <span className="flex items-center gap-0.5">
              <Bike size={12} /> Ready in {order.pickupEta} min
            </span>
          </div>
        </div>
        <span className="num-big shrink-0 text-base text-brand-dark">
          {fmt(order.estimatedEarnings)}
        </span>
      </div>

      <p className="mt-2 rounded-tag bg-canvas px-2 py-1 text-[11px] text-neutral-500">
        Opportunity cost: skipping may cost ~{fmt(Math.round(order.estimatedEarnings * 0.85))}
      </p>

      <div className="mt-2.5 flex gap-2">
        <button
          onClick={onSkip}
          className="flex-1 rounded-btn border border-neutral-200 py-1.5 text-sm font-medium text-neutral-500"
        >
          Skip
        </button>
        <button
          onClick={onAccept}
          className="flex-[2] rounded-btn bg-accent py-1.5 text-sm font-semibold text-neutral-900 active:scale-[0.99]"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
