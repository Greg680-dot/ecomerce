import { GitCompare } from 'lucide-react'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { SEOHead } from '../../components/ui/SEOHead'
import { ProductComparison } from '../../components/product/ProductComparison'
import { Button } from '../../components/ui/Button'
import { useCartStore } from '../../store/cartStore'

export default function ComparePage() {
  const compareList = useCartStore((s) => s.compareList)
  const clearCompare = useCartStore((s) => s.clearCompare)

  return (
    <>
      <SEOHead title="Produktvergleich" />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <Breadcrumb items={[{ label: 'Vergleich' }]} />
        <div className="mt-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitCompare className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Produktvergleich</h1>
          </div>
          {compareList.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearCompare}>Liste leeren</Button>
          )}
        </div>
        <ProductComparison products={compareList} />
      </div>
    </>
  )
}
