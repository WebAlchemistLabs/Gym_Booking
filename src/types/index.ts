// ─── Gym Data ─────────────────────────────────────────────────────────────────

export interface GymClass {
  id: string
  name: string
  category: 'Yoga' | 'HIIT' | 'Strength' | 'Cardio' | 'Pilates' | 'Boxing' | 'Cycling' | 'Barre'
  trainer: string
  trainerId: string
  duration: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  spotsTotal: number
  spotsRemaining: number
  description: string
  schedule: { days: string[]; time: string }
  price: number
  image: string
}

export interface Trainer {
  id: string
  name: string
  title: string
  bio: string
  specialties: string[]
  certifications: string[]
  image: string
  classes: string[]
  instagram?: string
}

export interface MembershipTier {
  id: string
  name: string
  price: number
  period: 'month' | 'year'
  highlight: boolean
  description: string
  features: string[]
  notIncluded: string[]
  cta: string
  badge?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  text: string
  rating: number
  avatar: string
  memberSince: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'general' | 'membership' | 'booking' | 'facilities'
}

export interface TimeSlot {
  id: string
  time: string
  available: boolean
}

export interface NavLink {
  label: string
  href: string
}

export interface BookingState {
  selectedClass: GymClass | null
  selectedDate: Date | null
  selectedTimeSlot: TimeSlot | null
  memberDetails: MemberDetails | null
}

export interface MemberDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  isNewMember: boolean
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'user'
export type TierName = 'Initiate' | 'Adept' | 'Sovereign' | null
export type BookingStatus = 'confirmed' | 'completed' | 'cancelled' | 'no-show'
export type MemberStatus = 'active' | 'suspended' | 'cancelled'

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  membershipTier: TierName
  memberSince: string
  phone?: string
  membershipRenewal?: string
  notifications?: {
    email: boolean
    sms: boolean
    reminders: boolean
    promotions: boolean
  }
}

// ─── Historical / Mock Booking ────────────────────────────────────────────────

export interface HistoricalBooking {
  id: string
  memberId: string
  memberName: string
  memberEmail: string
  classId: string
  className: string
  trainer: string
  category: string
  date: string
  time: string
  status: BookingStatus
  price: number
  createdAt: string
}

// ─── Member (admin view) ──────────────────────────────────────────────────────

export interface Member {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  tier: 'Initiate' | 'Adept' | 'Sovereign'
  status: MemberStatus
  joinDate: string
  renewalDate: string
  totalBookings: number
}

// ─── Toast ────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

export interface CheckoutForm {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  postal: string
  cardNumber: string
  cardExpiry: string
  cardCvv: string
  cardName: string
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface MonthlyRevenue {
  month: string
  year?: number
  revenue: number
}

// ─── Legacy types used by data/index.ts ─────────────────────────────────────

export interface User {
  id: string
  email: string
  password: string
  role: UserRole
  firstName: string
  lastName: string
  phone: string
  memberSince: string
  membership: 'Initiate' | 'Adept' | 'Sovereign' | 'None'
  membershipRenewal: string
  membershipStatus: 'active' | 'suspended' | 'expired'
  totalBookings: number
  notifications: {
    email: boolean
    sms: boolean
    reminders: boolean
    promotions: boolean
  }
}

export interface MockBooking {
  id: string
  userId: string
  userName: string
  userEmail: string
  classId: string
  className: string
  category: string
  trainer: string
  date: string
  time: string
  duration: number
  price: number
  status: BookingStatus
  createdAt: string
  membershipTier: 'Initiate' | 'Adept' | 'Sovereign' | 'None'
}
