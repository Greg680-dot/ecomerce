import { BarChart3, TrendingUp } from 'lucide-react'
import { SEOHead } from '../../components/ui/SEOHead'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { formatPrice } from '../../utils/formatPrice'

const monthlyData = [
  { month: 'Jan', revenue: 45200, orders: 189 },
  { month: 'Feb', revenue: 52800, orders: 215 },
  { month: 'Mär', revenue: 48900, orders: 198 },
  { month: 'Apr', revenue: 61200, orders: 256 },
  { month: 'Mai', revenue: 58700, orders: 241 },
  { month: 'Jun', revenue: 68400, orders: 278 },
]

const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue))

export default function AdminAnalytics() {
  return (
    <>
      <SEOHead title="Analysen" />
      <h2 className="mb-6 text-2xl font-bold text-[var(--text-primary)]">Analysen</h2>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Umsatz (30 Tage)', value: formatPrice(284750), icon: TrendingUp },
          { label: 'Conversion Rate', value: '3.2%', icon: BarChart3 },
          { label: 'Ø Bestellwert', value: formatPrice(228.35), icon: TrendingUp },
        ].map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                <p className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Monatlicher Umsatz</CardTitle></CardHeader>
        <div className="flex h-64 items-end gap-3 px-2">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-medium text-primary">{formatPrice(d.revenue, { compact: true })}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary-light transition-all hover:opacity-80"
                style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: '8px' }}
              />
              <span className="text-xs text-[var(--text-muted)]">{d.month}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Umsatz nach Kategorie</CardTitle></CardHeader>
          {[
            { cat: 'Smartphones', pct: 35 },
            { cat: 'Laptops', pct: 25 },
            { cat: 'TV & Audio', pct: 20 },
            { cat: 'Gaming', pct: 12 },
            { cat: 'Sonstige', pct: 8 },
          ].map((item) => (
            <div key={item.cat} className="mb-3">
              <div className="mb-1 flex justify-between text-sm">
                <span>{item.cat}</span><span className="font-medium">{item.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-tertiary)]">
                <div className="h-full rounded-full bg-primary" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <CardHeader><CardTitle>Bestellungen pro Monat</CardTitle></CardHeader>
          <div className="space-y-2">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex items-center justify-between rounded-lg bg-[var(--bg-tertiary)] px-3 py-2 text-sm">
                <span>{d.month} 2026</span>
                <span className="font-semibold">{d.orders} Bestellungen</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
