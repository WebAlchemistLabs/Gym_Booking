import type { AuthUser, Member, HistoricalBooking } from '../types'

// ─── Mock Users ───────────────────────────────────────────────────────────────
export const MOCK_USERS: AuthUser[] = [
  {
    id: 'usr-admin-001',
    email: 'admin@noirgym.com',
    firstName: 'Alex',
    lastName: 'Noir',
    role: 'admin',
    membershipTier: null,
    memberSince: '2023-01-01',
    phone: '+1 (416) 555-0100',
  },
  {
    id: 'usr-001',
    email: 'member@noirgym.com',
    firstName: 'Jordan',
    lastName: 'Mitchell',
    role: 'user',
    membershipTier: 'Adept',
    memberSince: '2024-02-14',
    phone: '+1 (416) 555-0201',
  },
]

export const MOCK_PASSWORDS: Record<string, string> = {
  'admin@noirgym.com': 'admin123',
  'member@noirgym.com': 'member123',
}

// ─── Mock Members (admin view) ────────────────────────────────────────────────
export const mockMembers: Member[] = [
  {
    id: 'usr-001',
    firstName: 'Jordan',
    lastName: 'Mitchell',
    email: 'member@noirgym.com',
    phone: '+1 (416) 555-0201',
    tier: 'Adept',
    status: 'active',
    joinDate: '2024-02-14',
    renewalDate: '2025-02-14',
    totalBookings: 38,
  },
  {
    id: 'usr-002',
    firstName: 'Adrienne',
    lastName: 'Park',
    email: 'adrienne.park@email.com',
    phone: '+1 (416) 555-0312',
    tier: 'Sovereign',
    status: 'active',
    joinDate: '2023-11-03',
    renewalDate: '2025-11-03',
    totalBookings: 94,
  },
  {
    id: 'usr-003',
    firstName: 'Tobias',
    lastName: 'Wren',
    email: 'tobias.wren@email.com',
    phone: '+1 (416) 555-0445',
    tier: 'Sovereign',
    status: 'active',
    joinDate: '2023-08-19',
    renewalDate: '2025-08-19',
    totalBookings: 127,
  },
  {
    id: 'usr-004',
    firstName: 'Camille',
    lastName: 'Fontaine',
    email: 'camille.f@email.com',
    phone: '+1 (416) 555-0538',
    tier: 'Adept',
    status: 'active',
    joinDate: '2024-01-07',
    renewalDate: '2025-01-07',
    totalBookings: 52,
  },
  {
    id: 'usr-005',
    firstName: 'Damien',
    lastName: 'Cruz',
    email: 'damien.cruz@email.com',
    phone: '+1 (416) 555-0621',
    tier: 'Initiate',
    status: 'active',
    joinDate: '2024-09-22',
    renewalDate: '2025-09-22',
    totalBookings: 14,
  },
  {
    id: 'usr-006',
    firstName: 'Yuki',
    lastName: 'Tanaka',
    email: 'yuki.tanaka@email.com',
    phone: '+1 (416) 555-0714',
    tier: 'Sovereign',
    status: 'active',
    joinDate: '2023-05-30',
    renewalDate: '2025-05-30',
    totalBookings: 156,
  },
  {
    id: 'usr-007',
    firstName: 'Rafael',
    lastName: 'Moura',
    email: 'rafael.m@email.com',
    phone: '+1 (416) 555-0867',
    tier: 'Adept',
    status: 'active',
    joinDate: '2024-03-11',
    renewalDate: '2025-03-11',
    totalBookings: 41,
  },
  {
    id: 'usr-008',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@email.com',
    phone: '+1 (416) 555-0923',
    tier: 'Initiate',
    status: 'suspended',
    joinDate: '2024-06-15',
    renewalDate: '2025-06-15',
    totalBookings: 8,
  },
  {
    id: 'usr-009',
    firstName: 'Marcus',
    lastName: 'Bell',
    email: 'marcus.bell@email.com',
    phone: '+1 (416) 555-0156',
    tier: 'Adept',
    status: 'active',
    joinDate: '2023-12-01',
    renewalDate: '2025-12-01',
    totalBookings: 63,
  },
  {
    id: 'usr-010',
    firstName: 'Naomi',
    lastName: 'Laurent',
    email: 'naomi.laurent@email.com',
    phone: '+1 (416) 555-0289',
    tier: 'Adept',
    status: 'cancelled',
    joinDate: '2024-04-20',
    renewalDate: '2024-10-20',
    totalBookings: 19,
  },
]

// ─── Helper: generate a date string ──────────────────────────────────────────
function dateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const classes = [
  { id: 'cls-001', name: 'Dark Flow Yoga', trainer: 'Elena Vasquez', category: 'Yoga', price: 28 },
  { id: 'cls-002', name: 'Iron Protocol', trainer: 'Marcus Okafor', category: 'Strength', price: 35 },
  { id: 'cls-003', name: 'Apex HIIT', trainer: 'Jordan Reeves', category: 'HIIT', price: 30 },
  { id: 'cls-004', name: 'Midnight Pilates', trainer: 'Sofia Chen', category: 'Pilates', price: 32 },
  { id: 'cls-005', name: 'Shadow Boxing', trainer: 'Marcus Okafor', category: 'Boxing', price: 33 },
  { id: 'cls-006', name: 'Velvet Barre', trainer: 'Sofia Chen', category: 'Barre', price: 29 },
  { id: 'cls-007', name: 'Threshold Cycling', trainer: 'Jordan Reeves', category: 'Cycling', price: 27 },
  { id: 'cls-008', name: 'Primal Cardio', trainer: 'Elena Vasquez', category: 'Cardio', price: 22 },
]

