import { useState } from 'react'
import { LayoutDashboard, Users, Calendar, BarChart2, Settings, Search, UserX } from 'lucide-react'
import DashboardLayout, { DashPageHeader } from '../../components/layout/DashboardLayout'
import { MemberBadge, TierBadge, ConfirmModal, EmptyState } from '../../components/admin/AdminUI'
import { adminStyles as s } from '../../components/admin/AdminUI'
import { useToast } from '../../context/ToastContext'
import { mockMembers, mockBookings } from '../../data/mockAuth'
import type { Member } from '../../types'
import { cn } from '../../utils'

const navItems = [
  { label: 'Overview', href: '/admin', exact: true, icon: <LayoutDashboard size={15} /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <Calendar size={15} /> },
  { label: 'Members',  href: '/admin/members',  icon: <Users size={15} /> },
  { label: 'Classes',  href: '/admin/classes',  icon: <BarChart2 size={15} /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={15} /> },
]

export default function AdminMembers() {
  const { toast } = useToast()
  const [members, setMembers] = useState<Member[]>(mockMembers)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [suspendId, setSuspendId] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const filtered = members.filter(m => {
    const name = `${m.firstName} ${m.lastName}`.toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
    const matchTier = tierFilter === 'all' || m.tier === tierFilter
    const matchStatus = statusFilter === 'all' || m.status === statusFilter
    return matchSearch && matchTier && matchStatus
  })

  const changeTier = (id: string, tier: Member['tier']) => {
    setMembers(ms => ms.map(m => m.id === id ? { ...m, tier } : m))
    toast('Membership tier updated.', 'success')
  }

  const toggleSuspend = () => {
    if (!suspendId) return
    const m = members.find(m => m.id === suspendId)
    const newStatus = m?.status === 'suspended' ? 'active' as const : 'suspended' as const
    setMembers(ms => ms.map(m => m.id === suspendId ? { ...m, status: newStatus } : m))
    setSuspendId(null)
    toast(`Member ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}.`, newStatus === 'suspended' ? 'error' : 'success')
  }

  const memberBookings = selectedMember
    ? mockBookings.filter(b => b.memberId === selectedMember.id).slice(0, 10)
    : []

  const suspending = suspendId ? members.find(m => m.id === suspendId)?.status !== 'suspended' : false

  return (
    <DashboardLayout eyebrow="Admin" title="Control Panel" navItems={navItems}>
      <DashPageHeader eyebrow="Admin Panel" title="Member Management" subtitle={`${members.length} total members.`} />

      <div className={s.filterRow}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input className={s.filterInput} style={{ paddingLeft: '36px', width: '100%' }} placeholder="Search name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className={s.filterSelect} value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
          <option value="all">All Tiers</option>
          <option value="Initiate">Initiate</option>
          <option value="Adept">Adept</option>
          <option value="Sovereign">Sovereign</option>
        </select>
        <select className={s.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<UserX size={40} />} title="No members found" text="Try adjusting your search or filters." />
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th className={s.tableTh}>Name</th>
              <th className={s.tableTh}>Email</th>
              <th className={s.tableTh}>Tier</th>
              <th className={s.tableTh}>Status</th>
              <th className={s.tableTh}>Joined</th>
              <th className={s.tableTh}>Bookings</th>
              <th className={s.tableTh}>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id}>
                  <td className={cn(s.tableTd, s.tableTdPrimary)} style={{ cursor: 'pointer' }} onClick={() => setSelectedMember(m)}>{m.firstName} {m.lastName}</td>
                  <td className={s.tableTd}>{m.email}</td>
                  <td className={s.tableTd}><TierBadge tier={m.tier} /></td>
                  <td className={s.tableTd}><MemberBadge status={m.status} /></td>
                  <td className={s.tableTd}>{m.joinDate}</td>
                  <td className={s.tableTd}>{m.totalBookings}</td>
                  <td className={s.tableTd}>
                    <div className={s.tableActions}>
                      <button className={s.tableActionBtn} onClick={() => setSelectedMember(m)}>View</button>
                      <select value={m.tier} onChange={e => changeTier(m.id, e.target.value as Member['tier'])}
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', background: 'var(--color-base-soft)', border: '1px solid var(--color-base-border)', borderRadius: 'var(--radius-sm)', padding: '4px 8px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                        <option value="Initiate">Initiate</option>
                        <option value="Adept">Adept</option>
                        <option value="Sovereign">Sovereign</option>
                      </select>
                      <button className={cn(s.tableActionBtn, m.status !== 'suspended' && s.tableActionBtnDanger)} onClick={() => setSuspendId(m.id)}>
                        {m.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)' }} onClick={() => setSelectedMember(null)}>
          <div style={{ background: 'var(--color-base-elevated)', border: '1px solid var(--color-base-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '24px', color: 'var(--color-text-primary)' }}>{selectedMember.firstName} {selectedMember.lastName}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{selectedMember.email}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <TierBadge tier={selectedMember.tier} />
                  <MemberBadge status={selectedMember.status} />
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              {([['Phone', selectedMember.phone], ['Join Date', selectedMember.joinDate], ['Renewal', selectedMember.renewalDate], ['Total Bookings', String(selectedMember.totalBookings)]] as [string,string][]).map(([label, value]) => (
                <div key={label} style={{ background: 'var(--color-base-soft)', border: '1px solid var(--color-base-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{label}</p>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>Recent Bookings</p>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead><tr><th className={s.tableTh}>Class</th><th className={s.tableTh}>Date</th><th className={s.tableTh}>Status</th></tr></thead>
                <tbody>
                  {memberBookings.length === 0 ? (
                    <tr><td className={s.tableTd} colSpan={3} style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No bookings found</td></tr>
                  ) : memberBookings.map(b => (
                    <tr key={b.id}>
                      <td className={cn(s.tableTd, s.tableTdPrimary)}>{b.className}</td>
                      <td className={s.tableTd}>{b.date}</td>
                      <td className={s.tableTd}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '999px', border: '1px solid var(--color-base-border)', color: 'var(--color-text-muted)' }}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {suspendId && (
        <ConfirmModal
          title={suspending ? 'Suspend this member?' : 'Reactivate member?'}
          text={suspending ? 'This will prevent the member from making new bookings.' : 'This will restore full access for this member.'}
          confirmLabel={suspending ? 'Suspend' : 'Reactivate'}
          dangerous={suspending}
          onConfirm={toggleSuspend}
          onCancel={() => setSuspendId(null)}
        />
      )}
    </DashboardLayout>
  )
}
