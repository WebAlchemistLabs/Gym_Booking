import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { AuthUser } from '../types'
import { MOCK_USERS, MOCK_PASSWORDS } from '../data/mockAuth'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  updateUser: (data: Partial<AuthUser>) => void
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'noir_gym_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setUser(JSON.parse(stored))
    } catch {}
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800))

    const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!found) return { ok: false, error: 'No account found with that email.' }

    const expectedPw = MOCK_PASSWORDS[found.email]
    if (password !== expectedPw) return { ok: false, error: 'Incorrect password.' }

    setUser(found)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found))
    return { ok: true }
  }

  const register = async (data: RegisterData) => {
    await new Promise(r => setTimeout(r, 800))

    const exists = MOCK_USERS.find(u => u.email.toLowerCase() === data.email.toLowerCase())
    if (exists) return { ok: false, error: 'An account with this email already exists.' }

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'user',
      membershipTier: null,
      memberSince: new Date().toISOString().split('T')[0],
      phone: data.phone,
    }

    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    return { ok: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const updateUser = (data: Partial<AuthUser>) => {
    if (!user) return
    const updated = { ...user, ...data }
    setUser(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
