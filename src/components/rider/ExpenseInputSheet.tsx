import { useEffect, useState } from 'react'
import {
  BatteryCharging,
  Fuel,
  Mic,
  UtensilsCrossed,
  Wrench,
  X,
} from 'lucide-react'
import type { ExpenseCategory } from '@/types'
import { useRiderStore } from '@/store/riderStore'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { parseSpeechAmount } from '@/lib/parseSpeechAmount'
import { cn } from '@/lib/cn'

const CATS: { key: ExpenseCategory; label: string; icon: typeof Fuel }[] = [
  { key: 'fuel', label: 'Fuel', icon: Fuel },
  { key: 'electricity', label: 'Battery', icon: BatteryCharging },
  { key: 'food', label: 'Food', icon: UtensilsCrossed },
  { key: 'maintenance', label: 'Repair', icon: Wrench },
]

export default function ExpenseInputSheet({
  open,
  initialCategory,
  onClose,
}: {
  open: boolean
  initialCategory?: ExpenseCategory
  onClose: () => void
}) {
  const addExpense = useRiderStore((s) => s.addExpense)
  const [category, setCategory] = useState<ExpenseCategory>(
    initialCategory ?? 'fuel',
  )
  const [amountText, setAmountText] = useState('')
  const [focused, setFocused] = useState(false)
  const [voiceHint, setVoiceHint] = useState<string | null>(null)

  const { listening, supported, toggle, stop } = useSpeechRecognition({
    onResult: (transcript) => {
      setVoiceHint(transcript)
      const parsed = parseSpeechAmount(transcript)
      if (parsed) setAmountText(String(parsed))
    },
  })

  useEffect(() => {
    if (!open) return
    setCategory(initialCategory ?? 'fuel')
    setAmountText('')
    setFocused(false)
    setVoiceHint(null)
    stop()
  }, [open, initialCategory, stop])

  if (!open) return null

  const amount = Number(amountText) || 0
  const displayValue = focused
    ? amountText
    : amountText
      ? Number(amountText).toLocaleString()
      : ''

  function submit() {
    if (amount > 0) addExpense(category, amount)
    setAmountText('')
    setVoiceHint(null)
    stop()
    onClose()
  }

  function handleClose() {
    stop()
    onClose()
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative z-10 rounded-t-3xl bg-white p-5 pb-8 shadow-phone">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold">Log an expense</h3>
          <button onClick={handleClose} className="text-neutral-500">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-4 gap-2">
          {CATS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-btn border py-3 text-xs transition',
                category === key
                  ? 'border-brand bg-brand/10 text-brand-dark'
                  : 'border-neutral-200 text-neutral-500',
              )}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>

        <div className="mb-3 rounded-btn bg-canvas p-4 text-center">
          <span className="text-sm text-neutral-500">₦ </span>
          <input
            type="text"
            inputMode="numeric"
            value={displayValue}
            placeholder="0"
            onChange={(e) => {
              setAmountText(e.target.value.replace(/[^\d]/g, ''))
              setVoiceHint(null)
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="num-big w-36 bg-transparent text-center text-3xl outline-none placeholder:text-neutral-300"
          />
        </div>

        <button
          type="button"
          onClick={toggle}
          disabled={!supported}
          className={cn(
            'mb-5 flex w-full items-center justify-center gap-2 rounded-btn py-3 text-sm font-medium transition',
            listening
              ? 'bg-brand/15 text-brand-dark ring-2 ring-brand'
              : 'bg-canvas hover:bg-neutral-200',
            !supported && 'cursor-not-allowed opacity-50',
          )}
        >
          <Mic size={20} className={cn(listening && 'animate-pulse')} />
          {listening
            ? 'Listening… tap to stop'
            : supported
              ? 'Voice enter amount'
              : 'Speech not supported in this browser'}
        </button>

        {voiceHint && (
          <p className="mb-4 -mt-3 text-center text-xs text-neutral-400">
            Heard: {voiceHint}
          </p>
        )}

        <button
          onClick={submit}
          className="w-full rounded-btn bg-brand py-3 font-semibold text-white active:scale-[0.99]"
        >
          Confirm
        </button>
      </div>
    </div>
  )
}
