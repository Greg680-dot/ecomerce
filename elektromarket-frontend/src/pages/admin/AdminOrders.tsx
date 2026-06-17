import { SEOHead } from '../../components/ui/SEOHead'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { Badge } from '../../components/ui/Badge'
import { mockOrders } from '../../data/mockData'
import { formatPrice, formatDate } from '../../utils/formatPrice'
import { ORDER_STATUS_LABELS } from '../../utils/constants'
import type { Order } from '../../types'

const statusVariant: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning', confirmed: 'primary', processing: 'primary',
  shipped: 'primary', delivered: 'success', cancelled: 'danger',
}

export default function AdminOrders() {
  const columns: Column<Order>[] = [
    { key: 'orderNumber', header: 'Bestellnr.' },
    { key: 'createdAt', header: 'Datum', render: (o) => formatDate(o.createdAt) },
    { key: 'items', header: 'Artikel', render: (o) => o.items.length },
    { key: 'total', header: 'Gesamt', render: (o) => formatPrice(o.total) },
    {
      key: 'status', header: 'Status',
      render: (o) => <Badge variant={statusVariant[o.status]}>{ORDER_STATUS_LABELS[o.status]}</Badge>,
    },
    {
      key: 'paymentStatus', header: 'Zahlung',
      render: (o) => <Badge variant={o.paymentStatus === 'paid' ? 'success' : 'warning'}>{o.paymentStatus}</Badge>,
    },
  ]

  return (
    <>
      <SEOHead title="Bestellungen verwalten" />
      <h2 className="mb-6 text-2xl font-bold text-[var(--text-primary)]">Bestellungen</h2>
      <DataTable columns={columns} data={mockOrders} keyExtractor={(o) => o.id} />
    </>
  )
}
