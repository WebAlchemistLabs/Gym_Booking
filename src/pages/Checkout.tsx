import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CreditCard, Lock, CheckCircle, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { memberships } from '../data'
import { cn } from '../utils'
import styles from './Checkout.module.css'

type TierName = 'Initiate' | 'Adept' | 'Sovereign'

function formatCardNumber(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

export default function Checkout() {
  const [searchParams] = useSearchParams()
  const { user, updateUser } = useAuth()
  const { toast } = useToast()

  const initialTier = (searchParams.get('tier') as TierName) || 'Adept'
  const [selectedTier, setSelectedTier] = useState<TierName>(initialTier)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [billing, setBilling] = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '',
    email: user?.email || '', address: '', city: '', postal: '',
  })

  const [payment, setPayment] = useState({
    cardNumber: '', cardName: '', expiry: '', cvv: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const tier = memberships.find(m => m.name === selectedTier)!

  const validate = () => {
    const e: Record<string, string> = {}
    if (!billing.firstName) e.firstName = 'Required'
    if (!billing.lastName) e.lastName = 'Required'
    if (!billing.email) e.email = 'Required'
    if (!billing.address) e.address = 'Required'
    if (!billing.city) e.city = 'Required'
    if (!billing.postal) e.postal = 'Required'
    const rawCard = payment.cardNumber.replace(/\s/g, '')
    if (rawCard.length !== 16) e.cardNumber = 'Enter a 16-digit card number'
    if (!payment.cardName) e.cardName = 'Required'
    if (payment.expiry.length < 5) e.expiry = 'Enter MM/YY'
    if (payment.cvv.length < 3) e.cvv = 'Enter 3-digit CVV'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      updateUser({ membershipTier: selectedTier, membershipRenewal: getNextYear() })
      toast(`${selectedTier} membership activated!`, 'success')
    }, 1600)
  }

  const getNextYear = () => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 1)
    return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (success) {
    return (
      <div className={styles.checkoutPage}>
        <div className="container">
          <div className={styles.successScreen}>
            <div className={styles.successIcon}><CheckCircle size={40} /></div>
            <h1 className={styles.successTitle}>Welcome to {selectedTier}.</h1>
            <p className={styles.successSubtitle}>
              Your {selectedTier} membership is now active. A receipt has been sent to {billing.email}. We'll see you on the floor.
            </p>
            <div className={styles.successActions}>
              <Link to="/dashboard" className={styles.successBtnPrimary}>Go to Dashboard</Link>
              <Link to="/booking" className={styles.successBtnSecondary}>Book a Class</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.checkoutHeader}>
        <div className="container">
          <h1 className={styles.checkoutTitle}>Membership Checkout</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
            Secure checkout — demo mode, no real charges.
          </p>
        </div>
      </div>

      <div className="container">
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.checkoutLayout}>
            {/* Left: Form */}
            <div className={styles.checkoutForm}>
              {/* Plan selection */}
              <div className={styles.checkoutSection}>
                <h2 className={styles.checkoutSectionTitle}>Select Your Plan</h2>
                <div className={styles.planGrid}>
                  {memberships.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      className={cn(styles.planOption, selectedTier === m.name && styles.planOptionSelected)}
                      onClick={() => setSelectedTier(m.name as TierName)}
                    >
                      <span className={styles.planOptionName}>{m.name}</span>
                      <span className={styles.planOptionPrice}>${m.price}</span>
                      <span className={styles.planOptionPeriod}>/{m.period}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Billing details */}
              <div className={styles.checkoutSection}>
                <h2 className={styles.checkoutSectionTitle}>Billing Details</h2>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>First Name</label>
                    <input className={styles.formInput} value={billing.firstName} onChange={e => setBilling(b => ({ ...b, firstName: e.target.value }))} placeholder="First" style={errors.firstName ? { borderColor: 'var(--color-error)' } : {}} />
                    {errors.firstName && <span style={{ fontSize: '11px', color: 'var(--color-error)', fontFamily: 'var(--font-mono)' }}>{errors.firstName}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Last Name</label>
                    <input className={styles.formInput} value={billing.lastName} onChange={e => setBilling(b => ({ ...b, lastName: e.target.value }))} placeholder="Last" />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address</label>
                  <input type="email" className={styles.formInput} value={billing.email} onChange={e => setBilling(b => ({ ...b, email: e.target.value }))} placeholder="you@example.com" style={errors.email ? { borderColor: 'var(--color-error)' } : {}} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Street Address</label>
                  <input className={styles.formInput} value={billing.address} onChange={e => setBilling(b => ({ ...b, address: e.target.value }))} placeholder="123 Main St" style={errors.address ? { borderColor: 'var(--color-error)' } : {}} />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>City</label>
                    <input className={styles.formInput} value={billing.city} onChange={e => setBilling(b => ({ ...b, city: e.target.value }))} placeholder="Toronto" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Postal Code</label>
                    <input className={styles.formInput} value={billing.postal} onChange={e => setBilling(b => ({ ...b, postal: e.target.value }))} placeholder="M5H 1K4" />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className={styles.checkoutSection}>
                <h2 className={styles.checkoutSectionTitle}>Payment Information</h2>
                <div style={{ background: 'rgba(138,154,110,0.08)', border: '1px solid var(--color-accent-border)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                  <ShieldCheck size={14} color="var(--color-accent)" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                    Demo mode — use any card number
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Card Number</label>
                  <div className={styles.cardInputWrap}>
                    <input
                      className={styles.formInput}
                      value={payment.cardNumber}
                      onChange={e => setPayment(p => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))}
                      placeholder="4242 4242 4242 4242"
                      style={{ paddingRight: '44px', ...(errors.cardNumber ? { borderColor: 'var(--color-error)' } : {}) }}
                    />
                    <CreditCard size={16} className={styles.cardIcon} />
                  </div>
                  {errors.cardNumber && <span style={{ fontSize: '11px', color: 'var(--color-error)', fontFamily: 'var(--font-mono)' }}>{errors.cardNumber}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Name on Card</label>
                  <input className={styles.formInput} value={payment.cardName} onChange={e => setPayment(p => ({ ...p, cardName: e.target.value }))} placeholder="JORDAN MITCHELL" style={{ textTransform: 'uppercase', ...(errors.cardName ? { borderColor: 'var(--color-error)' } : {}) }} />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Expiry Date</label>
                    <input
                      className={styles.formInput}
                      value={payment.expiry}
                      onChange={e => setPayment(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                      placeholder="MM/YY"
                      style={errors.expiry ? { borderColor: 'var(--color-error)' } : {}}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>CVV</label>
                    <input
                      className={styles.formInput}
                      value={payment.cvv}
                      onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      placeholder="123"
                      style={errors.cvv ? { borderColor: 'var(--color-error)' } : {}}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order summary + submit */}
            <div className={styles.checkoutSidebar}>
              <div className={styles.orderCard}>
                <div className={styles.orderCardTitle}>Order Summary</div>
                <div className={styles.orderRow}>
                  <span className={styles.orderRowLabel}>Plan</span>
                  <span className={styles.orderRowValue}>{tier.name}</span>
                </div>
                <div className={styles.orderRow}>
                  <span className={styles.orderRowLabel}>Billing</span>
                  <span className={styles.orderRowValue}>Monthly</span>
                </div>
                <div className={styles.orderRow}>
                  <span className={styles.orderRowLabel}>Features</span>
                  <span className={styles.orderRowValue}>{tier.features.length} included</span>
                </div>
                <div className={styles.orderRow}>
                  <span className={styles.orderRowLabel}>Promo</span>
                  <span className={styles.orderRowValue} style={{ color: 'var(--color-accent)' }}>None applied</span>
                </div>
                <div className={styles.orderTotal}>
                  <span className={styles.orderTotalLabel}>Total / month</span>
                  <span className={styles.orderTotalAmount}>${tier.price}</span>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Processing...' : <><Lock size={13} /> Complete Purchase</>}
              </button>

              <div className={styles.secureNote}>
                <Lock size={11} />
                Secured by 256-bit encryption
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
