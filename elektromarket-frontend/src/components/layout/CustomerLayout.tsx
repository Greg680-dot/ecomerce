import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, User, MapPin, Heart, ShoppingBag, Bell,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { label: 'Übersicht', href: '/konto', icon: LayoutDashboard },
  { label: 'Profil', href: '/konto/profil', icon: User },
  { label: 'Adressen', href: '/konto/adressen', icon: MapPin },
  { label: 'Wunschliste', href: '/konto/wunschliste', icon: Heart },
  { label: 'Bestellungen', href: '/konto/bestellungen', icon: ShoppingBag },
  { label: 'Benachrichtigungen', href: '/konto/benachrichtigungen', icon: Bell },
]

export function CustomerLayout() {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="mb-2 text-3xl font-bold text-[var(--text-primary)]">
        Hallo, {user?.firstName || 'Kunde'}!
      </h1>
      <p className="mb-8 text-[var(--text-muted)]">Verwalten Sie Ihr Konto und Ihre Bestellungen</p>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]',
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
