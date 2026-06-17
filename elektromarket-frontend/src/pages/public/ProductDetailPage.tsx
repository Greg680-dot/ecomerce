import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Heart, GitCompare, Truck, Shield, Minus, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { SEOHead } from '../../components/ui/SEOHead'
import { RatingStars } from '../../components/ui/RatingStars'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ProductGrid } from '../../components/product/ProductGrid'
import { useProduct } from '../../hooks/useProducts'
import { useCartStore } from '../../store/cartStore'
import { mockProducts } from '../../data/mockData'
import { formatPrice, formatDiscount } from '../../utils/formatPrice'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { data: product, isLoading } = useProduct(slug || '')
  const addItem = useCartStore((s) => s.addItem)
  const addToCompare = useCartStore((s) => s.addToCompare)

  const p = product ?? mockProducts.find((m) => m.slug === slug) ?? mockProducts[0]

  if (isLoading && !product) {
    return <div className="skeleton mx-auto mt-8 h-96 max-w-7xl rounded-xl" />
  }

  const images = p.images.length > 0 ? p.images : [{ id: '0', url: `https://picsum.photos/seed/${p.id}/600/600`, alt: p.name, isPrimary: true }]
  const related = mockProducts.filter((m) => m.categoryId === p.categoryId && m.id !== p.id).slice(0, 4)

  return (
    <>
      <SEOHead title={p.name} description={p.shortDescription || p.description} />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <Breadcrumb items={[
          { label: 'Produkte', href: '/produkte' },
          { label: p.name },
        ]} />

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="mb-4 aspect-square overflow-hidden rounded-2xl bg-[var(--bg-tertiary)]">
              <img src={images[selectedImage].url} alt={p.name} className="h-full w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`h-20 w-20 overflow-hidden rounded-lg border-2 ${i === selectedImage ? 'border-primary' : 'border-transparent'}`}
                  >
                    <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="mb-2 flex gap-2">
              {p.isNew && <Badge variant="primary">Neu</Badge>}
              {p.isOnSale && <Badge variant="danger">{formatDiscount(p.originalPrice || p.price, p.price)}</Badge>}
            </div>
            <p className="text-sm font-medium uppercase tracking-wider text-[var(--text-muted)]">{p.brand}</p>
            <h1 className="mt-1 text-2xl font-bold text-[var(--text-primary)] md:text-3xl">{p.name}</h1>
            <div className="mt-3">
              <RatingStars rating={p.rating} showValue reviewCount={p.reviewCount} size="md" />
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">{formatPrice(p.price)}</span>
              {p.originalPrice && p.originalPrice > p.price && (
                <span className="text-lg text-[var(--text-muted)] line-through">{formatPrice(p.originalPrice)}</span>
              )}
            </div>
            <p className="mt-4 text-[var(--text-secondary)]">{p.description}</p>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-[var(--border-color)]">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-[var(--bg-tertiary)]">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-[var(--bg-tertiary)]">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button size="lg" onClick={() => addItem(p, quantity)} disabled={p.stock === 0} className="flex-1">
                <ShoppingCart className="h-5 w-5" />
                In den Warenkorb
              </Button>
            </div>

            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => addToCompare(p)}>
                <GitCompare className="h-4 w-4" /> Vergleichen
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4" /> Wunschliste
              </Button>
            </div>

            <div className="mt-6 space-y-2 rounded-xl bg-[var(--bg-tertiary)] p-4 text-sm">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Truck className="h-4 w-4 text-primary" />
                {p.stock > 0 ? `Auf Lager – Lieferung in 1-3 Werktagen` : 'Derzeit nicht verfügbar'}
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Shield className="h-4 w-4 text-primary" />
                2 Jahre Herstellergarantie
              </div>
            </div>

            {p.specs.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 font-semibold text-[var(--text-primary)]">Technische Daten</h3>
                <dl className="divide-y divide-[var(--border-color)] rounded-xl border border-[var(--border-color)]">
                  {p.specs.map((spec) => (
                    <div key={spec.key} className="flex justify-between px-4 py-2.5 text-sm">
                      <dt className="text-[var(--text-muted)]">{spec.key}</dt>
                      <dd className="font-medium text-[var(--text-primary)]">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-[var(--text-primary)]">Ähnliche Produkte</h2>
            <ProductGrid products={related} columns={4} />
          </section>
        )}
      </div>
    </>
  )
}
