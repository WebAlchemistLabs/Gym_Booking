import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { cn } from '../utils'
import styles from './Login.module.css'

export default function Login() {
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)
    if (!result.ok) {
      setError(result.error || 'Login failed.')
      return
    }
    toast('Welcome back to NOIR.', 'success')
    // role-based redirect handled by reading user from context after state update
    // small delay so context updates
    setTimeout(() => {
      const stored = localStorage.getItem('noir_gym_user')
      if (stored) {
        const u = JSON.parse(stored)
        navigate(u.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
      }
    }, 50)
  }

  const fillDemo = (role: 'admin' | 'user') => {
    if (role === 'admin') setForm({ email: 'admin@noirgym.com', password: 'admin123' })
    else setForm({ email: 'member@noirgym.com', password: 'member123' })
  }

  return (
    <div className={styles.authPage}>
      {/* Left brand panel */}
      <div className={styles.authBrand}>
        <div className={styles.authBrandBg}>
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80" alt="" />
          <div className={styles.authBrandOverlay} />
        </div>
        <div className={styles.authBrandContent}>
          <div className={styles.authBrandLogo}>
            <span className={styles.authBrandLogoMark}>Noir</span>
            <span className={styles.authBrandLogoSub}>Luxury Fitness</span>
          </div>
          <div className={styles.authBrandQuote}>
            <p className={styles.authBrandQuoteText}>
              "The body achieves what the <em>mind believes.</em>"
            </p>
            <p className={styles.authBrandQuoteAttrib}>— NOIR Philosophy</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className={styles.authForm}>
        <div className={styles.authFormInner}>
          <h1 className={styles.authFormTitle}>Welcome <em>back.</em></h1>
          <p className={styles.authFormSubtitle}>Sign in to access your dashboard and bookings.</p>

          {/* Demo credentials box */}
          <div className={styles.authDemoCredentials}>
            <p className={styles.authDemoTitle}>Demo Credentials</p>
            <div className={styles.authDemoRow}>
              <span className={styles.authDemoRole}>Member</span>
              <span>member@noirgym.com / member123</span>
            </div>
            <div className={styles.authDemoRow}>
              <span className={styles.authDemoRole}>Admin</span>
              <span>admin@noirgym.com / admin123</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button
                onClick={() => fillDemo('user')}
                style={{
                  flex: 1, fontSize: '10px', fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '6px', border: '1px solid var(--color-base-border)',
                  borderRadius: 'var(--radius-sm)', background: 'none',
                  color: 'var(--color-text-secondary)', cursor: 'pointer',
                }}
              >
                Use Member
              </button>
              <button
                onClick={() => fillDemo('admin')}
                style={{
                  flex: 1, fontSize: '10px', fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '6px', border: '1px solid var(--color-accent-border)',
                  borderRadius: 'var(--radius-sm)', background: 'var(--color-accent-muted)',
                  color: 'var(--color-accent)', cursor: 'pointer',
                }}
              >
                Use Admin
              </button>
            </div>
          </div>

          {error && <div className={styles.authFormGlobalError}>{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.authFormGroup}>
              <label className={styles.authFormLabel}>Email Address</label>
              <input
                type="email"
                className={styles.authFormInput}
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email"
              />
            </div>
            <div className={styles.authFormGroup}>
              <label className={styles.authFormLabel}>Password</label>
              <input
                type="password"
                className={styles.authFormInput}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className={styles.authSubmitBtn} disabled={loading}>
              {loading ? 'Signing in...' : <><LogIn size={14} /> Sign In</>}
            </button>
          </form>

          <p className={styles.authSwitch}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.authSwitchLink}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
