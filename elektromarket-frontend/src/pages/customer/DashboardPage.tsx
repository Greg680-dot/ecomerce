import { Link } from 'react-router-dom'
import { SEOHead } from '../../components/ui/SEOHead'
import { useAuthStore } from '../../store/authStore'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  const stats = [
    { label: 'Bestellungen', value: '3', href: '/konto/bestellungen' },
    { label: 'Wunschliste', value: '5', href: '/konto/wunschliste' },
    { label: 'Adressen', value: '2', href: '/konto/adressen' },
    { label: 'Benachrichtigungen', value: '1', href: '/konto/benachrichtigungen' },
  ]

  return (
    <>
      <SEOHead title="Mein Konto" />
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.href}
              className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 transition-all hover:border-primary hover:shadow-[var(--shadow-card)]"
            >
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
            </Link>
          ))}
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
          <h2 className="mb-4 text-lg font-semibold">Kontoinformationen</h2>
          <dl className="grid gap-3 sm:grid-cols-2 text-sm">
            <div><dt className="text-[var(--text-muted)]">Name</dt><dd className="font-medium">{user?.firstName} {user?.lastName}</dd></div>
            <div><dt className="text-[var(--text-muted)]">E-Mail</dt><dd className="font-medium">{user?.email}</dd></div>
            <div><dt className="text-[var(--text-muted)]">Status</dt><dd className="font-medium">{user?.isVerified ? 'Verifiziert' : 'Nicht verifiziert'}</dd></div>
          </dl>
        </div>
      </div>
    </>
  )
}
