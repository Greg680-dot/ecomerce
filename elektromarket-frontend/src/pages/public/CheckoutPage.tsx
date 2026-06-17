import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Truck, MapPin } from 'lucide-react'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { SEOHead } from '../../components/ui/SEOHead'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { CartSummary } from '../../components/cart/CartSummary'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, getSubtotal, clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('paypal')
  const subtotal = getSubtotal()

  if (items.length === 0) {
    navigate('/warenkorb')
    return null
  }

  const handleOrder = () => {
    clearCart()
    navigate('/konto/bestellungen')
  }

  return (
    <>
      <SEOHead title="Kasse" />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <Breadcrumb items={[
          { label: 'Warenkorb', href: '/warenkorb' },
          { label: 'Kasse' },
        ]} />
        <h1 className="mt-4 mb-8 text-3xl font-bold text-[var(--text-primary)]">Kasse</h1>

        <div className="mb-8 flex gap-2">
          {['Adresse', 'Versand', 'Zahlung'].map((label, i) => (
            <div
              key={label}
              className={`flex-1 rounded-lg py-2 text-center text-sm font-medium ${
                step === i + 1 ? 'bg-primary text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
              }`}
            >
              {i + 1}. {label}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="h-5 w-5 text-primary" /> Lieferadresse
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Vorname" placeholder="Max" />
                  <Input label="Nachname" placeholder="Mustermann" />
                  <Input label="Straße & Hausnummer" placeholder="Hauptstraße 1" className="sm:col-span-2" />
                  <Input label="PLZ" placeholder="10115" />
                  <Input label="Stadt" placeholder="Berlin" />
                  <Input label="Telefon" placeholder="+49 170 1234567" className="sm:col-span-2" />
                </div>
                <Button className="mt-6" onClick={() => setStep(2)}>Weiter zum Versand</Button>
              </div>
            )}

            {step === 2 && (
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Truck className="h-5 w-5 text-primary" /> Versandart
                </h2>
                <div className="space-y-3">
                  {[
                    { id: 'standard', label: 'Standardversand (2-4 Werktage)', price: subtotal >= 49 ? 'Kostenlos' : '4,99 €' },
                    { id: 'express', label: 'Expressversand (1-2 Werktage)', price: '9,99 €' },
                  ].map((opt) => (
                    <label key={opt.id} className="flex cursor-pointer items-center justify-between rounded-lg border border-[var(--border-color)] p-4 hover:border-primary">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" defaultChecked={opt.id === 'standard'} className="text-primary" />
                        <span className="text-sm font-medium">{opt.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-primary">{opt.price}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>Zurück</Button>
                  <Button onClick={() => setStep(3)}>Weiter zur Zahlung</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <CreditCard className="h-5 w-5 text-primary" /> Zahlungsmethode
                </h2>
                <div className="space-y-3">
                  {['paypal', 'kreditkarte', 'klarna', 'ueberweisung'].map((method) => (
                    <label key={method} className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--border-color)] p-4 hover:border-primary">
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="text-primary"
                      />
                      <span className="text-sm font-medium capitalize">{method === 'kreditkarte' ? 'Kreditkarte' : method === 'ueberweisung' ? 'Überweisung' : method.charAt(0).toUpperCase() + method.slice(1)}</span>
                    </label>
                  ))}
                </div>
                {!isAuthenticated && (
                  <p className="mt-4 text-sm text-[var(--text-muted)]">
                    Sie können als Gast bestellen oder sich{' '}
                    <a href="/anmelden" className="text-primary hover:underline">anmelden</a>.
                  </p>
                )}
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)}>Zurück</Button>
                  <Button onClick={handleOrder}>Jetzt kaufen</Button>
                </div>
              </div>
            )}
          </div>
          <CartSummary items={items} subtotal={subtotal} showCheckout={false} />
        </div>
      </div>
    </>
  )
}
