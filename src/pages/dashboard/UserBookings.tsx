import { useState } from 'react'
import { Calendar, Zap, CreditCard, Users, CalendarX } from 'lucide-react'
import DashboardLayout, { DashPageHeader } from '../../components/layout/DashboardLayout'
import { BookingBadge, EmptyState, ConfirmModal } from '../../components/admin/AdminUI'
import { adminStyles as s } from '../../components/admin/AdminUI'
import { useToast } from '../../context/ToastContext'
import { mockBookings } from '../../data/mockAuth'
import { cn } from '../../utils'
import styles from './Dashboard.module.css'

const navItems = [
  { label: 'Overview',    href: '/dashboard',            exact: true, icon: <Zap size={15}/> },
  { label: 'My Bookings', href: '/dashboard/bookings',               icon: <Calendar size={15}/> },
  { label: 'Membership',  href: '/dashboard/membership',             icon: <CreditCard size={15}/> },
  { label: 'Profile',     href: '/dashboard/profile',                icon: <Users size={15}/> },
]

export default function UserBookings() {
  const { toast } = useToast()
  const [tab, setTab] = useState<'upcoming'|'past'>('upcoming')
  const [cancelId, setCancelId] = useState<string|null>(null)
  const [cancelled, setCancelled] = useState<string[]>([])

  const today = new Date().toISOString().split('T')[0]
  const myBookings = mockBookings.filter(b => b.memberId === 'usr-001')
  const upcoming = myBookings.filter(b => b.status === 'confirmed' && b.date >= today && !cancelled.includes(b.id)).sort((a,b) => a.date.localeCompare(b.date))
  const past = myBookings.filter(b => b.status !== 'confirmed' || b.date < today || cancelled.includes(b.id)).sort((a,b) => b.date.localeCompare(a.date))

  const handleCancel = () => {
    if (!cancelId) return
    setCancelled(c => [...c, cancelId])
    setCancelId(null)
    toast('Booking cancelled successfully.', 'success')
  }

  return (
    <DashboardLayout eyebrow="Member Portal" title="My Dashboard" navItems={navItems}>
      <DashPageHeader eyebrow="My Account" title="My Bookings" subtitle="Manage your upcoming and past class bookings." />
      <div className={styles.bookingsHeader}>
        <button className={cn(styles.tabBtn, tab==='upcoming' && styles.tabBtnActive)} onClick={() => setTab('upcoming')}>Upcoming ({upcoming.length})</button>
        <button className={cn(styles.tabBtn, tab==='past' && styles.tabBtnActive)} onClick={() => setTab('past')}>Past ({past.length})</button>
      </div>

      {tab === 'upcoming' && (
        upcoming.length === 0
          ? <EmptyState icon={<CalendarX size={40}/>} title="No upcoming bookings" text="You don't have any classes booked. Head to the schedule and find your next session." />
          : <div className={s.tableWrap}>
              <table className={s.table}>
                <thead><tr>
                  <th className={s.tableTh}>Class</th><th className={s.tableTh}>Trainer</th>
                  <th className={s.tableTh}>Date</th><th className={s.tableTh}>Time</th>
                  <th className={s.tableTh}>Status</th><th className={s.tableTh}>Action</th>
                </tr></thead>
                <tbody>
                  {upcoming.map(b => (
                    <tr key={b.id}>
                      <td className={cn(s.tableTd,s.tableTdPrimary)}>{b.className}</td>
                      <td className={s.tableTd}>{b.trainer}</td>
                      <td className={s.tableTd}>{new Date(b.date+'T12:00:00').toLocaleDateString('en-CA',{weekday:'short',month:'short',day:'numeric'})}</td>
                      <td className={s.tableTd}>{b.time}</td>
                      <td className={s.tableTd}><BookingBadge status={b.status}/></td>
                      <td className={s.tableTd}><button className={cn(s.tableActionBtn,s.tableActionBtnDanger)} onClick={() => setCancelId(b.id)}>Cancel</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      )}

      {tab === 'past' && (
        past.length === 0
          ? <EmptyState icon={<CalendarX size={40}/>} title="No past bookings" text="Your booking history will appear here." />
          : <div className={s.tableWrap}>
              <table className={s.table}>
                <thead><tr>
                  <th className={s.tableTh}>Class</th><th className={s.tableTh}>Trainer</th>
                  <th className={s.tableTh}>Date</th><th className={s.tableTh}>Time</th>
                  <th className={s.tableTh}>Price</th><th className={s.tableTh}>Status</th>
                </tr></thead>
                <tbody>
                  {past.map(b => (
                    <tr key={b.id}>
                      <td className={cn(s.tableTd,s.tableTdPrimary)}>{b.className}</td>
                      <td className={s.tableTd}>{b.trainer}</td>
                      <td className={s.tableTd}>{new Date(b.date+'T12:00:00').toLocaleDateString('en-CA',{month:'short',day:'numeric',year:'numeric'})}</td>
                      <td className={s.tableTd}>{b.time}</td>
                      <td className={s.tableTd}>${b.price}</td>
                      <td className={s.tableTd}><BookingBadge status={cancelled.includes(b.id)?'cancelled':b.status}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      )}

      {cancelId && <ConfirmModal title="Cancel this booking?" text="This will cancel your reservation. A $15 late cancellation fee may apply per our policy." confirmLabel="Yes, Cancel" onConfirm={handleCancel} onCancel={() => setCancelId(null)} />}
    </DashboardLayout>
  )
}
