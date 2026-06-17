import { Bell, Package, Tag, Star } from 'lucide-react'
import { SEOHead } from '../../components/ui/SEOHead'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import type { Notification } from '../../types'
import { formatDateTime } from '../../utils/formatPrice'

const mockNotifications: Notification[] = [
  { id: '1', userId: '1', title: 'Bestellung zugestellt', message: 'Ihre Bestellung EM-2026-001234 wurde erfolgreich zugestellt.', type: 'order', isRead: false, link: '/konto/bestellungen/1', createdAt: '2026-05-18T14:30:00' },
  { id: '2', userId: '1', title: 'Sommer-Sale', message: 'Sparen Sie bis zu 40% auf ausgewählte Produkte!', type: 'promotion', isRead: true, link: '/aktionen', createdAt: '2026-06-01T09:00:00' },
  { id: '3', userId: '1', title: 'Neue Bewertung', message: 'Vielen Dank für Ihre Bewertung des Samsung Galaxy S25.', type: 'review', isRead: true, createdAt: '2026-05-20T11:15:00' },
]

const typeIcons = { order: Package, promotion: Tag, system: Bell, review: Star }

export default function NotificationsPage() {
  const notifications = mockNotifications
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <>
      <SEOHead title="Benachrichtigungen" />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Benachrichtigungen</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-[var(--text-muted)]">{unreadCount} ungelesen</p>
          )}
        </div>
        <Button variant="outline" size="sm">Alle als gelesen markieren</Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => {
          const Icon = typeIcons[notif.type]
          return (
            <div
              key={notif.id}
              className={`flex gap-4 rounded-xl border p-4 transition-colors ${
                notif.isRead
                  ? 'border-[var(--border-color)] bg-[var(--card-bg)]'
                  : 'border-primary/30 bg-primary/5'
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[var(--text-primary)]">{notif.title}</p>
                  {!notif.isRead && <Badge variant="primary">Neu</Badge>}
                </div>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{notif.message}</p>
                <p className="mt-2 text-xs text-[var(--text-muted)]">{formatDateTime(notif.createdAt)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
