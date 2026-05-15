import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { cn } from '../utils'
import styles from './Login.module.css'

export default function Register() {
  const { register } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState('')

  const update = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => { const n = { ...e }; delete n[field]; return n })
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError('')
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    const result = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      phone: form.phone,
    })
    setLoading(false)
    if (!result.ok) { setGlobalError(result.error || 'Registration failed.'); return }
    toast('Account created. Welcome to NOIR.', 'success')
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authBrand}>
        <div className={styles.authBrandBg}>
          <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80" alt="" />
          <div className={styles.authBrandOverlay} />
        </div>
        <div className={styles.authBrandContent}>
          <div className={styles.authBrandLogo}>
            <span className={styles.authBrandLogoMark}>Noir</span>
            <span className={styles.authBrandLogoSub}>Luxury Fitness</span>
          </div>
          <div className={styles.authBrandQuote}>
            <p className={styles.authBrandQuoteText}>
              "Every expert was once <em>a beginner.</em>"
            </p>
            <p className={styles.authBrandQuoteAttrib}>— NOIR Philosophy</p>
          </div>
        </div>
      </div>

      <div className={styles.authForm}>
        <div className={styles.authFormInner}>
          <h1 className={styles.authFormTitle}>Join <em>NOIR.</em></h1>
          <p className={styles.authFormSubtitle}>Create your account and start your practice.</p>

          {globalError && <div className={styles.authFormGlobalError}>{globalError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.authFormRow}>
              <div className={styles.authFormGroup}>
                <label className={styles.authFormLabel}>First Name</label>
                <input className={cn(styles.authFormInput, errors.firstName && styles.authFormInputError)}
                  placeholder="First" value={form.firstName} onChange={e => update('firstName', e.target.value)} />
                {errors.firstName && <span className={styles.authFormError}>{errors.firstName}</span>}
              </div>
              <div className={styles.authFormGroup}>
                <label className={styles.authFormLabel}>Last Name</label>
                <input className={cn(styles.authFormInput, errors.lastName && styles.authFormInputError)}
                  placeholder="Last" value={form.lastName} onChange={e => update('lastName', e.target.value)} />
                {errors.lastName && <span className={styles.authFormError}>{errors.lastName}</span>}
              </div>
            </div>

            <div className={styles.authFormGroup}>
              <label className={styles.authFormLabel}>Email Address</label>
              <input type="email" className={cn(styles.authFormInput, errors.email && styles.authFormInputError)}
                placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
              {errors.email && <span className={styles.authFormError}>{errors.email}</span>}
            </div>

            <div className={styles.authFormGroup}>
              <label className={styles.authFormLabel}>Phone (optional)</label>
              <input type="tel" className={styles.authFormInput}
                placeholder="+1 (416) 555-0000" value={form.phone} onChange={e => update('phone', e.target.value)} />
            </div>

            <div className={styles.authFormGroup}>
              <label className={styles.authFormLabel}>Password</label>
              <input type="password" className={cn(styles.authFormInput, errors.password && styles.authFormInputError)}
                placeholder="Min. 6 characters" value={form.password} onChange={e => update('password', e.target.value)} />
              {errors.password && <span className={styles.authFormError}>{errors.password}</span>}
            </div>

            <div className={styles.authFormGroup}>
              <label className={styles.authFormLabel}>Confirm Password</label>
              <input type="password" className={cn(styles.authFormInput, errors.confirm && styles.authFormInputError)}
                placeholder="Repeat password" value={form.confirm} onChange={e => update('confirm', e.target.value)} />
              {errors.confirm && <span className={styles.authFormError}>{errors.confirm}</span>}
            </div>

            <button type="submit" className={styles.authSubmitBtn} disabled={loading}>
              {loading ? 'Creating account...' : <><UserPlus size={14} /> Create Account</>}
            </button>
          </form>

          <p className={styles.authSwitch}>
            Already have an account?{' '}
            <Link to="/login" className={styles.authSwitchLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
