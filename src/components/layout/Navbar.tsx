import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useScrolled } from '../../hooks/useScrolled'
import { navLinks } from '../../data'
import { cn } from '../../utils'
import styles from './Navbar.module.css'

export default function Navbar() {
  const scrolled = useScrolled(60)
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

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
                  className={({ isActive }) =>
                    cn(styles.navLink, isActive && styles.navLinkActive)
                  }
                  end={link.href === '/'}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <Link to="/booking" className={styles.navCta}>Book a Class</Link>

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
                className={({ isActive }) =>
                  cn(styles.mobileNavLink, isActive && styles.mobileNavLinkActive)
                }
                end={link.href === '/'}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <Link to="/booking" className={styles.mobileCta} onClick={closeMenu}>
          Book a Class
        </Link>
      </div>
    </>
  )
}
