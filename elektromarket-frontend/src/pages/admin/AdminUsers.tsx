import { useState } from 'react'
import { Search, MoreHorizontal } from 'lucide-react'
import { SEOHead } from '../../components/ui/SEOHead'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { mockUsers } from '../../data/mockData'
import type { User } from '../../types'

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const users = mockUsers.filter((u) =>
    u.email.includes(search) || u.firstName.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: Column<User>[] = [
    { key: 'name', header: 'Name', render: (u) => `${u.firstName} ${u.lastName}` },
    { key: 'email', header: 'E-Mail' },
    {
      key: 'role', header: 'Rolle',
      render: (u) => <Badge variant={u.role === 'admin' ? 'primary' : 'default'}>{u.role}</Badge>,
    },
    {
      key: 'isVerified', header: 'Status',
      render: (u) => <Badge variant={u.isVerified ? 'success' : 'warning'}>{u.isVerified ? 'Verifiziert' : 'Ausstehend'}</Badge>,
    },
    {
      key: 'actions', header: '',
      render: () => (
        <button className="rounded p-1 hover:bg-[var(--bg-tertiary)]">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      ),
    },
  ]

  return (
    <>
      <SEOHead title="Benutzer verwalten" />
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Benutzer</h2>
      </div>
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <Input placeholder="Benutzer suchen..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>
      <DataTable columns={columns} data={users} keyExtractor={(u) => u.id} />
    </>
  )
}
