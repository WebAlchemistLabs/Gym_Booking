import { useState } from 'react'
import { LayoutDashboard, Users, Calendar, BarChart2, Settings } from 'lucide-react'
import DashboardLayout, { DashPageHeader } from '../../components/layout/DashboardLayout'
import { useToast } from '../../context/ToastContext'

const navItems = [
  { label: 'Overview', href: '/admin', exact: true, icon: <LayoutDashboard size={15} /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <Calendar size={15} /> },
  { label: 'Members',  href: '/admin/members',  icon: <Users size={15} /> },
  { label: 'Classes',  href: '/admin/classes',  icon: <BarChart2 size={15} /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={15} /> },
]

const iStyle = { background: 'var(--color-base-elevated)', border: '1px solid var(--color-base-border)', borderRadius: 'var(--radius-sm)', padding: '11px 14px', fontSize: '14px', color: 'var(--color-text-primary)', outline: 'none', width: '100%', fontFamily: 'var(--font-body)' }
const lStyle: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }
const sStyle = { background: 'var(--color-base-elevated)', border: '1px solid var(--color-base-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }
const stStyle: React.CSSProperties = { fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '20px', color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)' }

export default function AdminSettings() {
  const { toast } = useToast()
  const [gym, setGym] = useState({ name: 'NOIR GYM', email: 'hello@noirgym.com', phone: '+1 (416) 555-0192', address: '220 King St W, Suite 400, Toronto, ON' })
  const [policy, setPolicy] = useState({ cancellationHours: '4', noShowFee: '15', advanceBookingDays: '7', trialClasses: '1' })

  return (
    <DashboardLayout eyebrow="Admin" title="Control Panel" navItems={navItems}>
      <DashPageHeader eyebrow="Admin Panel" title="Settings" subtitle="Configure gym operations and policies." />
      <div style={{ maxWidth: '640px' }}>
        <div style={sStyle}>
          <p style={stStyle}>Gym Information</p>
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            {([['Gym Name','name'],['Contact Email','email'],['Phone Number','phone'],['Address','address']] as [string,string][]).map(([label, key]) => (
              <div key={key}>
                <label style={lStyle}>{label}</label>
                <input style={iStyle} value={gym[key as keyof typeof gym]} onChange={e => setGym(g => ({ ...g, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <button onClick={() => toast('Gym information saved.', 'success')} style={{ marginTop: 'var(--space-6)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-base)', background: 'var(--color-accent)', border: 'none', padding: '11px 24px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
            Save Information
          </button>
        </div>
        <div style={sStyle}>
          <p style={stStyle}>Booking Policy</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            {([['Cancellation Window (hours)','cancellationHours'],['Late Cancel Fee ($)','noShowFee'],['Advance Booking (days)','advanceBookingDays'],['Free Trial Classes','trialClasses']] as [string,string][]).map(([label, key]) => (
              <div key={key}>
                <label style={lStyle}>{label}</label>
                <input style={iStyle} type="number" value={policy[key as keyof typeof policy]} onChange={e => setPolicy(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <button onClick={() => toast('Booking policy saved.', 'success')} style={{ marginTop: 'var(--space-6)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-base)', background: 'var(--color-accent)', border: 'none', padding: '11px 24px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
            Save Policy
          </button>
        </div>
        <div style={{ ...sStyle, border: '1px solid rgba(201,122,110,0.3)' }}>
          <p style={{ ...stStyle, color: 'var(--color-error)' }}>Danger Zone</p>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)', lineHeight: '1.6' }}>These actions are irreversible. Proceed with caution.</p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {['Clear All Bookings', 'Reset Member Data', 'Export Data (CSV)'].map(label => (
              <button key={label} onClick={() => toast('Demo mode — action disabled.', 'info')} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '10px 18px', border: '1px solid rgba(201,122,110,0.3)', borderRadius: 'var(--radius-sm)', background: 'none', color: 'var(--color-error)', cursor: 'pointer' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
