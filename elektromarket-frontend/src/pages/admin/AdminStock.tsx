import { AlertTriangle } from 'lucide-react'
import { SEOHead } from '../../components/ui/SEOHead'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { mockProducts } from '../../data/mockData'
import { formatDate } from '../../utils/formatPrice'
import type { StockItem } from '../../types'

const stockData: StockItem[] = mockProducts.map((p) => ({
  id: p.id,
  productId: p.id,
  productName: p.name,
  sku: p.sku,
  quantity: p.stock + 5,
  reserved: Math.min(5, p.stock),
  available: p.stock,
  lowStockThreshold: 10,
  lastUpdated: p.updatedAt,
}))

export default function AdminStock() {
  const columns: Column<StockItem>[] = [
    { key: 'productName', header: 'Produkt' },
    { key: 'sku', header: 'SKU' },
    { key: 'quantity', header: 'Gesamt' },
    { key: 'reserved', header: 'Reserviert' },
    {
      key: 'available', header: 'Verfügbar',
      render: (s) => (
        <Badge variant={s.available > s.lowStockThreshold ? 'success' : s.available > 0 ? 'warning' : 'danger'}>
          {s.available}
        </Badge>
      ),
    },
    {
      key: 'status', header: 'Status',
      render: (s) => s.available <= s.lowStockThreshold ? (
        <span className="flex items-center gap-1 text-xs text-warning">
          <AlertTriangle className="h-3 w-3" /> Niedrig
        </span>
      ) : null,
    },
    { key: 'lastUpdated', header: 'Aktualisiert', render: (s) => formatDate(s.lastUpdated) },
    {
      key: 'actions', header: '',
      render: () => <Button variant="outline" size="sm">Anpassen</Button>,
    },
  ]

  return (
    <>
      <SEOHead title="Lagerverwaltung" />
      <h2 className="mb-6 text-2xl font-bold text-[var(--text-primary)]">Lagerverwaltung</h2>
      <DataTable columns={columns} data={stockData} keyExtractor={(s) => s.id} />
    </>
  )
}
