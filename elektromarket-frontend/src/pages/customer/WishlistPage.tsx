import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { SEOHead } from '../../components/ui/SEOHead'
import { Button } from '../../components/ui/Button'
import { RatingStars } from '../../components/ui/RatingStars'
import { useCartStore } from '../../store/cartStore'
import { mockProducts } from '../../data/mockData'
import { formatPrice } from '../../utils/formatPrice'

export default function WishlistPage() {
  const addItem = useCartStore((s) => s.addItem)
  const wishlistProducts = mockProducts.slice(0, 5)

  return (
    <>
      <SEOHead title="Wunschliste" />
      <h2 className="mb-6 text-xl font-semibold text-[var(--text-primary)]">Meine Wunschliste</h2>

      {wishlistProducts.length === 0 ? (
        <div className="py-12 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-[var(--text-muted)]" />
          <p className="text-[var(--text-muted)]">Ihre Wunschliste ist leer</p>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="flex gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4">
              <img
                src={product.images[0]?.url || `https://picsum.photos/seed/${product.id}/100/100`}
                alt={product.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
              <div className="flex flex-1 flex-col">
                <Link to={`/produkte/${product.slug}`} className="font-semibold hover:text-primary">
                  {product.name}
                </Link>
                <RatingStars rating={product.rating} size="sm" />
                <p className="mt-auto text-lg font-bold text-primary">{formatPrice(product.price)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button className="text-[var(--text-muted)] hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
                <Button size="sm" onClick={() => addItem(product)}>
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
