import { Link } from 'react-router-dom'
import { X, ShoppingCart } from 'lucide-react'
import type { Product } from '../../types'
import { formatPrice } from '../../utils/formatPrice'
import { RatingStars } from '../ui/RatingStars'
import { Button } from '../ui/Button'
import { useCartStore } from '../../store/cartStore'

interface ProductComparisonProps {
  products: Product[]
}

export function ProductComparison({ products }: ProductComparisonProps) {
  const removeFromCompare = useCartStore((s) => s.removeFromCompare)
  const addItem = useCartStore((s) => s.addItem)

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-12 text-center">
        <p className="text-lg font-medium text-[var(--text-primary)]">Keine Produkte zum Vergleichen</p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Fügen Sie bis zu 4 Produkte über das Vergleichs-Symbol hinzu
        </p>
        <Link to="/produkte">
          <Button className="mt-6">Produkte durchsuchen</Button>
        </Link>
      </div>
    )
  }

  const allSpecs = [...new Set(products.flatMap((p) => p.specs.map((s) => s.key)))]

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]">
            <th className="p-4 text-left font-semibold text-[var(--text-secondary)]">Eigenschaft</th>
            {products.map((product) => (
              <th key={product.id} className="p-4 text-center">
                <div className="relative">
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute -right-1 -top-1 rounded-full bg-[var(--bg-tertiary)] p-1 hover:bg-danger hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <img
                    src={product.images[0]?.url || `https://picsum.photos/seed/${product.id}/120/120`}
                    alt={product.name}
                    className="mx-auto mb-2 h-24 w-24 rounded-lg object-cover"
                  />
                  <Link
                    to={`/produkte/${product.slug}`}
                    className="font-semibold text-[var(--text-primary)] hover:text-primary"
                  >
                    {product.name}
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          <tr>
            <td className="p-4 font-medium text-[var(--text-secondary)]">Preis</td>
            {products.map((p) => (
              <td key={p.id} className="p-4 text-center text-lg font-bold text-primary">
                {formatPrice(p.price)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium text-[var(--text-secondary)]">Marke</td>
            {products.map((p) => (
              <td key={p.id} className="p-4 text-center">{p.brand}</td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium text-[var(--text-secondary)]">Bewertung</td>
            {products.map((p) => (
              <td key={p.id} className="flex justify-center p-4">
                <RatingStars rating={p.rating} size="sm" showValue reviewCount={p.reviewCount} />
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium text-[var(--text-secondary)]">Verfügbarkeit</td>
            {products.map((p) => (
              <td key={p.id} className={`p-4 text-center ${p.stock > 0 ? 'text-success' : 'text-danger'}`}>
                {p.stock > 0 ? `${p.stock} auf Lager` : 'Ausverkauft'}
              </td>
            ))}
          </tr>
          {allSpecs.map((specKey) => (
            <tr key={specKey}>
              <td className="p-4 font-medium text-[var(--text-secondary)]">{specKey}</td>
              {products.map((p) => (
                <td key={p.id} className="p-4 text-center">
                  {p.specs.find((s) => s.key === specKey)?.value || '—'}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="p-4" />
            {products.map((p) => (
              <td key={p.id} className="p-4 text-center">
                <Button size="sm" onClick={() => addItem(p)} disabled={p.stock === 0}>
                  <ShoppingCart className="h-4 w-4" />
                  In den Warenkorb
                </Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
