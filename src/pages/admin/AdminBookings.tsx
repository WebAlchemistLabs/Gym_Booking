import { useState } from 'react'
import { LayoutDashboard, Users, Calendar, BarChart2, Settings, Search, CalendarX } from 'lucide-react'
import DashboardLayout, { DashPageHeader } from '../../components/layout/DashboardLayout'
import { BookingBadge, ConfirmModal, EmptyState } from '../../components/admin/AdminUI'
import { adminStyles as s } from '../../components/admin/AdminUI'
import { useToast } from '../../context/ToastContext'
import { mockBookings } from '../../data/mockAuth'
import type { BookingStatus, HistoricalBooking } from '../../types'
import { cn } from '../../utils'

const navItems = [
  { label: 'Overview', href: '/admin', exact: true, icon: <LayoutDashboard size={15} /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <Calendar size={15} /> },
  { label: 'Members',  href: '/admin/members',  icon: <Users size={15} /> },
  { label: 'Classes',  href: '/admin/classes',  icon: <BarChart2 size={15} /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={15} /> },
]

export default function AdminBookings() {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const [bookings, setBookings] = useState<HistoricalBooking[]>(mockBookings)
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [completeId, setCompleteId] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])

  const filtered = bookings.filter(b => {
    const matchSearch = !search || b.memberName.toLowerCase().includes(search.toLowerCase()) || b.className.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  const updateStatus = (id: string, status: BookingStatus) =>
    setBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b))

  const handleCancel = () => { if (cancelId) { updateStatus(cancelId, 'cancelled'); setCancelId(null); toast('Booking cancelled.', 'success') } }
  const handleComplete = () => { if (completeId) { updateStatus(completeId, 'completed'); setCompleteId(null); toast('Marked as completed.', 'success') } }
  const handleBulkCancel = () => {
    setBookings(bs => bs.map(b => selected.includes(b.id) ? { ...b, status: 'cancelled' as BookingStatus } : b))
    toast(`${selected.length} booking(s) cancelled.`, 'success')
    setSelected([])
  }

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(b => b.id))

  return (
    <DashboardLayout eyebrow="Admin" title="Control Panel" navItems={navItems}>
      <DashPageHeader eyebrow="Admin Panel" title="Booking Management" subtitle={`${bookings.length} total bookings.`} />

      <div className={s.filterRow}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input className={s.filterInput} style={{ paddingLeft: '36px', width: '100%' }} placeholder="Search member or class..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className={s.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-show</option>
        </select>
        {selected.length > 0 && (
          <button onClick={handleBulkCancel} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '9px 16px', border: '1px solid rgba(201,122,110,0.4)', borderRadius: 'var(--radius-sm)', background: 'none', color: 'var(--color-error)', cursor: 'pointer' }}>
            Cancel {selected.length} Selected
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<CalendarX size={40} />} title="No bookings found" text="Try adjusting your search or filter." />
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th className={s.tableTh}><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} style={{ cursor: 'pointer' }} /></th>
              <th className={s.tableTh}>Member</th>
              <th className={s.tableTh}>Class</th>
              <th className={s.tableTh}>Trainer</th>
              <th className={s.tableTh}>Date</th>
              <th className={s.tableTh}>Time</th>
              <th className={s.tableTh}>Price</th>
              <th className={s.tableTh}>Status</th>
              <th className={s.tableTh}>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td className={s.tableTd}><input type="checkbox" checked={selected.includes(b.id)} onChange={() => toggleSelect(b.id)} style={{ cursor: 'pointer' }} /></td>
                  <td className={cn(s.tableTd, s.tableTdPrimary)}>{b.memberName}</td>
                  <td className={s.tableTd}>{b.className}</td>
                  <td className={s.tableTd}>{b.trainer}</td>
                  <td className={s.tableTd}>{b.date}</td>
                  <td className={s.tableTd}>{b.time}</td>
                  <td className={s.tableTd}>${b.price}</td>
                  <td className={s.tableTd}><BookingBadge status={b.status} /></td>
                  <td className={s.tableTd}>
                    <div className={s.tableActions}>
                      {b.status === 'confirmed' && (
                        <>
                          <button className={s.tableActionBtn} onClick={() => setCompleteId(b.id)}>Complete</button>
                          <button className={cn(s.tableActionBtn, s.tableActionBtnDanger)} onClick={() => setCancelId(b.id)}>Cancel</button>
                          <button className={cn(s.tableActionBtn, s.tableActionBtnDanger)} onClick={() => { updateStatus(b.id, 'no-show'); toast('Marked as no-show.', 'info') }}>No-show</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {cancelId && <ConfirmModal title="Cancel this booking?" text="This will cancel the reservation and notify the member." confirmLabel="Cancel Booking" onConfirm={handleCancel} onCancel={() => setCancelId(null)} />}
      {completeId && <ConfirmModal title="Mark as completed?" text="This will mark the session as attended and completed." confirmLabel="Mark Complete" dangerous={false} onConfirm={handleComplete} onCancel={() => setCompleteId(null)} />}
    </DashboardLayout>
  )
}
