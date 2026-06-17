import { Plus } from 'lucide-react'
import { SEOHead } from '../../components/ui/SEOHead'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { mockCategories } from '../../data/mockData'
import type { Category } from '../../types'

export default function AdminCategories() {
  const columns: Column<Category>[] = [
    {
      key: 'name', header: 'Kategorie',
      render: (c) => (
        <div className="flex items-center gap-3">
          <img src={c.image} alt="" className="h-8 w-8 rounded-lg object-cover" />
          <span className="font-medium">{c.name}</span>
        </div>
      ),
    },
    { key: 'slug', header: 'Slug' },
    { key: 'productCount', header: 'Produkte' },
    {
      key: 'isActive', header: 'Status',
      render: (c) => <Badge variant={c.isActive ? 'success' : 'danger'}>{c.isActive ? 'Aktiv' : 'Inaktiv'}</Badge>,
    },
  ]

  return (
    <>
      <SEOHead title="Kategorien verwalten" />
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Kategorien</h2>
        <Button size="sm"><Plus className="h-4 w-4" /> Neue Kategorie</Button>
      </div>
      <DataTable columns={columns} data={mockCategories} keyExtractor={(c) => c.id} />
    </>
  )
}
