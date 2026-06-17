import { Trash2 } from 'lucide-react'
import { SEOHead } from '../../components/ui/SEOHead'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { RatingStars } from '../../components/ui/RatingStars'
import { Badge } from '../../components/ui/Badge'
import { formatDate } from '../../utils/formatPrice'
import type { Review } from '../../types'

const mockReviews: Review[] = [
  { id: '1', productId: '1', userId: '1', userName: 'Max M.', rating: 5, title: 'Hervorragend!', comment: 'Bestes Smartphone, das ich je hatte.', isVerified: true, createdAt: '2026-05-10' },
  { id: '2', productId: '2', userId: '2', userName: 'Anna K.', rating: 4, title: 'Sehr gut', comment: 'Leistungsstark, aber etwas teuer.', isVerified: true, createdAt: '2026-05-12' },
  { id: '3', productId: '4', userId: '3', userName: 'Tom S.', rating: 5, title: 'Gaming-Perfektion', comment: 'Unschlagbare Performance.', isVerified: false, createdAt: '2026-05-18' },
]

export default function AdminReviews() {
  const columns: Column<Review>[] = [
    { key: 'userName', header: 'Benutzer' },
    { key: 'title', header: 'Titel' },
    { key: 'rating', header: 'Bewertung', render: (r) => <RatingStars rating={r.rating} size="sm" /> },
    {
      key: 'isVerified', header: 'Verifiziert',
      render: (r) => <Badge variant={r.isVerified ? 'success' : 'warning'}>{r.isVerified ? 'Ja' : 'Nein'}</Badge>,
    },
    { key: 'createdAt', header: 'Datum', render: (r) => formatDate(r.createdAt) },
    {
      key: 'actions', header: '',
      render: () => (
        <button className="rounded p-1 text-danger hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
      ),
    },
  ]

  return (
    <>
      <SEOHead title="Bewertungen" />
      <h2 className="mb-6 text-2xl font-bold text-[var(--text-primary)]">Bewertungen</h2>
      <DataTable columns={columns} data={mockReviews} keyExtractor={(r) => r.id} />
    </>
  )
}
