import { Link } from 'react-router-dom'
import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react'
import { HeroBanner } from '../../components/product/HeroBanner'
import { CategoryNav } from '../../components/product/CategoryNav'
import { ProductGrid } from '../../components/product/ProductGrid'
import { SEOHead } from '../../components/ui/SEOHead'
import { useFeaturedProducts, useOnSaleProducts } from '../../hooks/useProducts'
import { mockProducts } from '../../data/mockData'
import { Button } from '../../components/ui/Button'

const features = [
  { icon: Truck, title: 'Kostenloser Versand', desc: 'Ab 49 € Bestellwert' },
  { icon: Shield, title: 'Sichere Zahlung', desc: 'SSL & Käuferschutz' },
  { icon: RotateCcw, title: '30 Tage Rückgabe', desc: 'Ohne Wenn und Aber' },
  { icon: Headphones, title: '24/7 Support', desc: 'Persönliche Beratung' },
]

export default function HomePage() {
  const { data: featured, isLoading: loadingFeatured } = useFeaturedProducts()
  const { data: onSale, isLoading: loadingSale } = useOnSaleProducts(4)

  const featuredProducts = featured ?? mockProducts.filter((p) => p.isFeatured).slice(0, 4)
  const saleProducts = onSale ?? mockProducts.filter((p) => p.isOnSale).slice(0, 4)

  return (
    <>
      <SEOHead
        title="Startseite"
        description="ElektroMarket Germany – Premium Elektronik zu fairen Preisen. Smartphones, Laptops, TV, Gaming und mehr."
      />
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 lg:px-6">
        <HeroBanner />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
                <p className="text-xs text-[var(--text-muted)]">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <CategoryNav />

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Empfohlene Produkte</h2>
            <Link to="/produkte">
              <Button variant="outline" size="sm">Alle Produkte</Button>
            </Link>
          </div>
          <ProductGrid products={featuredProducts} isLoading={loadingFeatured} />
        </section>

        <section className="gradient-hero rounded-2xl p-8 text-center md:p-12">
          <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">Sommer-Sale – Bis zu 40% sparen</h2>
          <p className="mb-6 text-white/70">Exklusive Angebote auf Top-Marken. Nur für kurze Zeit.</p>
          <Link to="/aktionen">
            <Button size="lg">Angebote entdecken</Button>
          </Link>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Top-Angebote</h2>
            <Link to="/aktionen" className="text-sm font-medium text-primary hover:underline">
              Alle Angebote →
            </Link>
          </div>
          <ProductGrid products={saleProducts} isLoading={loadingSale} columns={4} />
        </section>
      </div>
    </>
  )
}
