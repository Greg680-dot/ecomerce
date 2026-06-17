import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { SEOHead } from '../../components/ui/SEOHead'
import { Badge } from '../../components/ui/Badge'
import { mockOrders } from '../../data/mockData'
import { formatPrice, formatDate } from '../../utils/formatPrice'
import { ORDER_STATUS_LABELS } from '../../utils/constants'

const statusVariant: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  confirmed: 'primary',
  processing: 'primary',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
  returned: 'default',
}

export default function OrdersPage() {
  const orders = mockOrders

  return (
    <>
      <SEOHead title="Bestellungen" />
      <h2 className="mb-6 text-xl font-semibold text-[var(--text-primary)]">Meine Bestellungen</h2>

      {orders.length === 0 ? (
        <div className="py-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-[var(--text-muted)]" />
          <p className="text-[var(--text-muted)]">Noch keine Bestellungen</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/konto/bestellungen/${order.id}`}
              className="block rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 transition-all hover:border-primary hover:shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{order.orderNumber}</p>
                  <p className="text-sm text-[var(--text-muted)]">{formatDate(order.createdAt)}</p>
                </div>
                <Badge variant={statusVariant[order.status] || 'default'}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-[var(--text-secondary)]">
                  {order.items.length} Artikel
                </p>
                <p className="font-bold text-primary">{formatPrice(order.total)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
