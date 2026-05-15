import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types'

interface Props {
  children: React.ReactNode
  role?: UserRole
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-base)',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
      }}>
        Loading...
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return <>{children}</>
}
