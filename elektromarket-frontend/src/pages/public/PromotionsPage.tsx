import { motion } from 'framer-motion'
import { Tag, Clock } from 'lucide-react'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { SEOHead } from '../../components/ui/SEOHead'
import { ProductGrid } from '../../components/product/ProductGrid'
import { Badge } from '../../components/ui/Badge'
import { mockProducts, mockPromotions } from '../../data/mockData'
import { formatDate } from '../../utils/formatPrice'

export default function PromotionsPage() {
  const saleProducts = mockProducts.filter((p) => p.isOnSale)

  return (
    <>
      <SEOHead title="Aktionen" description="Aktuelle Angebote und Rabattaktionen bei ElektroMarket" />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <Breadcrumb items={[{ label: 'Aktionen' }]} />
        <h1 className="mt-4 mb-8 text-3xl font-bold text-[var(--text-primary)]">Aktionen & Angebote</h1>

        <div className="mb-12 grid gap-6 md:grid-cols-2">
          {mockPromotions.map((promo, i) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <img src={promo.image} alt={promo.title} className="h-48 w-full object-cover md:h-56" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 p-6 text-white">
                <Badge variant="primary" className="mb-2">
                  {promo.discountType === 'percentage' ? `-${promo.discountValue}%` : `${promo.discountValue}€`}
                </Badge>
                <h2 className="text-xl font-bold">{promo.title}</h2>
                <p className="mt-1 text-sm text-white/70">{promo.description}</p>
                {promo.code && (
                  <p className="mt-2 flex items-center gap-1 text-sm">
                    <Tag className="h-4 w-4" /> Code: <strong>{promo.code}</strong>
                  </p>
                )}
                <p className="mt-1 flex items-center gap-1 text-xs text-white/50">
                  <Clock className="h-3 w-3" /> Bis {formatDate(promo.endDate)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <h2 className="mb-6 text-2xl font-bold text-[var(--text-primary)]">Reduzierte Produkte</h2>
        <ProductGrid products={saleProducts} columns={4} />
      </div>
    </>
  )
}
