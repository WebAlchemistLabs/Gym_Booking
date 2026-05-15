import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, CreditCard, Zap, Users, ChevronRight } from 'lucide-react'
import DashboardLayout, { DashPageHeader } from '../../components/layout/DashboardLayout'
import { StatCard, BookingBadge, TierBadge } from '../../components/admin/AdminUI'
import { useAuth } from '../../context/AuthContext'
import { mockBookings } from '../../data/mockAuth'
import { memberships } from '../../data'
import styles from './Dashboard.module.css'

const navItems = [
  { label: 'Overview',   href: '/dashboard',            exact: true, icon: <Zap size={15} /> },
  { label: 'My Bookings',href: '/dashboard/bookings',                icon: <Calendar size={15} /> },
  { label: 'Membership', href: '/dashboard/membership',              icon: <CreditCard size={15} /> },
  { label: 'Profile',    href: '/dashboard/profile',                 icon: <Users size={15} /> },
]

export default function UserDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t) }, [])

  const today = new Date().toISOString().split('T')[0]
  const myBookings = mockBookings.filter(b => b.memberId === 'usr-001')
  const upcoming = myBookings.filter(b => b.status === 'confirmed' && b.date >= today)
  const completed = myBookings.filter(b => b.status === 'completed')
  const currentTier = memberships.find(m => m.name === user?.membershipTier)

  return (
    <DashboardLayout eyebrow="Member Portal" title="My Dashboard" navItems={navItems}>
      <DashPageHeader eyebrow="Welcome back" title={`${user?.firstName} ${user?.lastName}`} subtitle="Here's a summary of your NOIR membership." />
      <div className={styles.statsRow}>
        <StatCard label="Upcoming" value={upcoming.length} trend="Confirmed classes" loading={loading} icon={<Calendar size={18}/>} />
        <StatCard label="Attended" value={completed.length} trend="All time" trendUp loading={loading} icon={<Zap size={18}/>} />
        <StatCard label="Membership" value={user?.membershipTier || 'None'} trend="Active" trendUp loading={loading} icon={<CreditCard size={18}/>} />
        <StatCard label="Member Since" value={user?.memberSince || '—'} loading={loading} icon={<Users size={18}/>} />
      </div>
      <div className={styles.dashGrid}>
        {/* Upcoming bookings */}
        <div className={styles.dashCard}>
          <div className={styles.dashCardHeader}>
            <h3 className={styles.dashCardTitle}>Upcoming Classes</h3>
            <Link to="/dashboard/bookings" className={styles.dashCardLink}>View all <ChevronRight size={13}/></Link>
          </div>
          {upcoming.length === 0 ? (
            <p className={styles.dashCardEmpty}>No upcoming bookings. <Link to="/booking" className={styles.inlineLink}>Book a class →</Link></p>
          ) : (
            <div className={styles.upcomingList}>
              {upcoming.slice(0,3).map(b => (
                <div key={b.id} className={styles.upcomingItem}>
                  <div className={styles.upcomingDateBadge}>
                    <span className={styles.upcomingDateDay}>{new Date(b.date+'T12:00:00').getDate()}</span>
                    <span className={styles.upcomingDateMonth}>{new Date(b.date+'T12:00:00').toLocaleString('en',{month:'short'})}</span>
                  </div>
                  <div className={styles.upcomingInfo}>
                    <p className={styles.upcomingName}>{b.className}</p>
                    <p className={styles.upcomingMeta}>{b.trainer} · {b.time}</p>
                  </div>
                  <BookingBadge status={b.status} />
                </div>
              ))}
            </div>
          )}
          <Link to="/booking" className={styles.dashCardCta}>Book a Class</Link>
        </div>
        {/* Membership card */}
        <div className={styles.dashCard}>
          <div className={styles.dashCardHeader}>
            <h3 className={styles.dashCardTitle}>Your Membership</h3>
            <Link to="/dashboard/membership" className={styles.dashCardLink}>Manage <ChevronRight size={13}/></Link>
          </div>
          {currentTier ? (
            <div className={styles.membershipCardInner}>
              <div className={styles.membershipCardName}>
                <TierBadge tier={currentTier.name as any} />
                <span className={styles.membershipCardTierName}>{currentTier.name}</span>
              </div>
              <p className={styles.membershipCardPrice}>
                <span className={styles.membershipCardAmount}>${currentTier.price}</span>
                <span className={styles.membershipCardPeriod}>/{currentTier.period}</span>
              </p>
              <div className={styles.membershipCardRenewal}>
                <span className={styles.membershipCardRenewalLabel}>Renews</span>
                <span className={styles.membershipCardRenewalDate}>{user?.membershipRenewal || 'Feb 14, 2026'}</span>
              </div>
              <div className={styles.membershipFeatures}>
                {currentTier.features.slice(0,4).map(f => (
                  <div key={f} className={styles.membershipFeatureRow}>
                    <span className={styles.membershipFeatureDot}/>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className={styles.dashCardEmpty}>No active membership.</p>
              <Link to="/checkout" className={styles.dashCardCta}>Join Now</Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
