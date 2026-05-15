import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, BarChart2, Settings, ChevronRight } from 'lucide-react'
import DashboardLayout, { DashPageHeader } from '../../components/layout/DashboardLayout'
import { StatCard, BookingBadge, RevenueChart } from '../../components/admin/AdminUI'
import { adminStyles as s } from '../../components/admin/AdminUI'
import { mockBookings, mockMembers, monthlyRevenue } from '../../data/mockAuth'
import { cn } from '../../utils'

const navItems = [
  { label: 'Overview', href: '/admin', exact: true, icon: <LayoutDashboard size={15} /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <Calendar size={15} /> },
  { label: 'Members',  href: '/admin/members',  icon: <Users size={15} /> },
  { label: 'Classes',  href: '/admin/classes',  icon: <BarChart2 size={15} /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={15} /> },
]

export default function AdminOverview() {
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t) }, [])

  const today = new Date().toISOString().split('T')[0]
  const thisMonth = today.slice(0, 7)
  const lastMonthDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
  const lastMonth = lastMonthDate.toISOString().slice(0, 7)
  const bookingsThisMonth = mockBookings.filter(b => b.date.startsWith(thisMonth))
  const bookingsLastMonth = mockBookings.filter(b => b.date.startsWith(lastMonth))
  const revenueThisMonth = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0
  const revenueLastMonth = monthlyRevenue[monthlyRevenue.length - 2]?.revenue || 0
  const revTrend = revenueLastMonth ? (((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100).toFixed(1) : '0'
  const activeMembers = mockMembers.filter(m => m.status === 'active').length
  const recentBookings = mockBookings.slice(0, 8)

  return (
    <DashboardLayout eyebrow="Admin" title="Control Panel" navItems={navItems}>
      <DashPageHeader eyebrow="Admin Panel" title="Overview" subtitle="NOIR GYM — business at a glance." />
      <div className={s.statsGrid}>
        <StatCard label="Active Members" value={activeMembers} trend="+3 this month" trendUp loading={loading} />
        <StatCard label="Bookings This Month" value={bookingsThisMonth.length} trend={`vs ${bookingsLastMonth.length} last month`} trendUp={bookingsThisMonth.length >= bookingsLastMonth.length} loading={loading} />
        <StatCard label="Revenue This Month" value={`$${revenueThisMonth.toLocaleString()}`} trend={`${Number(revTrend) >= 0 ? '+' : ''}${revTrend}% vs last month`} trendUp={Number(revTrend) >= 0} loading={loading} />
        <StatCard label="Classes Running" value="8" trend="All active" trendUp loading={loading} />
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <RevenueChart />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Recent Bookings</p>
          <Link to="/admin/bookings" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View all <ChevronRight size={13} />
          </Link>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th className={s.tableTh}>Member</th>
              <th className={s.tableTh}>Class</th>
              <th className={s.tableTh}>Date</th>
              <th className={s.tableTh}>Status</th>
              <th className={s.tableTh}>Price</th>
            </tr></thead>
            <tbody>
              {recentBookings.map(b => (
                <tr key={b.id}>
                  <td className={cn(s.tableTd, s.tableTdPrimary)}>{b.memberName}</td>
                  <td className={s.tableTd}>{b.className}</td>
                  <td className={s.tableTd}>{b.date}</td>
                  <td className={s.tableTd}><BookingBadge status={b.status} /></td>
                  <td className={s.tableTd}>${b.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
