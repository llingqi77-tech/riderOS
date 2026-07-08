import type { ReactNode } from 'react'

/** Mobile device frame that hosts the rider app at a 375px baseline. */
export default function PhoneShell({ children }: { children: ReactNode }) {
  const now = new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 py-8">
      <div className="relative h-[812px] w-[375px] overflow-hidden rounded-[44px] border-[10px] border-black bg-black shadow-phone">
        {/* notch */}
        <div className="absolute left-1/2 top-0 z-30 h-6 w-40 -translate-x-1/2 rounded-b-2xl bg-black" />
        {/* status bar */}
        <div className="absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between px-7 pt-1.5 text-[13px] font-semibold text-neutral-900">
          <span>{now}</span>
          <span className="flex items-center gap-1 text-[11px]">
            <span>5G</span>
            <span className="inline-block h-3 w-6 rounded-sm border border-neutral-900/70 px-[2px]">
              <span className="block h-full w-3/4 rounded-[1px] bg-neutral-900" />
            </span>
          </span>
        </div>
        {/* screen */}
        <div className="h-full w-full overflow-hidden rounded-[34px] bg-canvas pt-11">
          {children}
        </div>
      </div>
    </div>
  )
}
