import { useState } from 'react'
import { LayoutDashboard, Users, Calendar, BarChart2, Settings } from 'lucide-react'
import DashboardLayout, { DashPageHeader } from '../../components/layout/DashboardLayout'
import { useToast } from '../../context/ToastContext'
import { gymClasses } from '../../data'
import { mockBookings } from '../../data/mockAuth'

const navItems = [
  { label: 'Overview', href: '/admin', exact: true, icon: <LayoutDashboard size={15} /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <Calendar size={15} /> },
  { label: 'Members',  href: '/admin/members',  icon: <Users size={15} /> },
  { label: 'Classes',  href: '/admin/classes',  icon: <BarChart2 size={15} /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={15} /> },
]

export default function AdminClasses() {
  const { toast } = useToast()
  const [classes, setClasses] = useState(gymClasses)

  const adjustSpots = (id: string, delta: number) => {
    setClasses(cs => cs.map(c => {
      if (c.id !== id) return c
      const newRemaining = Math.max(0, Math.min(c.spotsTotal, c.spotsRemaining + delta))
      return { ...c, spotsRemaining: newRemaining }
    }))
    toast('Spots updated.', 'success')
  }

  return (
    <DashboardLayout eyebrow="Admin" title="Control Panel" navItems={navItems}>
      <DashPageHeader eyebrow="Admin Panel" title="Class Management" subtitle="Monitor class capacity and availability." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
        {classes.map(c => {
          const filled = c.spotsTotal - c.spotsRemaining
          const pct = Math.round((filled / c.spotsTotal) * 100)
          const color = pct >= 80 ? 'var(--color-error)' : pct >= 50 ? 'var(--color-gold)' : 'var(--color-accent)'
          const totalBookings = mockBookings.filter(b => b.classId === c.id && b.status !== 'cancelled').length
          return (
            <div key={c.id} style={{ background: 'var(--color-base-elevated)', border: '1px solid var(--color-base-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '18px', color: 'var(--color-text-primary)' }}>{c.name}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-accent)', marginTop: '2px' }}>{c.trainer}</p>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '999px', background: 'var(--color-base-soft)', border: '1px solid var(--color-base-border)', color: 'var(--color-text-muted)' }}>{c.category}</span>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Capacity</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color }}>{filled}/{c.spotsTotal} spots filled</span>
                </div>
                <div style={{ height: '4px', background: 'var(--color-base-border)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '999px', transition: 'width 0.3s ease' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                <span>{c.schedule.days.join(', ')}</span><span>·</span>
                <span>{c.schedule.time}</span><span>·</span>
                <span>{totalBookings} bookings</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {c.spotsRemaining} remaining
                </span>
                <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                  <button onClick={() => adjustSpots(c.id, -1)} disabled={c.spotsRemaining === 0}
                    style={{ width: '28px', height: '28px', border: '1px solid var(--color-base-border)', borderRadius: 'var(--radius-sm)', background: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <button onClick={() => adjustSpots(c.id, 1)} disabled={c.spotsRemaining === c.spotsTotal}
                    style={{ width: '28px', height: '28px', border: '1px solid var(--color-base-border)', borderRadius: 'var(--radius-sm)', background: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  <button onClick={() => toast('Availability toggled.', 'info')}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px', border: '1px solid var(--color-base-border)', borderRadius: 'var(--radius-sm)', background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                    Toggle
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
