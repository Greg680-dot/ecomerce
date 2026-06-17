import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  Zap,
  GitCompare,
  Bell,
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import { DarkModeToggle } from '../ui/DarkModeToggle'
import { SearchBar } from '../product/SearchBar'
import { APP_NAME } from '../../utils/constants'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const itemCount = useCartStore((s) => s.getItemCount())
  const compareCount = useCartStore((s) => s.compareList.length)
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()

  const navLinks = [
    { label: 'Produkte', href: '/produkte' },
    { label: 'Neuheiten', href: '/neuheiten' },
    { label: 'Aktionen', href: '/aktionen' },
    { label: 'Vergleich', href: '/vergleich' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="gradient-primary px-4 py-1.5 text-center text-xs font-medium text-white">
        🚚 Kostenloser Versand ab 49 € · 30 Tage Rückgaberecht · Sichere Zahlung
      </div>

      <div className="border-b border-[var(--border-color)] bg-[var(--header-bg)]">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-[var(--header-text)]">{APP_NAME}</span>
              <span className="block text-[10px] uppercase tracking-widest text-primary">
                Premium Elektronik
              </span>
            </div>
          </Link>

          <div className="hidden flex-1 md:block">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--header-text)]/70 hover:bg-white/10 md:hidden"
            >
              <Search className="h-5 w-5" />
            </button>

            <DarkModeToggle className="text-[var(--header-text)]/70 hover:bg-white/10" />

            <Link
              to="/vergleich"
              className="relative hidden h-9 w-9 items-center justify-center rounded-lg text-[var(--header-text)]/70 hover:bg-white/10 sm:flex"
            >
              <GitCompare className="h-5 w-5" />
              {compareCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {compareCount}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/konto/wunschliste"
                  className="hidden h-9 w-9 items-center justify-center rounded-lg text-[var(--header-text)]/70 hover:bg-white/10 sm:flex"
                >
                  <Heart className="h-5 w-5" />
                </Link>
                <Link
                  to="/konto/benachrichtigungen"
                  className="hidden h-9 w-9 items-center justify-center rounded-lg text-[var(--header-text)]/70 hover:bg-white/10 sm:flex"
                >
                  <Bell className="h-5 w-5" />
                </Link>
              </>
            )}

            <Link
              to="/warenkorb"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--header-text)]/70 hover:bg-white/10"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="group relative">
                <button className="flex h-9 items-center gap-2 rounded-lg px-2 text-[var(--header-text)]/70 hover:bg-white/10">
                  <User className="h-5 w-5" />
                  <span className="hidden text-sm lg:inline">
                    {user?.firstName}
                  </span>
                </button>
                <div className="invisible absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] py-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                  <Link to="/konto" className="block px-4 py-2 text-sm hover:bg-[var(--bg-tertiary)]">
                    Mein Konto
                  </Link>
                  <Link to="/konto/bestellungen" className="block px-4 py-2 text-sm hover:bg-[var(--bg-tertiary)]">
                    Bestellungen
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-[var(--bg-tertiary)]">
                      Admin-Bereich
                    </Link>
                  )}
                  <hr className="my-1 border-[var(--border-color)]" />
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-danger hover:bg-[var(--bg-tertiary)]"
                  >
                    Abmelden
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/anmelden"
                className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-white hover:bg-primary-dark"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Anmelden</span>
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--header-text)]/70 hover:bg-white/10 lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/10 px-4 py-3 md:hidden"
            >
              <SearchBar onSearch={() => setSearchOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        <nav className="hidden border-t border-white/10 lg:block">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2.5 text-sm font-medium text-[var(--header-text)]/80 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-[var(--border-color)] bg-[var(--card-bg)] lg:hidden"
          >
            <nav className="flex flex-col p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-[var(--bg-tertiary)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
