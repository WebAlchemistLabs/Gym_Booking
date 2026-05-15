import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { ChevronDown, LayoutDashboard, Calendar, CreditCard, User, LogOut, Shield } from 'lucide-react'
import { useScrolled } from '../../hooks/useScrolled'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { navLinks } from '../../data'
import { cn } from '../../utils'
import styles from './Navbar.module.css'

export default function Navbar() {
  const scrolled = useScrolled(60)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    toast('You have been signed out.', 'info')
    navigate('/')
  }

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : ''

  return (
    <>
      <nav className={cn(styles.navbar, scrolled && styles.navbarScrolled)}>
        <div className={styles.navbarInner}>
          <Link to="/" className={styles.logo} onClick={closeMenu}>
            <span className={styles.logoMark}>Noir</span>
            <span className={styles.logoSub}>Luxury Fitness</span>
          </Link>

          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  className={({ isActive }) => cn(styles.navLink, isActive && styles.navLinkActive)}
                  end={link.href === '/'}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className={styles.navActions}>
            {user ? (
              <div className={styles.avatarWrap} ref={dropdownRef}>
                <button
                  className={styles.avatarBtn}
                  onClick={() => setDropdownOpen(o => !o)}
                  aria-label="Account menu"
                >
                  <div className={styles.avatarCircle}>{initials}</div>
                  <span className={styles.avatarName}>{user.firstName}</span>
                  <ChevronDown size={13} className={cn(styles.avatarChevron, dropdownOpen && styles.avatarChevronOpen)} />
                </button>

                {dropdownOpen && (
                  <div className={styles.avatarDropdown}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.dropdownHeaderName}>{user.firstName} {user.lastName}</p>
                      <p className={styles.dropdownHeaderEmail}>{user.email}</p>
                      {user.membershipTier && (
                        <span className={styles.dropdownHeaderTier}>{user.membershipTier}</span>
                      )}
                      {user.role === 'admin' && (
                        <span className={styles.dropdownHeaderTier} style={{ background: 'rgba(196,168,106,0.15)', color: 'var(--color-gold)', borderColor: 'rgba(196,168,106,0.3)' }}>
                          Admin
                        </span>
                      )}
                    </div>
                    <div className={styles.dropdownItems}>
                      {user.role === 'admin' ? (
                        <>
                          <Link to="/admin" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                            <Shield size={14} className={styles.dropdownItemIcon} /> Admin Panel
                          </Link>
                          <Link to="/admin/bookings" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                            <Calendar size={14} className={styles.dropdownItemIcon} /> Manage Bookings
                          </Link>
                          <Link to="/admin/members" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                            <User size={14} className={styles.dropdownItemIcon} /> Manage Members
                          </Link>
                          <Link to="/admin/classes" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                            <LayoutDashboard size={14} className={styles.dropdownItemIcon} /> Class Management
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to="/dashboard" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                            <LayoutDashboard size={14} className={styles.dropdownItemIcon} /> Dashboard
                          </Link>
                          <Link to="/dashboard/bookings" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                            <Calendar size={14} className={styles.dropdownItemIcon} /> My Bookings
                          </Link>
                          <Link to="/dashboard/membership" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                            <CreditCard size={14} className={styles.dropdownItemIcon} /> Membership
                          </Link>
                          <Link to="/dashboard/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                            <User size={14} className={styles.dropdownItemIcon} /> Profile
                          </Link>
                        </>
                      )}
                      <div className={styles.dropdownDivider} />
                      <button className={cn(styles.dropdownItem, styles.dropdownLogout)} onClick={handleLogout}>
                        <LogOut size={14} className={styles.dropdownItemIcon} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className={styles.navLoginLink}>Sign In</Link>
                <Link to="/booking" className={styles.navCta}>Book a Class</Link>
              </>
            )}
          </div>

          <button
            className={cn(styles.hamburger, menuOpen && styles.hamburgerOpen)}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </nav>

      <div className={cn(styles.mobileOverlay, menuOpen && styles.mobileOverlayOpen)}>
        <ul className={styles.mobileNavLinks}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <NavLink
                to={link.href}
                className={({ isActive }) => cn(styles.mobileNavLink, isActive && styles.mobileNavLinkActive)}
                end={link.href === '/'}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          {user && (
            <li>
              <NavLink
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className={({ isActive }) => cn(styles.mobileNavLink, isActive && styles.mobileNavLinkActive)}
                onClick={closeMenu}
              >
                {user.role === 'admin' ? 'Admin' : 'Dashboard'}
              </NavLink>
            </li>
          )}
        </ul>
        {user ? (
          <button
            className={styles.mobileCta}
            onClick={() => { handleLogout(); closeMenu() }}
            style={{ background: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-base-border)' }}
          >
            Sign Out
          </button>
        ) : (
          <Link to="/booking" className={styles.mobileCta} onClick={closeMenu}>Book a Class</Link>
        )}
      </div>
    </>
  )
}
