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