const members = [
  { id: 'usr-001', name: 'Jordan Mitchell', email: 'member@noirgym.com' },
  { id: 'usr-002', name: 'Adrienne Park', email: 'adrienne.park@email.com' },
  { id: 'usr-003', name: 'Tobias Wren', email: 'tobias.wren@email.com' },
  { id: 'usr-004', name: 'Camille Fontaine', email: 'camille.f@email.com' },
  { id: 'usr-005', name: 'Damien Cruz', email: 'damien.cruz@email.com' },
  { id: 'usr-006', name: 'Yuki Tanaka', email: 'yuki.tanaka@email.com' },
  { id: 'usr-007', name: 'Rafael Moura', email: 'rafael.m@email.com' },
  { id: 'usr-009', name: 'Marcus Bell', email: 'marcus.bell@email.com' },
]

const times = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '12:00 PM', '5:00 PM', '6:00 PM', '7:00 PM']

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomStatus(): 'completed' | 'cancelled' | 'no-show' {
  const r = Math.random()
  if (r < 0.78) return 'completed'
  if (r < 0.92) return 'cancelled'
  return 'no-show'
}

// Generate ~180 past bookings over the last 14 months
const generated: HistoricalBooking[] = []
let idCounter = 1

// Spread across months Jan 2024 – Feb 2025
const monthSlots = [
  [2024, 1, 12], [2024, 2, 15], [2024, 3, 18], [2024, 4, 14],
  [2024, 5, 16], [2024, 6, 13], [2024, 7, 17], [2024, 8, 15],
  [2024, 9, 14], [2024, 10, 19], [2024, 11, 16], [2024, 12, 18],
  [2025, 1, 14], [2025, 2, 10],
]

for (const [year, month, count] of monthSlots) {
  for (let i = 0; i < count; i++) {
    const day = Math.floor(Math.random() * 27) + 1
    const member = randomItem(members)
    const cls = randomItem(classes)
    const status = randomStatus()
    generated.push({
      id: `bk-${String(idCounter++).padStart(4, '0')}`,
      memberId: member.id,
      memberName: member.name,
      memberEmail: member.email,
      classId: cls.id,
      className: cls.name,
      trainer: cls.trainer,
      category: cls.category,
      date: dateStr(year, month, day),
      time: randomItem(times),
      status,
      price: cls.price,
      createdAt: dateStr(year, month, Math.max(1, day - 2)),
    })
  }
}

// Add upcoming confirmed bookings for the logged-in user (Jordan)
const upcomingBookings: HistoricalBooking[] = [
  {
    id: 'bk-up-001',
    memberId: 'usr-001',
    memberName: 'Jordan Mitchell',
    memberEmail: 'member@noirgym.com',
    classId: 'cls-002',
    className: 'Iron Protocol',
    trainer: 'Marcus Okafor',
    category: 'Strength',
    date: '2025-05-20',
    time: '6:00 AM',
    status: 'confirmed',
    price: 35,
    createdAt: '2025-05-14',
  },
  {
    id: 'bk-up-002',
    memberId: 'usr-001',
    memberName: 'Jordan Mitchell',
    memberEmail: 'member@noirgym.com',
    classId: 'cls-003',
    className: 'Apex HIIT',
    trainer: 'Jordan Reeves',
    category: 'HIIT',
    date: '2025-05-22',
    time: '12:00 PM',
    status: 'confirmed',
    price: 30,
    createdAt: '2025-05-14',
  },
  {
    id: 'bk-up-003',
    memberId: 'usr-001',
    memberName: 'Jordan Mitchell',
    memberEmail: 'member@noirgym.com',
    classId: 'cls-001',
    className: 'Dark Flow Yoga',
    trainer: 'Elena Vasquez',
    category: 'Yoga',
    date: '2025-05-28',
    time: '7:00 AM',
    status: 'confirmed',
    price: 28,
    createdAt: '2025-05-13',
  },
]

export const mockBookings: HistoricalBooking[] = [...upcomingBookings, ...generated].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
)

// ─── Monthly Revenue (for admin chart) ───────────────────────────────────────
export const monthlyRevenue = [
  { month: 'Jan', year: 2024, revenue: 8420 },
  { month: 'Feb', year: 2024, revenue: 9150 },
  { month: 'Mar', year: 2024, revenue: 10230 },
  { month: 'Apr', year: 2024, revenue: 9870 },
  { month: 'May', year: 2024, revenue: 11200 },
  { month: 'Jun', year: 2024, revenue: 10580 },
  { month: 'Jul', year: 2024, revenue: 9940 },
  { month: 'Aug', year: 2024, revenue: 11750 },
  { month: 'Sep', year: 2024, revenue: 12300 },
  { month: 'Oct', year: 2024, revenue: 13100 },
  { month: 'Nov', year: 2024, revenue: 12680 },
  { month: 'Dec', year: 2024, revenue: 14200 },
  { month: 'Jan', year: 2025, revenue: 13450 },
  { month: 'Feb', year: 2025, revenue: 11890 },
]
