import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { SEOHead } from '../../components/ui/SEOHead'
import { Button } from '../../components/ui/Button'
import { CartSummary } from '../../components/cart/CartSummary'
import { useCartStore } from '../../store/cartStore'
import { formatPrice } from '../../utils/formatPrice'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore()
  const subtotal = getSubtotal()

  return (
    <>
      <SEOHead title="Warenkorb" />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <Breadcrumb items={[{ label: 'Warenkorb' }]} />
        <h1 className="mt-4 mb-8 text-3xl font-bold text-[var(--text-primary)]">Warenkorb</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <ShoppingBag className="mb-4 h-16 w-16 text-[var(--text-muted)]" />
            <p className="text-lg font-medium text-[var(--text-primary)]">Ihr Warenkorb ist leer</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Entdecken Sie unsere Produkte</p>
            <Link to="/produkte"><Button className="mt-6">Produkte entdecken</Button></Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4"
                >
                  <img
                    src={item.product.images[0]?.url || `https://picsum.photos/seed/${item.productId}/100/100`}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <Link to={`/produkte/${item.product.slug}`} className="font-semibold hover:text-primary">
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-[var(--text-muted)]">{item.product.brand}</p>
                    <p className="mt-auto text-lg font-bold text-primary">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeItem(item.productId)} className="text-[var(--text-muted)] hover:text-danger">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex items-center rounded-lg border border-[var(--border-color)]">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-2 py-1">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-2 py-1">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <CartSummary items={items} subtotal={subtotal} />
          </div>
        )}
      </div>
    </>
  )
}
