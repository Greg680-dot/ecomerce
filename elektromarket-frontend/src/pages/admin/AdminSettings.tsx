import { useState } from 'react'
import { Save } from 'lucide-react'
import { SEOHead } from '../../components/ui/SEOHead'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'ElektroMarket Germany',
    storeEmail: 'info@elektromarket.de',
    currency: 'EUR',
    taxRate: 19,
    shippingCost: 4.99,
    freeShippingThreshold: 49,
    maintenanceMode: false,
  })

  return (
    <>
      <SEOHead title="Einstellungen" />
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Einstellungen</h2>
        <Button size="sm"><Save className="h-4 w-4" /> Speichern</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Allgemein</CardTitle></CardHeader>
          <div className="space-y-4">
            <Input label="Shop-Name" value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} />
            <Input label="E-Mail" type="email" value={settings.storeEmail} onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })} />
            <Input label="Währung" value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} />
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Versand & Steuern</CardTitle></CardHeader>
          <div className="space-y-4">
            <Input label="MwSt.-Satz (%)" type="number" value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })} />
            <Input label="Versandkosten (€)" type="number" step="0.01" value={settings.shippingCost} onChange={(e) => setSettings({ ...settings, shippingCost: Number(e.target.value) })} />
            <Input label="Gratisversand ab (€)" type="number" value={settings.freeShippingThreshold} onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })} />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Wartungsmodus</CardTitle></CardHeader>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="rounded text-primary focus:ring-primary"
            />
            <span className="text-sm">Shop in Wartungsmodus versetzen</span>
          </label>
        </Card>
      </div>
    </>
  )
}
