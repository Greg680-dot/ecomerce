import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, GitCompare, Eye } from 'lucide-react'
import type { Product } from '../../types'
import { formatPrice, formatDiscount } from '../../utils/formatPrice'
import { RatingStars } from '../ui/RatingStars'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useCartStore } from '../../store/cartStore'
import { cn } from '../../utils/cn'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const addToCompare = useCartStore((s) => s.addToCompare)
  const image = product.images[0]?.url || `https://picsum.photos/seed/${product.id}/400/400`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="relative aspect-square overflow-hidden bg-[var(--bg-tertiary)]">
        <Link to={`/produkte/${product.slug}`}>
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </Link>

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNew && <Badge variant="primary">Neu</Badge>}
          {product.isOnSale && product.discountPercent && (
            <Badge variant="danger">{formatDiscount(product.originalPrice || product.price, product.price)}</Badge>
          )}
        </div>

        <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => addToCompare(product)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--text-secondary)] shadow-md hover:bg-primary hover:text-white"
            title="Vergleichen"
          >
            <GitCompare className="h-4 w-4" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--text-secondary)] shadow-md hover:bg-red-500 hover:text-white"
            title="Wunschliste"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <Link
          to={`/produkte/${product.slug}`}
          className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-secondary/90 py-2.5 text-sm font-medium text-white transition-transform group-hover:translate-y-0"
        >
          <Eye className="h-4 w-4" />
          Details ansehen
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          {product.brand}
        </span>
        <Link
          to={`/produkte/${product.slug}`}
          className="mb-2 line-clamp-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        <RatingStars rating={product.rating} size="sm" reviewCount={product.reviewCount} />

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-2 text-sm text-[var(--text-muted)] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={() => addItem(product)}
            className="!px-3"
            aria-label="In den Warenkorb"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <p className="mt-2 text-xs text-warning">Nur noch {product.stock} auf Lager</p>
        )}
        {product.stock === 0 && (
          <p className="mt-2 text-xs text-danger">Ausverkauft</p>
        )}
      </div>
    </motion.div>
  )
}
