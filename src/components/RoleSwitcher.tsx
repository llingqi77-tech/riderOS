import { useLocation, useNavigate } from 'react-router-dom'
import { Bike, Building2 } from 'lucide-react'
import { useRoleStore, type Role } from '@/store/roleStore'
import { cn } from '@/lib/cn'

export default function RoleSwitcher() {
  const navigate = useNavigate()
  const location = useLocation()
  const { role, setRole } = useRoleStore()

  const active: Role = location.pathname.startsWith('/finance') ? 'finance' : 'rider'

  function switchTo(target: Role) {
    setRole(target)
    navigate(target === 'rider' ? '/rider/home' : '/finance/overview')
  }

  return (
    <div className="fixed right-5 top-5 z-50 flex items-center gap-1 rounded-full border border-white/60 bg-white/85 p-1 shadow-phone backdrop-blur">
      <span className="hidden pl-3 pr-1 text-xs font-semibold text-neutral-500 sm:inline">
        Switch role
      </span>
      <button
        onClick={() => switchTo('rider')}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition',
          active === 'rider'
            ? 'bg-[linear-gradient(90deg,rgba(159,137,210,1)_36%,rgba(191,165,230,1)_64%)] text-white shadow'
            : 'text-neutral-500 hover:bg-neutral-50',
        )}
      >
        <Bike size={16} />
        Rider
      </button>
      <button
        onClick={() => switchTo('finance')}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition',
          active === 'finance'
            ? 'bg-[linear-gradient(90deg,rgba(159,137,210,1)_36%,rgba(191,165,230,1)_64%)] text-white shadow'
            : 'text-neutral-500 hover:bg-neutral-50',
        )}
      >
        <Building2 size={16} />
        Finance
      </button>
    </div>
  )
}
