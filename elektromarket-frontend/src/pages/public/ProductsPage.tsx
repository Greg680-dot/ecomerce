import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { SEOHead } from '../../components/ui/SEOHead'
import { Pagination } from '../../components/ui/Pagination'
import { ProductGrid } from '../../components/product/ProductGrid'
import { FilterSidebar } from '../../components/product/FilterSidebar'
import { useProducts, useBrands } from '../../hooks/useProducts'
import { mockProducts } from '../../data/mockData'
import type { ProductFilters } from '../../types'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') ? [searchParams.get('brand')!] : undefined,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  })

  const { data, isLoading } = useProducts(filters)
  const { data: brands } = useBrands()

  const products = data?.data ?? mockProducts
  const totalPages = data?.totalPages ?? 1
  const currentPage = filters.page ?? 1

  return (
    <>
      <SEOHead title="Produkte" description="Alle Elektronikprodukte bei ElektroMarket Germany" />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <Breadcrumb items={[{ label: 'Produkte' }]} />
        <h1 className="mt-4 mb-8 text-3xl font-bold text-[var(--text-primary)]">Alle Produkte</h1>

        <div className="flex gap-8">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            brands={brands ?? [...new Set(mockProducts.map((p) => p.brand))]}
          />
          <div className="flex-1">
            <p className="mb-4 text-sm text-[var(--text-muted)]">
              {data?.total ?? products.length} Produkte gefunden
            </p>
            <ProductGrid products={products} isLoading={isLoading} />
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setFilters({ ...filters, page })}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
