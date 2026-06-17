import { useState } from 'react'
import { Plus, MapPin, Trash2, Star } from 'lucide-react'
import { SEOHead } from '../../components/ui/SEOHead'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import type { Address } from '../../types'

const mockAddresses: Address[] = [
  { id: '1', userId: '1', label: 'Zuhause', firstName: 'Max', lastName: 'Mustermann', street: 'Hauptstraße 1', city: 'Berlin', postalCode: '10115', country: 'DE', phone: '+49 170 1234567', isDefault: true },
  { id: '2', userId: '1', label: 'Büro', firstName: 'Max', lastName: 'Mustermann', street: 'Friedrichstraße 123', city: 'Berlin', postalCode: '10117', country: 'DE', phone: '+49 30 12345678', isDefault: false },
]

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(mockAddresses)
  const [modalOpen, setModalOpen] = useState(false)

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <>
      <SEOHead title="Adressen" />
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Meine Adressen</h2>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Neue Adresse
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((addr) => (
          <div key={addr.id} className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-semibold">{addr.label}</span>
                {addr.isDefault && <Badge variant="primary">Standard</Badge>}
              </div>
              <button onClick={() => deleteAddress(addr.id)} className="text-[var(--text-muted)] hover:text-danger">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              {addr.firstName} {addr.lastName}<br />
              {addr.street}<br />
              {addr.postalCode} {addr.city}<br />
              {addr.phone}
            </p>
            {!addr.isDefault && (
              <Button variant="ghost" size="sm" className="mt-3">
                <Star className="h-3 w-3" /> Als Standard setzen
              </Button>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Neue Adresse">
        <form className="space-y-4">
          <Input label="Bezeichnung" placeholder="Zuhause, Büro..." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Vorname" />
            <Input label="Nachname" />
          </div>
          <Input label="Straße & Hausnummer" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="PLZ" />
            <Input label="Stadt" />
          </div>
          <Input label="Telefon" />
          <Button fullWidth onClick={() => setModalOpen(false)}>Adresse speichern</Button>
        </form>
      </Modal>
    </>
  )
}
