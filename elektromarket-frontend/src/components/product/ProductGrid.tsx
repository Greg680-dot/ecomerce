import type { Product } from '../../types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
  columns?: 2 | 3 | 4
}

export function ProductGrid({ products, isLoading, columns = 4 }: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  if (isLoading) {
    return (
      <div className={`grid gap-4 ${gridCols[columns]}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[3/4] rounded-xl" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-[var(--text-primary)]">Keine Produkte gefunden</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Versuchen Sie andere Filter oder Suchbegriffe
        </p>
      </div>
    )
  }

  return (
    <div className={`grid gap-4 ${gridCols[columns]}`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}
