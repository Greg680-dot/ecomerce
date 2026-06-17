import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  ShoppingBag,
  CreditCard,
  Star,
  Tag,
  BarChart3,
  Settings,
  Warehouse,
  RotateCcw,
  ArrowLeft,
  Zap,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { DarkModeToggle } from '../ui/DarkModeToggle'
import { APP_NAME } from '../../utils/constants'

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Benutzer', href: '/admin/benutzer', icon: Users },
  { label: 'Produkte', href: '/admin/produkte', icon: Package },
  { label: 'Kategorien', href: '/admin/kategorien', icon: FolderTree },
  { label: 'Bestellungen', href: '/admin/bestellungen', icon: ShoppingBag },
  { label: 'Zahlungen', href: '/admin/zahlungen', icon: CreditCard },
  { label: 'Bewertungen', href: '/admin/bewertungen', icon: Star },
  { label: 'Aktionen', href: '/admin/aktionen', icon: Tag },
  { label: 'Analysen', href: '/admin/analysen', icon: BarChart3 },
  { label: 'Lager', href: '/admin/lager', icon: Warehouse },
  { label: 'Retouren', href: '/admin/retouren', icon: RotateCcw },
  { label: 'Einstellungen', href: '/admin/einstellungen', icon: Settings },
]

export function AdminLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-[var(--bg-secondary)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[var(--border-color)] bg-[var(--card-bg)] lg:flex">
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-[var(--text-primary)]">Admin</span>
            <span className="block text-[10px] text-[var(--text-muted)]">{APP_NAME}</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {adminNav.map((item) => {
            const isActive =
              item.href === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-[var(--border-color)] p-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zum Shop
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3 lg:px-6">
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">
            Admin-Bereich
          </h1>
          <DarkModeToggle />
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
