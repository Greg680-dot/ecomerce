import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Category } from '../../types'
import { mockCategories } from '../../data/mockData'

interface CategoryNavProps {
  categories?: Category[]
}

export function CategoryNav({ categories = mockCategories }: CategoryNavProps) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Kategorien entdecken</h2>
        <Link to="/produkte" className="text-sm font-medium text-primary hover:underline">
          Alle anzeigen →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/produkte?category=${cat.slug}`}
              className="group flex flex-col items-center rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 transition-all hover:border-primary hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="mb-3 h-16 w-16 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                <img
                  src={cat.image || `https://picsum.photos/seed/${cat.slug}/100/100`}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <span className="text-center text-sm font-medium text-[var(--text-primary)] group-hover:text-primary">
                {cat.name}
              </span>
              <span className="mt-0.5 text-xs text-[var(--text-muted)]">
                {cat.productCount} Produkte
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
