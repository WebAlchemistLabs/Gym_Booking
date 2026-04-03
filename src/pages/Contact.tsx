import { useState } from 'react'
import type { FormEvent } from 'react'
import { MapPin, Phone, Mail, CheckCircle, Send } from 'lucide-react'
import { SectionHeader } from '../components/ui'
import styles from './Contact.module.css'

const INQUIRY_TYPES = [
  'General Inquiry',
  'Membership Information',
  'Class Booking',
  'Personal Training',
  'Facility Tour',
  'Corporate Wellness',
  'Press & Media',
  'Other',
]

export default function Contact() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    inquiry: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => { const n = { ...e }; delete n[field]; return n })
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.message.trim()) e.message = 'Please include a message'
    return e
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1000)
  }

  const resetForm = () => {
    setForm({ firstName: '', lastName: '', email: '', phone: '', inquiry: '', message: '' })
    setSuccess(false)
    setErrors({})
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className="container">
          <SectionHeader
            eyebrow="Get in Touch"
            title="We'd love to hear from you"
            subtitle="Whether you're ready to join, have a question, or just want to see the space — we're here."
          />
        </div>
      </div>

      <section className={styles.contactSection}>
        <div className="container">
          <div className={styles.contactGrid}>
            {/* Form */}
            <div className={styles.formCard}>
              {success ? (
                <div className={styles.formSuccess}>
                  <div className={styles.formSuccessIcon}>
                    <CheckCircle size={28} />
                  </div>
                  <h3 className={styles.formSuccessTitle}>Message received.</h3>
                  <p className={styles.formSuccessText}>
                    Thank you for reaching out. A member of our team will be in touch within 24 hours.
                  </p>
                  <button className={styles.formSuccessBtn} onClick={resetForm}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h3 className={styles.formTitle}>Send us a message</h3>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>First Name *</label>
                      <input
                        className={`${styles.formInput} ${errors.firstName ? '' : ''}`}
                        placeholder="First name"
                        value={form.firstName}
                        onChange={(e) => update('firstName', e.target.value)}
                        style={errors.firstName ? { borderColor: 'var(--color-error)' } : {}}
                      />
                      {errors.firstName && <span style={{ fontSize: '12px', color: 'var(--color-error)', fontFamily: 'var(--font-mono)' }}>{errors.firstName}</span>}
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Last Name *</label>
                      <input
                        className={styles.formInput}
                        placeholder="Last name"
                        value={form.lastName}
                        onChange={(e) => update('lastName', e.target.value)}
                        style={errors.lastName ? { borderColor: 'var(--color-error)' } : {}}
                      />
                      {errors.lastName && <span style={{ fontSize: '12px', color: 'var(--color-error)', fontFamily: 'var(--font-mono)' }}>{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email Address *</label>
                    <input
                      type="email"
                      className={styles.formInput}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      style={errors.email ? { borderColor: 'var(--color-error)' } : {}}
                    />
                    {errors.email && <span style={{ fontSize: '12px', color: 'var(--color-error)', fontFamily: 'var(--font-mono)' }}>{errors.email}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone Number</label>
                    <input
                      type="tel"
                      className={styles.formInput}
                      placeholder="+1 (416) 555-0000"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Inquiry Type</label>
                    <select
                      className={styles.formSelect}
                      value={form.inquiry}
                      onChange={(e) => update('inquiry', e.target.value)}
                    >
                      <option value="">Select an inquiry type</option>
                      {INQUIRY_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Message *</label>
                    <textarea
                      className={`${styles.formInput} ${styles.formTextarea}`}
                      placeholder="Tell us how we can help..."
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      style={errors.message ? { borderColor: 'var(--color-error)' } : {}}
                    />
                    {errors.message && <span style={{ fontSize: '12px', color: 'var(--color-error)', fontFamily: 'var(--font-mono)' }}>{errors.message}</span>}
                  </div>

                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? (
                      <>Sending...</>
                    ) : (
                      <><Send size={14} /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Info Sidebar */}
            <div className={styles.infoSidebar}>
              <div className={styles.infoCard}>
                <div className={styles.infoCardTitle}>Contact Information</div>
                <div className={styles.infoCardBody}>
                  <div className={styles.infoItem}>
                    <MapPin size={15} className={styles.infoIcon} />
                    <div className={styles.infoItemContent}>
                      <p className={styles.infoItemLabel}>Address</p>
                      <p className={styles.infoItemValue}>220 King St W, Suite 400<br />Toronto, ON M5H 1K4</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <Phone size={15} className={styles.infoIcon} />
                    <div className={styles.infoItemContent}>
                      <p className={styles.infoItemLabel}>Phone</p>
                      <p className={styles.infoItemValue}>+1 (416) 555-0192</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <Mail size={15} className={styles.infoIcon} />
                    <div className={styles.infoItemContent}>
                      <p className={styles.infoItemLabel}>Email</p>
                      <p className={styles.infoItemValue}>hello@noirgym.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoCardTitle}>Hours</div>
                <div className={styles.infoCardBody}>
                  <div className={styles.hoursTable}>
                    {[
                      ['Monday', '6:00am – 10:00pm'],
                      ['Tuesday', '6:00am – 10:00pm'],
                      ['Wednesday', '6:00am – 10:00pm'],
                      ['Thursday', '6:00am – 10:00pm'],
                      ['Friday', '6:00am – 10:00pm'],
                      ['Saturday', '7:00am – 9:00pm'],
                      ['Sunday', '8:00am – 6:00pm'],
                    ].map(([day, time]) => (
                      <div key={day} className={styles.hoursRow}>
                        <span className={styles.hoursDay}>{day}</span>
                        <span className={styles.hoursTime}>{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.mapPlaceholder}>
                <img
                  src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80"
                  alt="Toronto, Ontario"
                />
                <div className={styles.mapOverlayText}>
                  <MapPin size={20} />
                  <span>King St W, Toronto</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
