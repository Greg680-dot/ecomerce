import { Link } from 'react-router-dom'
import { Tag, Truck, ShieldCheck } from 'lucide-react'
import type { CartItem } from '../../types'
import { formatPrice } from '../../utils/formatPrice'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface CartSummaryProps {
  items: CartItem[]
  subtotal: number
  showCheckout?: boolean
  promoCode?: string
  onPromoChange?: (code: string) => void
  onApplyPromo?: () => void
}

export function CartSummary({
  items,
  subtotal,
  showCheckout = true,
  promoCode = '',
  onPromoChange,
  onApplyPromo,
}: CartSummaryProps) {
  const shipping = subtotal >= 49 ? 0 : 4.99
  const tax = subtotal * 0.19
  const total = subtotal + shipping + tax
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
      <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">Bestellübersicht</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Artikel ({itemCount})</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-1 text-[var(--text-secondary)]">
            <Truck className="h-4 w-4" />
            Versand
          </span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-success">Kostenlos</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">MwSt. (19%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>
        <hr className="border-[var(--border-color)]" />
        <div className="flex justify-between text-base">
          <span className="font-semibold text-[var(--text-primary)]">Gesamt</span>
          <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
        </div>
      </div>

      {onPromoChange && (
        <div className="mt-4 flex gap-2">
          <Input
            placeholder="Gutscheincode"
            value={promoCode}
            onChange={(e) => onPromoChange(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="sm" onClick={onApplyPromo}>
            <Tag className="h-4 w-4" />
          </Button>
        </div>
      )}

      {subtotal < 49 && subtotal > 0 && (
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          Noch {formatPrice(49 - subtotal)} bis zum kostenlosen Versand
        </p>
      )}

      {showCheckout && items.length > 0 && (
        <Link to="/kasse" className="mt-6 block">
          <Button fullWidth size="lg">Zur Kasse</Button>
        </Link>
      )}

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
        <ShieldCheck className="h-4 w-4 text-success" />
        Sichere SSL-Verschlüsselung
      </div>
    </div>
  )
}
