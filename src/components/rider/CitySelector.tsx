import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, MapPin } from 'lucide-react'
import { CITY_LIST, useRiderStore } from '@/store/riderStore'
import type { CityId } from '@/mocks/cities'
import { cn } from '@/lib/cn'

export default function CitySelector() {
  const city = useRiderStore((s) => s.city)
  const setCity = useRiderStore((s) => s.setCity)
  const cityData = useRiderStore((s) => s.cityData())
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  function select(id: CityId) {
    setCity(id)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1 rounded-btn bg-white px-2.5 py-1.5 text-sm font-medium shadow-card transition',
          open && 'ring-2 ring-brand/30',
        )}
      >
        <MapPin size={13} className="text-brand" />
        {cityData.name}
        <ChevronDown
          size={14}
          className={cn('text-neutral-500 transition', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-card border border-neutral-200 bg-white shadow-phone">
          <p className="border-b border-neutral-200 px-3 py-2 text-[11px] font-semibold text-neutral-500">
            Switch work city
          </p>
          {CITY_LIST.map((c) => {
            const active = c.id === city
            return (
              <button
                key={c.id}
                onClick={() => select(c.id)}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition hover:bg-canvas',
                  active && 'bg-brand/5',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                    active ? 'bg-brand text-white' : 'bg-neutral-100 text-neutral-500',
                  )}
                >
                  {c.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{c.name}</span>
                  <span className="text-[11px] text-neutral-500">{c.country}</span>
                </span>
                {active && <Check size={15} className="text-brand" />}
              </button>
            )
          })}
          <p className="border-t border-neutral-200 px-3 py-2 text-[10px] text-neutral-500">
            Orders, income, and repayment data refresh after switching
          </p>
        </div>
      )}
    </div>
  )
}
