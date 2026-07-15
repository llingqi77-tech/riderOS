import { NavLink, Outlet } from 'react-router-dom'
import {
  Bell,
  GaugeCircle,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Settings,
} from 'lucide-react'
import { currentFinanceUser } from '@/mocks/financeData'
import { cn } from '@/lib/cn'

const MENU = [
  { to: '/finance/overview', label: 'Risk Overview', icon: GaugeCircle },
  { to: '/finance/risk-list', label: 'High-Risk Riders', icon: ShieldAlert },
  { to: '/finance/interventions', label: 'Interventions', icon: Target },
  { to: '/finance/credit-profile', label: 'Credit Profile', icon: TrendingUp },
]

export default function FinanceLayout() {
  return (
    <div className="flex min-h-screen bg-canvas text-neutral-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 flex w-60 flex-col border-r border-neutral-200 bg-white">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-btn bg-brand text-white">
            <Sparkles size={18} />
          </span>
          <div>
            <p className="text-sm font-bold leading-tight">RiderOS</p>
            <p className="text-[11px] text-neutral-500">Risk Console</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {MENU.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-info/10 text-info'
                    : 'text-neutral-500 hover:bg-neutral-50',
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
          <div className="my-2 border-t border-neutral-200" />
          <NavLink
            to="/finance/settings"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-medium transition',
                isActive ? 'bg-info/10 text-info' : 'text-neutral-500 hover:bg-neutral-50',
              )
            }
          >
            <Settings size={18} />
            Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main column */}
      <div className="ml-60 flex min-h-screen flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white/90 px-6 backdrop-blur">
          <div>
            <p className="text-sm font-bold">{currentFinanceUser.company}</p>
          </div>
          <div className="relative ml-4 flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              placeholder="Search rider ID / name"
              className="w-full rounded-btn border border-neutral-200 bg-canvas py-2 pl-9 pr-3 text-sm outline-none focus:border-info"
            />
          </div>
          <button className="relative rounded-full p-2 hover:bg-neutral-50">
            <Bell size={19} className="text-neutral-500" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src={currentFinanceUser.avatar}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="text-right">
              <p className="text-sm font-semibold leading-tight">
                {currentFinanceUser.name}
              </p>
              <p className="text-[11px] text-neutral-500">{currentFinanceUser.role}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
