import { Star } from 'lucide-react'
import { cn } from '../../utils/cn'

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  reviewCount?: number
}

const sizes = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showValue,
  reviewCount,
}: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center" role="img" aria-label={`${rating} von ${maxRating} Sternen`}>
        {Array.from({ length: maxRating }).map((_, i) => {
          const filled = i < Math.floor(rating)
          const partial = !filled && i < rating

          return (
            <Star
              key={i}
              className={cn(
                sizes[size],
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : partial
                    ? 'fill-amber-200 text-amber-400'
                    : 'fill-[var(--bg-tertiary)] text-[var(--border-color)]',
              )}
            />
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-[var(--text-primary)]">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-[var(--text-muted)]">({reviewCount})</span>
      )}
    </div>
  )
}
