import { SEOHead } from '../../components/ui/SEOHead'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { formatDate } from '../../utils/formatPrice'
import type { ReturnRequest } from '../../types'

const mockReturns: ReturnRequest[] = [
  {
    id: '1', orderId: '2', orderNumber: 'EM-2026-001235', reason: 'Produkt entspricht nicht der Beschreibung',
    status: 'pending',
    items: [{ id: '1', productId: '4', productName: 'PlayStation 5 Pro', productImage: '', quantity: 1, price: 749.99, total: 749.99 }],
    createdAt: '2026-06-02',
  },
  {
    id: '2', orderId: '3', orderNumber: 'EM-2026-001230', reason: 'Defektes Gerät',
    status: 'approved',
    items: [{ id: '2', productId: '6', productName: 'Bose QuietComfort Ultra', productImage: '', quantity: 1, price: 379.99, total: 379.99 }],
    createdAt: '2026-05-28',
  },
]

const statusLabels: Record<string, string> = {
  pending: 'Ausstehend', approved: 'Genehmigt', rejected: 'Abgelehnt', completed: 'Abgeschlossen',
}

const statusVariant: Record<string, 'warning' | 'success' | 'danger' | 'primary'> = {
  pending: 'warning', approved: 'primary', rejected: 'danger', completed: 'success',
}

export default function AdminReturns() {
  const columns: Column<ReturnRequest>[] = [
    { key: 'orderNumber', header: 'Bestellnr.' },
    { key: 'reason', header: 'Grund', className: 'max-w-xs truncate' },
    { key: 'items', header: 'Artikel', render: (r) => r.items.length },
    {
      key: 'status', header: 'Status',
      render: (r) => <Badge variant={statusVariant[r.status]}>{statusLabels[r.status]}</Badge>,
    },
    { key: 'createdAt', header: 'Datum', render: (r) => formatDate(r.createdAt) },
    {
      key: 'actions', header: '',
      render: (r) => r.status === 'pending' ? (
        <div className="flex gap-1">
          <Button size="sm" variant="outline">Genehmigen</Button>
          <Button size="sm" variant="danger">Ablehnen</Button>
        </div>
      ) : null,
    },
  ]

  return (
    <>
      <SEOHead title="Retouren" />
      <h2 className="mb-6 text-2xl font-bold text-[var(--text-primary)]">Retouren</h2>
      <DataTable columns={columns} data={mockReturns} keyExtractor={(r) => r.id} />
    </>
  )
}
