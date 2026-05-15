import { Calendar, Zap, CreditCard, Users, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardLayout, { DashPageHeader } from '../../components/layout/DashboardLayout'
import { TierBadge } from '../../components/admin/AdminUI'
import { useAuth } from '../../context/AuthContext'
import { memberships } from '../../data'

const navItems = [
  { label: 'Overview',    href: '/dashboard',            exact: true, icon: <Zap size={15}/> },
  { label: 'My Bookings', href: '/dashboard/bookings',               icon: <Calendar size={15}/> },
  { label: 'Membership',  href: '/dashboard/membership',             icon: <CreditCard size={15}/> },
  { label: 'Profile',     href: '/dashboard/profile',                icon: <Users size={15}/> },
]

export default function UserMembership() {
  const { user } = useAuth()
  const currentTier = memberships.find(m => m.name === user?.membershipTier)

  return (
    <DashboardLayout eyebrow="Member Portal" title="My Dashboard" navItems={navItems}>
      <DashPageHeader eyebrow="My Account" title="Membership" subtitle="Your current plan and available upgrades." />

      {currentTier && (
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>Current Plan</p>
          <div style={{ background: 'var(--color-base-elevated)', border: '1px solid var(--color-accent-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <TierBadge tier={currentTier.name as any} />
                <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '28px', color: 'var(--color-text-primary)' }}>{currentTier.name}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--color-text-primary)', lineHeight: 1 }}>
                ${currentTier.price}<span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>/{currentTier.period}</span>
              </p>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>Renewal Date</p>
              <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)' }}>{user?.membershipRenewal || 'February 14, 2026'}</p>
            </div>
            <Link to="/contact" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', background: 'none', border: '1px solid var(--color-base-border)', padding: '10px 20px', borderRadius: 'var(--radius-sm)', textDecoration: 'none' }}>
              Cancel Membership
            </Link>
          </div>
        </div>
      )}

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
        {currentTier ? 'Upgrade Options' : 'Choose a Plan'}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-5)' }}>
        {memberships.map(m => {
          const isCurrent = m.name === user?.membershipTier
          return (
            <div key={m.id} style={{ background: 'var(--color-base-elevated)', border: `1px solid ${isCurrent ? 'var(--color-accent-border)' : 'var(--color-base-border)'}`, borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', position: 'relative' }}>
              {isCurrent && <span style={{ position: 'absolute', top: '-1px', right: 'var(--space-5)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', background: 'var(--color-accent)', color: 'var(--color-base)', padding: '3px 10px', borderRadius: '0 0 var(--radius-sm) var(--radius-sm)' }}>Current Plan</span>}
              <div>
                <TierBadge tier={m.name as any} />
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '22px', color: 'var(--color-text-primary)', marginTop: 'var(--space-2)' }}>{m.name}</p>
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--color-text-primary)' }}>
                ${m.price}<span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>/{m.period}</span>
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
                {m.features.slice(0,5).map(f => (
                  <div key={f} style={{ display: 'flex', gap: 'var(--space-3)', fontSize: '12px', color: 'var(--color-text-secondary)', alignItems: 'flex-start' }}>
                    <Check size={12} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />{f}
                  </div>
                ))}
              </div>
              {isCurrent
                ? <div style={{ padding: '10px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)', border: '1px solid var(--color-accent-border)', borderRadius: 'var(--radius-sm)' }}>Active</div>
                : <Link to={`/checkout?tier=${m.name}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-base)', background: 'var(--color-accent)', padding: '11px', borderRadius: 'var(--radius-sm)', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                    {currentTier ? 'Switch Plan' : 'Select Plan'}
                  </Link>
              }
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
