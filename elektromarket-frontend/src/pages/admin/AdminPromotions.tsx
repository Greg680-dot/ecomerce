import { Plus } from 'lucide-react'
import { SEOHead } from '../../components/ui/SEOHead'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { mockPromotions } from '../../data/mockData'
import { formatDate } from '../../utils/formatPrice'

export default function AdminPromotions() {
  return (
    <>
      <SEOHead title="Aktionen verwalten" />
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Aktionen & Promotions</h2>
        <Button size="sm"><Plus className="h-4 w-4" /> Neue Aktion</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockPromotions.map((promo) => (
          <Card key={promo.id} hover>
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 flex gap-2">
                  <Badge variant="primary">
                    {promo.discountType === 'percentage' ? `-${promo.discountValue}%` : `${promo.discountValue}€`}
                  </Badge>
                  <Badge variant={promo.isActive ? 'success' : 'danger'}>
                    {promo.isActive ? 'Aktiv' : 'Inaktiv'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-[var(--text-primary)]">{promo.title}</h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{promo.description}</p>
                {promo.code && <p className="mt-2 text-sm">Code: <strong>{promo.code}</strong></p>}
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  {formatDate(promo.startDate)} – {formatDate(promo.endDate)}
                </p>
              </div>
              <Button variant="outline" size="sm">Bearbeiten</Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
