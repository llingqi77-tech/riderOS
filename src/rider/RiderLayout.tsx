import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Bell,
  Home,
  LayoutList,
  User,
  Wallet,
  Zap,
} from 'lucide-react'
import CitySelector from '@/components/rider/CitySelector'
import { useRiderStore } from '@/store/riderStore'
import { cn } from '@/lib/cn'

const TABS = [
  { to: '/rider/home', label: '首页', icon: Home },
  { to: '/rider/orders', label: '接单', icon: Zap },
  { to: '/rider/income', label: '收入', icon: Wallet },
  { to: '/rider/repayment', label: '还款', icon: LayoutList },
  { to: '/rider/me', label: '我的', icon: User },
]

export default function RiderLayout() {
  const location = useLocation()
  const isMe = location.pathname.endsWith('/me')
  const rider = useRiderStore((s) => s.cityData().rider)

  return (
    <div className="flex h-full flex-col bg-canvas">
      {/* Top AppBar */}
      <header className="flex shrink-0 items-center justify-between px-4 py-3">
        {isMe ? (
          <h1 className="w-full text-center text-lg font-bold">我的</h1>
        ) : (
          <>
            <CitySelector />
            <div className="flex items-center gap-2">
              <img
                src={rider.avatar}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-sm font-semibold">{rider.name.split(' ')[0]}</span>
            </div>
            <button className="relative rounded-full bg-white p-2 shadow-card">
              <Bell size={18} className="text-neutral-500" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
            </button>
          </>
        )}
      </header>

      {/* Scrollable content */}
      <main className="no-scrollbar flex-1 overflow-y-auto px-4 pb-24">
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <nav className="absolute inset-x-0 bottom-0 z-10 flex h-[76px] items-start justify-around border-t border-neutral-200 bg-white/95 px-2 pt-2 backdrop-blur">
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-1 flex-col items-center gap-0.5 pt-1"
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'h-1 w-1 rounded-full transition',
                    isActive ? 'bg-brand' : 'bg-transparent',
                  )}
                />
                <Icon
                  size={22}
                  className={cn(isActive ? 'text-brand' : 'text-neutral-500')}
                  strokeWidth={isActive ? 2.4 : 2}
                />
                <span
                  className={cn(
                    'text-[11px]',
                    isActive ? 'font-semibold text-brand' : 'text-neutral-500',
                  )}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
