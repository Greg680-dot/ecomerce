import { Sparkles } from 'lucide-react'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { SEOHead } from '../../components/ui/SEOHead'
import { ProductGrid } from '../../components/product/ProductGrid'
import { useNewArrivals } from '../../hooks/useProducts'
import { mockProducts } from '../../data/mockData'

export default function NewArrivalsPage() {
  const { data, isLoading } = useNewArrivals()
  const products = data ?? mockProducts.filter((p) => p.isNew)

  return (
    <>
      <SEOHead title="Neuheiten" description="Die neuesten Elektronikprodukte bei ElektroMarket Germany" />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <Breadcrumb items={[{ label: 'Neuheiten' }]} />
        <div className="mt-4 mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Neuheiten</h1>
            <p className="text-[var(--text-muted)]">Frisch eingetroffen – die neuesten Produkte</p>
          </div>
        </div>
        <ProductGrid products={products} isLoading={isLoading} columns={4} />
      </div>
    </>
  )
}
