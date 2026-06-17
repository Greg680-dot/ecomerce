import { SEOHead } from '../../components/ui/SEOHead'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { Badge } from '../../components/ui/Badge'
import { formatPrice, formatDate } from '../../utils/formatPrice'
import { PAYMENT_STATUS_LABELS } from '../../utils/constants'
import type { Payment } from '../../types'

const mockPayments: Payment[] = [
  { id: '1', orderId: '1', orderNumber: 'EM-2026-001234', amount: 1546.99, method: 'PayPal', status: 'paid', transactionId: 'PP-123456', createdAt: '2026-05-15' },
  { id: '2', orderId: '2', orderNumber: 'EM-2026-001235', amount: 749.99, method: 'Kreditkarte', status: 'paid', transactionId: 'CC-789012', createdAt: '2026-05-20' },
  { id: '3', orderId: '3', orderNumber: 'EM-2026-001236', amount: 379.99, method: 'Klarna', status: 'pending', createdAt: '2026-06-01' },
]

export default function AdminPayments() {
  const columns: Column<Payment>[] = [
    { key: 'orderNumber', header: 'Bestellnr.' },
    { key: 'method', header: 'Methode' },
    { key: 'amount', header: 'Betrag', render: (p) => formatPrice(p.amount) },
    {
      key: 'status', header: 'Status',
      render: (p) => (
        <Badge variant={p.status === 'paid' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'}>
          {PAYMENT_STATUS_LABELS[p.status]}
        </Badge>
      ),
    },
    { key: 'transactionId', header: 'Transaktion', render: (p) => p.transactionId || '—' },
    { key: 'createdAt', header: 'Datum', render: (p) => formatDate(p.createdAt) },
  ]

  return (
    <>
      <SEOHead title="Zahlungen" />
      <h2 className="mb-6 text-2xl font-bold text-[var(--text-primary)]">Zahlungen</h2>
      <DataTable columns={columns} data={mockPayments} keyExtractor={(p) => p.id} />
    </>
  )
}
