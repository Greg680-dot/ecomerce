import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import type { ProductFilters } from '../../types'
import { Button } from '../ui/Button'

interface FilterSidebarProps {
  filters: ProductFilters
  onChange: (filters: ProductFilters) => void
  brands?: string[]
}

const sortOptions = [
  { value: 'popular', label: 'Beliebteste' },
  { value: 'newest', label: 'Neueste' },
  { value: 'price_asc', label: 'Preis aufsteigend' },
  { value: 'price_desc', label: 'Preis absteigend' },
  { value: 'rating', label: 'Beste Bewertung' },
] as const

export function FilterSidebar({ filters, onChange, brands = [] }: FilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const updateFilter = (key: keyof ProductFilters, value: unknown) => {
    onChange({ ...filters, [key]: value, page: 1 })
  }

  const clearFilters = () => {
    onChange({ page: 1 })
    setMobileOpen(false)
  }

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
          Filter
        </h3>
        <button
          onClick={clearFilters}
          className="text-xs text-primary hover:underline"
        >
          Zurücksetzen
        </button>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
          Sortierung
        </label>
        <select
          value={filters.sortBy || 'popular'}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
          Preisbereich (€)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) =>
              updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) =>
              updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      {brands.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
            Marken
          </label>
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.brand?.includes(brand) ?? false}
                  onChange={(e) => {
                    const current = filters.brand || []
                    updateFilter(
                      'brand',
                      e.target.checked
                        ? [...current, brand]
                        : current.filter((b) => b !== brand),
                    )
                  }}
                  className="rounded border-[var(--input-border)] text-primary focus:ring-primary"
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.inStock ?? false}
            onChange={(e) => updateFilter('inStock', e.target.checked || undefined)}
            className="rounded border-[var(--input-border)] text-primary focus:ring-primary"
          />
          Nur auf Lager
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.onSale ?? false}
            onChange={(e) => updateFilter('onSale', e.target.checked || undefined)}
            className="rounded border-[var(--input-border)] text-primary focus:ring-primary"
          />
          Nur Angebote
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.isNew ?? false}
            onChange={(e) => updateFilter('isNew', e.target.checked || undefined)}
            className="rounded border-[var(--input-border)] text-primary focus:ring-primary"
          />
          Nur Neuheiten
        </label>
      </div>
    </div>
  )

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="mb-4 lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filter
      </Button>

      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-36 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
          {content}
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-[var(--overlay)]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-[var(--card-bg)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filter</h2>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {content}
            <Button fullWidth className="mt-6" onClick={() => setMobileOpen(false)}>
              Filter anwenden
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
