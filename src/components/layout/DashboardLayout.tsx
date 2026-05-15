import { NavLink } from 'react-router-dom'
import { cn } from '../../utils'
import styles from './DashboardLayout.module.css'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  exact?: boolean
}

interface Props {
  eyebrow: string
  title: string
  navItems: NavItem[]
  children: React.ReactNode
  footerContent?: React.ReactNode
}

export default function DashboardLayout({ eyebrow, title, navItems, children, footerContent }: Props) {
  return (
    <div className={styles.dashLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <p className={styles.sidebarEyebrow}>{eyebrow}</p>
          <p className={styles.sidebarTitle}>{title}</p>
        </div>
        <nav className={styles.sidebarNav}>
          {navItems.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.exact}
              className={({ isActive }) => cn(styles.sidebarLink, isActive && styles.sidebarLinkActive)}
            >
              <span className={styles.sidebarLinkIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        {footerContent && <div className={styles.sidebarFooter}>{footerContent}</div>}
      </aside>

      <main className={styles.dashMain}>
        <div className={styles.dashContent}>
          {children}
        </div>
      </main>
    </div>
  )
}

// Page header helper
export function DashPageHeader({ eyebrow, title, subtitle, action }: {
  eyebrow?: string
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className={styles.dashPageHeader} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
      <div>
        {eyebrow && <p className={styles.dashPageEyebrow}>{eyebrow}</p>}
        <h1 className={styles.dashPageTitle}>{title}</h1>
        {subtitle && <p className={styles.dashPageSubtitle}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
