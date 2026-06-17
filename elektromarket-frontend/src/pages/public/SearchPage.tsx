import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { SEOHead } from '../../components/ui/SEOHead'
import { ProductGrid } from '../../components/product/ProductGrid'
import { FilterSidebar } from '../../components/product/FilterSidebar'
import { Input } from '../../components/ui/Input'
import { useProductSearch } from '../../hooks/useProducts'
import { mockProducts } from '../../data/mockData'
import type { ProductFilters } from '../../types'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchInput, setSearchInput] = useState(query)
  const [filters, setFilters] = useState<ProductFilters>({})

  const { data, isLoading } = useProductSearch(query, filters)

  const filtered = query
    ? mockProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()),
      )
    : []

  const products = data?.data ?? filtered

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() })
    }
  }

  return (
    <>
      <SEOHead title={`Suche: ${query || 'Produkte'}`} />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <Breadcrumb items={[{ label: 'Suche' }]} />
        <h1 className="mt-4 mb-6 text-3xl font-bold text-[var(--text-primary)]">Suche</h1>

        <form onSubmit={handleSearch} className="relative mb-8 max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Was suchen Sie?"
            className="pl-10"
          />
        </form>

        {query ? (
          <div className="flex gap-8">
            <FilterSidebar filters={filters} onChange={setFilters} />
            <div className="flex-1">
              <p className="mb-4 text-sm text-[var(--text-muted)]">
                {products.length} Ergebnisse für „{query}"
              </p>
              <ProductGrid products={products} isLoading={isLoading} />
            </div>
          </div>
        ) : (
          <div className="py-16 text-center text-[var(--text-muted)]">
            Geben Sie einen Suchbegriff ein, um Produkte zu finden
          </div>
        )}
      </div>
    </>
  )
}
