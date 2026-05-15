import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ToastContainer from './components/ui/Toast'

// Public pages
import Home from './pages/Home'
import Classes from './pages/Classes'
import Memberships from './pages/Memberships'
import Trainers from './pages/Trainers'
import Booking from './pages/Booking'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'

// User dashboard pages
import UserDashboard from './pages/dashboard/UserDashboard'
import UserBookings from './pages/dashboard/UserBookings'
import UserMembership from './pages/dashboard/UserMembership'
import UserProfile from './pages/dashboard/UserProfile'

// Admin pages
import AdminOverview from './pages/admin/AdminOverview'
import AdminBookings from './pages/admin/AdminBookings'
import AdminMembers from './pages/admin/AdminMembers'
import AdminClasses from './pages/admin/AdminClasses'
import AdminSettings from './pages/admin/AdminSettings'

function AppRoutes() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Dashboard/admin pages have their own layout (sidebar), no Footer
  const noFooter = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  const noNavbarPages = ['/login', '/register']
  const showNavbar = !noNavbarPages.includes(pathname)

  return (
    <>
      {showNavbar && <Navbar />}
      <ToastContainer />
      <main>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected: any user */}
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

          {/* Protected: user role */}
          <Route path="/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/bookings" element={<ProtectedRoute role="user"><UserBookings /></ProtectedRoute>} />
          <Route path="/dashboard/membership" element={<ProtectedRoute role="user"><UserMembership /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute role="user"><UserProfile /></ProtectedRoute>} />

          {/* Protected: admin role */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminOverview /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute role="admin"><AdminBookings /></ProtectedRoute>} />
          <Route path="/admin/members" element={<ProtectedRoute role="admin"><AdminMembers /></ProtectedRoute>} />
          <Route path="/admin/classes" element={<ProtectedRoute role="admin"><AdminClasses /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />
        </Routes>
      </main>
      {!noFooter && showNavbar && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  )
}
