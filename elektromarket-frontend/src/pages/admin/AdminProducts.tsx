import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { SEOHead } from '../../components/ui/SEOHead'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { mockProducts } from '../../data/mockData'
import { formatPrice } from '../../utils/formatPrice'
import type { Product } from '../../types'

export default function AdminProducts() {
  const [search, setSearch] = useState('')
  const products = mockProducts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  const columns: Column<Product>[] = [
    {
      key: 'name', header: 'Produkt',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.images[0]?.url} alt="" className="h-10 w-10 rounded-lg object-cover" />
          <div>
            <p className="font-medium">{p.name}</p>
            <p className="text-xs text-[var(--text-muted)]">{p.sku}</p>
          </div>
        </div>
      ),
    },
    { key: 'brand', header: 'Marke' },
    { key: 'price', header: 'Preis', render: (p) => formatPrice(p.price) },
    {
      key: 'stock', header: 'Lager',
      render: (p) => (
        <Badge variant={p.stock > 10 ? 'success' : p.stock > 0 ? 'warning' : 'danger'}>
          {p.stock}
        </Badge>
      ),
    },
    {
      key: 'status', header: 'Status',
      render: (p) => (
        <div className="flex gap-1">
          {p.isNew && <Badge variant="primary">Neu</Badge>}
          {p.isOnSale && <Badge variant="danger">Sale</Badge>}
        </div>
      ),
    },
  ]

  return (
    <>
      <SEOHead title="Produkte verwalten" />
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Produkte</h2>
        <Button size="sm"><Plus className="h-4 w-4" /> Neues Produkt</Button>
      </div>
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <Input placeholder="Produkte suchen..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>
      <DataTable columns={columns} data={products} keyExtractor={(p) => p.id} />
    </>
  )
}
