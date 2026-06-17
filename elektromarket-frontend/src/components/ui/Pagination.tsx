import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
  )

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Seitennavigation">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
          'border border-[var(--border-color)] text-[var(--text-secondary)]',
          'hover:bg-[var(--bg-tertiary)] disabled:opacity-40 disabled:cursor-not-allowed',
        )}
        aria-label="Vorherige Seite"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {visiblePages.map((page, idx) => {
        const prev = visiblePages[idx - 1]
        const showEllipsis = prev && page - prev > 1

        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis && (
              <span className="px-2 text-[var(--text-muted)]">…</span>
            )}
            <button
              onClick={() => onPageChange(page)}
              className={cn(
                'flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors',
                page === currentPage
                  ? 'bg-primary text-white shadow-md'
                  : 'border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]',
              )}
            >
              {page}
            </button>
          </span>
        )
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
          'border border-[var(--border-color)] text-[var(--text-secondary)]',
          'hover:bg-[var(--bg-tertiary)] disabled:opacity-40 disabled:cursor-not-allowed',
        )}
        aria-label="Nächste Seite"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
