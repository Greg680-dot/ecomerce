import { TrendingUp, ShoppingBag, Users, Package, ArrowUp, ArrowDown } from 'lucide-react'
import { SEOHead } from '../../components/ui/SEOHead'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { formatPrice } from '../../utils/formatPrice'
import { mockOrders } from '../../data/mockData'

const stats = [
  { label: 'Umsatz', value: formatPrice(284750), change: 12.5, icon: TrendingUp },
  { label: 'Bestellungen', value: '1.247', change: 8.3, icon: ShoppingBag },
  { label: 'Kunden', value: '3.891', change: 15.2, icon: Users },
  { label: 'Produkte', value: '856', change: -2.1, icon: Package },
]

export default function AdminDashboard() {
  return (
    <>
      <SEOHead title="Admin Dashboard" />
      <h2 className="mb-6 text-2xl font-bold text-[var(--text-primary)]">Dashboard</h2>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                <div className={`mt-2 flex items-center gap-1 text-xs ${stat.change >= 0 ? 'text-success' : 'text-danger'}`}>
                  {stat.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(stat.change)}% vs. letzter Monat
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Letzte Bestellungen</CardTitle></CardHeader>
          <div className="space-y-3">
            {mockOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg bg-[var(--bg-tertiary)] p-3">
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-[var(--text-muted)]">{order.items[0]?.productName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{formatPrice(order.total)}</p>
                  <Badge variant="success" className="mt-1">Zugestellt</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Produkte</CardTitle></CardHeader>
          <div className="space-y-3">
            {[
              { name: 'Samsung Galaxy S25 Ultra', sales: 89, revenue: 115691 },
              { name: 'MacBook Pro 14" M4', sales: 45, revenue: 112455 },
              { name: 'PlayStation 5 Pro', sales: 112, revenue: 83999 },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-[var(--bg-tertiary)] p-3">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{p.sales} verkauft</p>
                </div>
                <p className="text-sm font-bold text-primary">{formatPrice(p.revenue)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
