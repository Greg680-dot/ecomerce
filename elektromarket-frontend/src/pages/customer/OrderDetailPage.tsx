import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Truck, MapPin } from 'lucide-react'
import { SEOHead } from '../../components/ui/SEOHead'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { mockOrders } from '../../data/mockData'
import { formatPrice, formatDate } from '../../utils/formatPrice'
import { ORDER_STATUS_LABELS } from '../../utils/constants'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const order = mockOrders.find((o) => o.id === id) ?? mockOrders[0]

  const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
  const currentStep = steps.indexOf(order.status)

  return (
    <>
      <SEOHead title={`Bestellung ${order.orderNumber}`} />
      <Link to="/konto/bestellungen" className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Zurück zu Bestellungen
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">{order.orderNumber}</h2>
          <p className="text-sm text-[var(--text-muted)]">Bestellt am {formatDate(order.createdAt)}</p>
        </div>
        <Badge variant="success">{ORDER_STATUS_LABELS[order.status]}</Badge>
      </div>

      <div className="mb-8 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold">
          <Truck className="h-5 w-5 text-primary" /> Sendungsverfolgung
        </h3>
        <div className="flex items-center justify-between">
          {['Bestellt', 'Bestätigt', 'Versand', 'Unterwegs', 'Zugestellt'].map((label, i) => (
            <div key={label} className="flex flex-col items-center">
              <div className={`mb-2 h-3 w-3 rounded-full ${i <= currentStep ? 'bg-primary' : 'bg-[var(--border-color)]'}`} />
              <span className="hidden text-xs text-[var(--text-muted)] sm:block">{label}</span>
            </div>
          ))}
        </div>
        {order.trackingNumber && (
          <p className="mt-4 text-sm">Sendungsnummer: <strong>{order.trackingNumber}</strong></p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
          <h3 className="mb-4 font-semibold">Bestellte Artikel</h3>
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3 border-b border-[var(--border-color)] py-3 last:border-0">
              <img src={item.productImage} alt={item.productName} className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-[var(--text-muted)]">Menge: {item.quantity}</p>
              </div>
              <p className="font-semibold text-primary">{formatPrice(item.total)}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <MapPin className="h-4 w-4 text-primary" /> Lieferadresse
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.postalCode} {order.shippingAddress.city}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
            <h3 className="mb-3 font-semibold">Zusammenfassung</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Zwischensumme</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Versand</span><span>{order.shippingCost === 0 ? 'Kostenlos' : formatPrice(order.shippingCost)}</span></div>
              <div className="flex justify-between"><span>MwSt.</span><span>{formatPrice(order.tax)}</span></div>
              <hr className="border-[var(--border-color)]" />
              <div className="flex justify-between font-bold text-primary"><span>Gesamt</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>
          {order.status === 'delivered' && (
            <Button variant="outline" fullWidth>Retoure anfordern</Button>
          )}
        </div>
      </div>
    </>
  )
}
