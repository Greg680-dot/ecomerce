import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { cn } from '../../utils/cn'

interface SearchBarProps {
  className?: string
  onSearch?: () => void
  defaultValue?: string
}

export function SearchBar({ className, onSearch, defaultValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/suche?q=${encodeURIComponent(query.trim())}`)
      onSearch?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative w-full max-w-2xl', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Produkte, Marken oder Kategorien suchen..."
        className={cn(
          'w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm',
          'bg-white/10 text-white placeholder:text-white/50',
          'border-white/20 focus:border-primary focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-primary/30',
        )}
      />
    </form>
  )
}
