import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          {/* Brand */}
          <div className={styles.brand}>
            <span className={styles.brandLogo}>Noir</span>
            <span className={styles.brandTagline}>Luxury Fitness</span>
            <p className={styles.brandDesc}>
              A premium sanctuary where discipline meets aesthetics. Every visit is a practice in becoming more.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <Instagram size={15} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <Twitter size={15} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <Facebook size={15} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Navigate</h4>
            <ul className={styles.columnLinks}>
              <li><Link to="/" className={styles.columnLink}>Home</Link></li>
              <li><Link to="/classes" className={styles.columnLink}>Classes</Link></li>
              <li><Link to="/memberships" className={styles.columnLink}>Memberships</Link></li>
              <li><Link to="/trainers" className={styles.columnLink}>Trainers</Link></li>
              <li><Link to="/booking" className={styles.columnLink}>Book a Class</Link></li>
              <li><Link to="/contact" className={styles.columnLink}>Contact</Link></li>
            </ul>
          </div>

          {/* Hours */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Hours</h4>
            <div className={styles.hoursGrid}>
              <div className={styles.hoursRow}>
                <span className={styles.hoursDay}>Mon – Fri</span>
                <span className={styles.hoursTime}>6am – 10pm</span>
              </div>
              <div className={styles.hoursRow}>
                <span className={styles.hoursDay}>Saturday</span>
                <span className={styles.hoursTime}>7am – 9pm</span>
              </div>
              <div className={styles.hoursRow}>
                <span className={styles.hoursDay}>Sunday</span>
                <span className={styles.hoursTime}>8am – 6pm</span>
              </div>
              <div className={styles.hoursRow} style={{ marginTop: '8px' }}>
                <span className={styles.hoursDay}>24/7 Access</span>
                <span className={styles.hoursTime}>Adept+</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contact</h4>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <MapPin size={14} className={styles.contactIcon} />
                <span>220 King St W, Suite 400<br />Toronto, ON M5H 1K4</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={14} className={styles.contactIcon} />
                <span>+1 (416) 555-0192</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={14} className={styles.contactIcon} />
                <span>hello@noirgym.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>© {year} NOIR GYM. All rights reserved.</p>
          <ul className={styles.legalLinks}>
            <li><a href="#" className={styles.legalLink}>Privacy Policy</a></li>
            <li><a href="#" className={styles.legalLink}>Terms of Use</a></li>
            <li><a href="#" className={styles.legalLink}>Waiver</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
