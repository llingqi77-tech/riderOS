import type { CityCurrency } from '@/mocks/cities'

const formatters: Record<CityCurrency, Intl.NumberFormat> = {
  NGN: new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }),
  KES: new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }),
}

const ngn = formatters.NGN
const ngnCompact = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 })

/** Format by currency code, e.g. ₦6,500 or KSh 4,200 */
export function formatCurrency(value: number, currency: CityCurrency = 'NGN'): string {
  return formatters[currency].format(value)
}

/** Format a number as Nigerian Naira, e.g. ₦6,500 */
export function formatNGN(value: number): string {
  return ngn.format(value)
}

/** Number with thousands separators (no currency symbol) */
export function formatNumber(value: number): string {
  return ngnCompact.format(value)
}

/** 0-1 -> "78%" */
export function formatPercent(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits)}%`
}

const timeFmt = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function formatTime(iso: string): string {
  return timeFmt.format(new Date(iso))
}
