import { useState } from 'react'
import { Calendar, Zap, CreditCard, Users } from 'lucide-react'
import DashboardLayout, { DashPageHeader } from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { cn } from '../../utils'
import styles from './Dashboard.module.css'

const navItems = [
  { label: 'Overview',    href: '/dashboard',            exact: true, icon: <Zap size={15}/> },
  { label: 'My Bookings', href: '/dashboard/bookings',               icon: <Calendar size={15}/> },
  { label: 'Membership',  href: '/dashboard/membership',             icon: <CreditCard size={15}/> },
  { label: 'Profile',     href: '/dashboard/profile',                icon: <Users size={15}/> },
]

export default function UserProfile() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [form, setForm] = useState({ firstName: user?.firstName||'', lastName: user?.lastName||'', email: user?.email||'', phone: user?.phone||'' })
  const [notifs, setNotifs] = useState(user?.notifications || { email: true, sms: false, reminders: true, promotions: false })
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })

  const saveProfile = () => { updateUser({ firstName: form.firstName, lastName: form.lastName, phone: form.phone }); toast('Profile updated.', 'success') }
  const saveNotifs = () => { updateUser({ notifications: notifs }); toast('Preferences saved.', 'success') }
  const savePw = () => {
    if (pw.next !== pw.confirm) { toast('Passwords do not match.', 'error'); return }
    if (pw.next.length < 6) { toast('Password must be at least 6 characters.', 'error'); return }
    toast('Password updated.', 'success')
    setPw({ current: '', next: '', confirm: '' })
  }

  const notifItems = [
    { key: 'email', label: 'Email notifications', desc: 'Booking confirmations and receipts' },
    { key: 'sms', label: 'SMS notifications', desc: 'Text reminders for upcoming classes' },
    { key: 'reminders', label: 'Class reminders', desc: '2 hours before each class' },
    { key: 'promotions', label: 'Promotions & events', desc: 'Member-only offers and announcements' },
  ]

  return (
    <DashboardLayout eyebrow="Member Portal" title="My Dashboard" navItems={navItems}>
      <DashPageHeader eyebrow="My Account" title="Profile Settings" subtitle="Manage your personal information and preferences." />

      <div style={{ marginBottom: 'var(--space-10)' }}>
        <p className={styles.sectionLabel}>Personal Information</p>
        <div className={styles.profileForm}>
          <div className={styles.profileFormRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>First Name</label>
              <input className={styles.formInput} value={form.firstName} onChange={e => setForm(f => ({...f, firstName: e.target.value}))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Last Name</label>
              <input className={styles.formInput} value={form.lastName} onChange={e => setForm(f => ({...f, lastName: e.target.value}))} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email Address</label>
            <input className={styles.formInput} value={form.email} disabled />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone Number</label>
            <input className={styles.formInput} value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+1 (416) 555-0000" />
          </div>
          <button className={styles.saveBtn} onClick={saveProfile}>Save Changes</button>
        </div>
      </div>

      <div className={styles.sectionDivider} />

      <div style={{ marginBottom: 'var(--space-10)', marginTop: 'var(--space-8)' }}>
        <p className={styles.sectionLabel}>Change Password</p>
        <div className={styles.profileForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Current Password</label>
            <input type="password" className={styles.formInput} value={pw.current} onChange={e => setPw(p => ({...p, current: e.target.value}))} placeholder="••••••••" />
          </div>
          <div className={styles.profileFormRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>New Password</label>
              <input type="password" className={styles.formInput} value={pw.next} onChange={e => setPw(p => ({...p, next: e.target.value}))} placeholder="Min. 6 characters" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Confirm Password</label>
              <input type="password" className={styles.formInput} value={pw.confirm} onChange={e => setPw(p => ({...p, confirm: e.target.value}))} placeholder="Repeat" />
            </div>
          </div>
          <button className={styles.saveBtn} onClick={savePw}>Update Password</button>
        </div>
      </div>

      <div className={styles.sectionDivider} />

      <div style={{ marginTop: 'var(--space-8)' }}>
        <p className={styles.sectionLabel}>Notification Preferences</p>
        <div style={{ maxWidth: '480px' }}>
          {notifItems.map(item => (
            <div key={item.key} className={styles.toggleRow}>
              <div>
                <p className={styles.toggleLabel}>{item.label}</p>
                <p className={styles.toggleDesc}>{item.desc}</p>
              </div>
              <button
                className={cn(styles.toggle, notifs[item.key as keyof typeof notifs] && styles.toggleOn)}
                onClick={() => setNotifs(n => ({...n, [item.key]: !n[item.key as keyof typeof notifs]}))}
              >
                <div className={styles.toggleKnob} />
              </button>
            </div>
          ))}
          <div style={{ marginTop: 'var(--space-6)' }}>
            <button className={styles.saveBtn} onClick={saveNotifs}>Save Preferences</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
