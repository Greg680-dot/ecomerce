import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '../../utils/cn'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Brotkrumen" className={cn('flex items-center gap-1 text-sm', className)}>
      <Link
        to="/"
        className="flex items-center text-[var(--text-muted)] transition-colors hover:text-primary"
      >
        <Home className="h-4 w-4" />
      </Link>

      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
          {item.href ? (
            <Link
              to={item.href}
              className="text-[var(--text-muted)] transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-[var(--text-primary)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
