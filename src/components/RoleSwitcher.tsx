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
        角色切换
      </span>
      <button
        onClick={() => switchTo('rider')}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition',
          active === 'rider'
            ? 'bg-brand text-white shadow'
            : 'text-neutral-500 hover:bg-neutral-50',
        )}
      >
        <Bike size={16} />
        骑手端
      </button>
      <button
        onClick={() => switchTo('finance')}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition',
          active === 'finance'
            ? 'bg-info text-white shadow'
            : 'text-neutral-500 hover:bg-neutral-50',
        )}
      >
        <Building2 size={16} />
        金融端
      </button>
    </div>
  )
}
