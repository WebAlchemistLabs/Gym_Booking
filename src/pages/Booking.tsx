import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import React from 'react'
import {
  ChevronLeft, ChevronRight, Check, Clock, Users,
  Star, Zap, CheckCircle
} from 'lucide-react'
import { gymClasses, timeSlots } from '../data'
import type { GymClass, TimeSlot, MemberDetails, BookingState } from '../types'
import {
  cn, formatPrice, formatDuration, formatDate,
  getDaysInMonth, getFirstDayOfMonth,
  isSameDay, isPastDay, isClosedDay,
  MONTHS, DAYS_SHORT
} from '../utils'
import styles from './Booking.module.css'

const STEPS = ['Select Class', 'Date & Time', 'Your Details', 'Confirm']

const initialBooking: BookingState = {
  selectedClass: null,
  selectedDate: null,
  selectedTimeSlot: null,
  memberDetails: null,
}

// ─── Categories for step 1 grouping ───
function groupByCategory(classes: GymClass[]) {
  const map: Record<string, GymClass[]> = {}
  for (const c of classes) {
    if (!map[c.category]) map[c.category] = []
    map[c.category].push(c)
  }
  return map
}

// ─── Calendar Component ───
function BookingCalendar({
  selectedDate,
  onSelect,
}: {
  selectedDate: Date | null
  onSelect: (d: Date) => void
}) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const isPrevDisabled = viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth <= today.getMonth())

  const days: (Date | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(viewYear, viewMonth, d))
  }

  return (
    <div>
      <div className={styles.calendarHeader}>
        <button className={styles.calendarNavBtn} onClick={prevMonth} disabled={isPrevDisabled}>
          <ChevronLeft size={16} />
        </button>
        <span className={styles.calendarMonthLabel}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button className={styles.calendarNavBtn} onClick={nextMonth}>
          <ChevronRight size={16} />
        </button>
      </div>
      <div className={styles.calendarGrid}>
        {DAYS_SHORT.map(d => (
          <div key={d} className={styles.calendarDayLabel}>{d}</div>
        ))}
        {days.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} className={cn(styles.calendarDay, styles.calendarDayEmpty)} />
          const past = isPastDay(date)
          const closed = isClosedDay(date)
          const selected = selectedDate ? isSameDay(date, selectedDate) : false
          const isToday = isSameDay(date, today)

          return (
            <button
              key={date.toISOString()}
              className={cn(
                styles.calendarDay,
                past && styles.calendarDayPast,
                closed && styles.calendarDayClosed,
                selected && styles.calendarDaySelected,
                isToday && !selected && styles.calendarDayToday,
              )}
              onClick={() => !past && !closed && onSelect(date)}
              disabled={past || closed}
              aria-label={formatDate(date)}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
      <p className={styles.closedNote}>* Sundays: facility closed</p>
    </div>
  )
}

// ─── Step 1: Select Class ───
function StepSelectClass({
  selected,
  onSelect,
}: {
  selected: GymClass | null
  onSelect: (c: GymClass) => void
}) {
  const grouped = groupByCategory(gymClasses)

  return (
    <div>
      <h2 className={styles.stepTitle}>Choose your class</h2>
      <p className={styles.stepSubtitle}>Select the class you want to book a session for.</p>
      {Object.entries(grouped).map(([cat, classes]) => (
        <div key={cat}>
          <span className={styles.classSelectCategory}>{cat}</span>
          <div className={styles.classSelectList}>
            {classes.map((c) => (
              <button
                key={c.id}
                className={cn(styles.classSelectItem, selected?.id === c.id && styles.classSelectItemSelected)}
                onClick={() => onSelect(c)}
              >
                <div className={styles.classSelectItemRadio}>
                  <div className={styles.classSelectItemRadioDot} />
                </div>
                <div className={styles.classSelectItemInfo}>
                  <div className={styles.classSelectItemName}>{c.name}</div>
                  <div className={styles.classSelectItemMeta}>
                    <span className={styles.classSelectItemMetaText}><Clock size={11} />{formatDuration(c.duration)}</span>
                    <span className={styles.classSelectItemMetaText}><Users size={11} />{c.spotsRemaining} left</span>
                    <span className={styles.classSelectItemMetaText}><Zap size={11} />{c.difficulty}</span>
                    <span className={styles.classSelectItemMetaText}>{c.trainer}</span>
                  </div>
                </div>
                <span className={styles.classSelectItemPrice}>{formatPrice(c.price)}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Step 2: Date & Time ───
function StepDateTime({
  selectedDate,
  selectedSlot,
  onSelectDate,
  onSelectSlot,
}: {
  selectedDate: Date | null
  selectedSlot: TimeSlot | null
  onSelectDate: (d: Date) => void
  onSelectSlot: (s: TimeSlot) => void
}) {
  return (
    <div>
      <h2 className={styles.stepTitle}>Pick a date & time</h2>
      <p className={styles.stepSubtitle}>Select an available date. Sundays are closed.</p>
      <BookingCalendar selectedDate={selectedDate} onSelect={onSelectDate} />

      {selectedDate && (
        <div className={styles.timeSlotsSection}>
          <p className={styles.timeSlotsTitle}>
            Available times — {selectedDate.toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <div className={styles.timeSlotsGrid}>
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                className={cn(
                  styles.timeSlotBtn,
                  !slot.available && styles.timeSlotUnavailable,
                  selectedSlot?.id === slot.id && styles.timeSlotSelected,
                )}
                onClick={() => slot.available && onSelectSlot(slot)}
                disabled={!slot.available}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Step 3: Member Details ───
function StepMemberDetails({
  details,
  onChange,
}: {
  details: MemberDetails
  onChange: (d: MemberDetails) => void
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof MemberDetails, string>>>({})

  const validate = (field: keyof MemberDetails, value: string) => {
    if (field === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors(e => ({ ...e, email: 'Enter a valid email address' }))
    } else {
      setErrors(e => { const n = { ...e }; delete n[field]; return n })
    }
  }

  const update = (field: keyof MemberDetails, value: string | boolean) => {
    onChange({ ...details, [field]: value })
    if (typeof value === 'string') validate(field, value)
  }

  return (
    <div>
      <h2 className={styles.stepTitle}>Your details</h2>
      <p className={styles.stepSubtitle}>Tell us who's coming to class.</p>
      <div className={styles.memberForm}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>First Name</label>
            <input
              className={cn(styles.formInput, errors.firstName && styles.formInputError)}
              placeholder="Elena"
              value={details.firstName}
              onChange={(e) => update('firstName', e.target.value)}
            />
            {errors.firstName && <span className={styles.formError}>{errors.firstName}</span>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Last Name</label>
            <input
              className={cn(styles.formInput, errors.lastName && styles.formInputError)}
              placeholder="Vasquez"
              value={details.lastName}
              onChange={(e) => update('lastName', e.target.value)}
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Email Address</label>
          <input
            type="email"
            className={cn(styles.formInput, errors.email && styles.formInputError)}
            placeholder="elena@example.com"
            value={details.email}
            onChange={(e) => update('email', e.target.value)}
          />
          {errors.email && <span className={styles.formError}>{errors.email}</span>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Phone Number</label>
          <input
            type="tel"
            className={styles.formInput}
            placeholder="+1 (416) 555-0000"
            value={details.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>

        <button
          className={cn(styles.newMemberToggle, details.isNewMember && styles.newMemberToggleActive)}
          onClick={() => update('isNewMember', !details.isNewMember)}
          type="button"
        >
          <div className={styles.toggleCheckbox}>
            {details.isNewMember && <Check size={12} color="var(--color-base)" />}
          </div>
          <div className={styles.toggleContent}>
            <p className={styles.toggleTitle}>I'm a new member</p>
            <p className={styles.toggleDesc}>First time at NOIR? Your first class is complimentary.</p>
            {details.isNewMember && (
              <div className={styles.freeBadge}>
                <Star size={10} />
                Free Trial Class Applied
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  )
}

// ─── Step 4: Confirm ───
function StepConfirm({
  booking,
  onEditStep,
}: {
  booking: BookingState
  onEditStep: (step: number) => void
}) {
  const { selectedClass, selectedDate, selectedTimeSlot, memberDetails } = booking
  if (!selectedClass || !selectedDate || !selectedTimeSlot || !memberDetails) return null

  return (
    <div>
      <h2 className={styles.stepTitle}>Review your booking</h2>
      <p className={styles.stepSubtitle}>Check the details below before confirming.</p>

      <div className={styles.confirmSections}>
        <div className={styles.confirmSection}>
          <div className={styles.confirmSectionTitle}>Class</div>
          <div className={styles.confirmRow}>
            <span className={styles.confirmRowLabel}>Class</span>
            <span className={styles.confirmRowValue}>{selectedClass.name}</span>
          </div>
          <div className={styles.confirmRow}>
            <span className={styles.confirmRowLabel}>Trainer</span>
            <span className={styles.confirmRowValue}>{selectedClass.trainer}</span>
          </div>
          <div className={styles.confirmRow}>
            <span className={styles.confirmRowLabel}>Duration</span>
            <span className={styles.confirmRowValue}>{formatDuration(selectedClass.duration)}</span>
          </div>
          <div className={styles.confirmRow}>
            <span className={styles.confirmRowLabel}>Price</span>
            <span className={styles.confirmRowValue}>
              {memberDetails.isNewMember
                ? <><s style={{ color: 'var(--color-text-muted)', marginRight: '6px' }}>{formatPrice(selectedClass.price)}</s><span style={{ color: 'var(--color-gold)' }}>Free Trial</span></>
                : formatPrice(selectedClass.price)
              }
            </span>
          </div>
          <div className={styles.confirmRow}>
            <span className={styles.confirmRowLabel}>&nbsp;</span>
            <button className={styles.confirmEditBtn} onClick={() => onEditStep(0)}>Edit</button>
          </div>
        </div>

        <div className={styles.confirmSection}>
          <div className={styles.confirmSectionTitle}>Date & Time</div>
          <div className={styles.confirmRow}>
            <span className={styles.confirmRowLabel}>Date</span>
            <span className={styles.confirmRowValue}>{formatDate(selectedDate)}</span>
          </div>
          <div className={styles.confirmRow}>
            <span className={styles.confirmRowLabel}>Time</span>
            <span className={styles.confirmRowValue}>{selectedTimeSlot.time}</span>
          </div>
          <div className={styles.confirmRow}>
            <span className={styles.confirmRowLabel}>&nbsp;</span>
            <button className={styles.confirmEditBtn} onClick={() => onEditStep(1)}>Edit</button>
          </div>
        </div>

        <div className={styles.confirmSection}>
          <div className={styles.confirmSectionTitle}>Member Details</div>
          <div className={styles.confirmRow}>
            <span className={styles.confirmRowLabel}>Name</span>
            <span className={styles.confirmRowValue}>{memberDetails.firstName} {memberDetails.lastName}</span>
          </div>
          <div className={styles.confirmRow}>
            <span className={styles.confirmRowLabel}>Email</span>
            <span className={styles.confirmRowValue}>{memberDetails.email}</span>
          </div>
          <div className={styles.confirmRow}>
            <span className={styles.confirmRowLabel}>Phone</span>
            <span className={styles.confirmRowValue}>{memberDetails.phone || '—'}</span>
          </div>
          <div className={styles.confirmRow}>
            <span className={styles.confirmRowLabel}>Member Type</span>
            <span className={styles.confirmRowValue}>{memberDetails.isNewMember ? 'New Member (Free Trial)' : 'Existing Member'}</span>
          </div>
          <div className={styles.confirmRow}>
            <span className={styles.confirmRowLabel}>&nbsp;</span>
            <button className={styles.confirmEditBtn} onClick={() => onEditStep(2)}>Edit</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar Summary ───
function BookingSummary({ booking }: { booking: BookingState }) {
  const { selectedClass, selectedDate, selectedTimeSlot, memberDetails } = booking
  const hasAny = selectedClass || selectedDate || selectedTimeSlot

  return (
    <div className={styles.sidebarCard}>
      <div className={styles.sidebarTitle}>Booking Summary</div>
      {!hasAny ? (
        <p className={styles.sidebarEmpty}>Select a class to get started.</p>
      ) : (
        <>
          {selectedClass && (
            <>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarItemLabel}>Class</span>
                <span className={styles.sidebarItemValue}>{selectedClass.name}</span>
                <span className={styles.sidebarItemValueSub}>{selectedClass.trainer}</span>
              </div>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarItemLabel}>Duration</span>
                <span className={styles.sidebarItemValue}>{formatDuration(selectedClass.duration)}</span>
              </div>
            </>
          )}
          {selectedDate && (
            <div className={styles.sidebarItem}>
              <span className={styles.sidebarItemLabel}>Date</span>
              <span className={styles.sidebarItemValue}>
                {selectedDate.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}
          {selectedTimeSlot && (
            <div className={styles.sidebarItem}>
              <span className={styles.sidebarItemLabel}>Time</span>
              <span className={styles.sidebarItemValue}>{selectedTimeSlot.time}</span>
            </div>
          )}
          {memberDetails?.firstName && (
            <div className={styles.sidebarItem}>
              <span className={styles.sidebarItemLabel}>Member</span>
              <span className={styles.sidebarItemValue}>{memberDetails.firstName} {memberDetails.lastName}</span>
            </div>
          )}
          {selectedClass && (
            <div className={styles.sidebarTotal}>
              <span className={styles.sidebarTotalLabel}>Total</span>
              <span className={styles.sidebarTotalAmount}>
                {memberDetails?.isNewMember ? 'Free' : formatPrice(selectedClass.price)}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Success Screen ───
function SuccessScreen({ booking, onReset }: { booking: BookingState; onReset: () => void }) {
  const { selectedClass, selectedDate, selectedTimeSlot, memberDetails } = booking

  return (
    <div className={styles.successScreen}>
      <div className={styles.successIcon}>
        <CheckCircle size={36} />
      </div>
      <h2 className={styles.successTitle}>You're booked in.</h2>
      <p className={styles.successSubtitle}>
        A confirmation has been sent to {memberDetails?.email}. We'll see you on the floor.
      </p>

      <div className={styles.successCard}>
        <p className={styles.successCardTitle}>Booking Confirmation</p>
        {selectedClass && (
          <>
            <div className={styles.successDetail}>
              <span className={styles.successDetailLabel}>Class</span>
              <span className={styles.successDetailValue}>{selectedClass.name}</span>
            </div>
            <div className={styles.successDetail}>
              <span className={styles.successDetailLabel}>Trainer</span>
              <span className={styles.successDetailValue}>{selectedClass.trainer}</span>
            </div>
          </>
        )}
        {selectedDate && (
          <div className={styles.successDetail}>
            <span className={styles.successDetailLabel}>Date</span>
            <span className={styles.successDetailValue}>
              {selectedDate.toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        )}
        {selectedTimeSlot && (
          <div className={styles.successDetail}>
            <span className={styles.successDetailLabel}>Time</span>
            <span className={styles.successDetailValue}>{selectedTimeSlot.time}</span>
          </div>
        )}
        {memberDetails && (
          <div className={styles.successDetail}>
            <span className={styles.successDetailLabel}>Member</span>
            <span className={styles.successDetailValue}>{memberDetails.firstName} {memberDetails.lastName}</span>
          </div>
        )}
        {selectedClass && (
          <div className={styles.successDetail}>
            <span className={styles.successDetailLabel}>Total Paid</span>
            <span className={styles.successDetailValue} style={{ color: 'var(--color-accent)' }}>
              {memberDetails?.isNewMember ? 'Free Trial' : formatPrice(selectedClass.price)}
            </span>
          </div>
        )}
      </div>

      <div className={styles.successActions}>
        <Link to="/" className={styles.successBtnPrimary}>Back to Home</Link>
        <button className={styles.successBtnSecondary} onClick={onReset}>
          Book Another Class
        </button>
      </div>
    </div>
  )
}

// ─── Main Booking Page ───
export default function Booking() {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(0)
  const [booking, setBooking] = useState<BookingState>(initialBooking)
  const [memberDetails, setMemberDetails] = useState<MemberDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isNewMember: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Pre-select class from URL param
  useEffect(() => {
    const classId = searchParams.get('class')
    if (classId) {
      const found = gymClasses.find(c => c.id === classId)
      if (found) {
        setBooking(b => ({ ...b, selectedClass: found }))
      }
    }
  }, [searchParams])

  const canAdvance = () => {
    if (step === 0) return !!booking.selectedClass
    if (step === 1) return !!booking.selectedDate && !!booking.selectedTimeSlot
    if (step === 2) return !!memberDetails.firstName && !!memberDetails.lastName && !!memberDetails.email
    return true
  }

  const advance = () => {
    if (step === 2) {
      setBooking(b => ({ ...b, memberDetails }))
    }
    if (step === 3) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setSubmitted(true)
      }, 1200)
      return
    }
    setStep(s => s + 1)
  }

  const back = () => setStep(s => s - 1)
  const editStep = (s: number) => setStep(s)

  const reset = () => {
    setBooking(initialBooking)
    setMemberDetails({ firstName: '', lastName: '', email: '', phone: '', isNewMember: false })
    setStep(0)
    setSubmitted(false)
  }

  const fullBooking: BookingState = { ...booking, memberDetails }

  if (submitted) {
    return (
      <div style={{ paddingTop: 'var(--navbar-height)' }}>
        <div className="container">
          <SuccessScreen booking={fullBooking} onReset={reset} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.bookingPage}>
      <div className={styles.bookingHeader}>
        <div className="container">
          <h1 className={styles.bookingHeaderTitle}>Book a Session</h1>
          <div className={styles.stepsBar}>
            {STEPS.map((label, i) => (
              <React.Fragment key={label}>
                <div className={styles.stepItem}>
                  <div className={cn(
                    styles.stepNumber,
                    i < step && styles.stepNumberComplete,
                    i === step && styles.stepNumberActive,
                  )}>
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={cn(styles.stepLabel, i === step && styles.stepLabelActive)}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn(styles.stepConnector, i < step && styles.stepConnectorComplete)} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.bookingLayout}>
          <div className={styles.bookingPanel}>
            {step === 0 && (
              <StepSelectClass
                selected={booking.selectedClass}
                onSelect={(c) => setBooking(b => ({ ...b, selectedClass: c }))}
              />
            )}
            {step === 1 && (
              <StepDateTime
                selectedDate={booking.selectedDate}
                selectedSlot={booking.selectedTimeSlot}
                onSelectDate={(d) => setBooking(b => ({ ...b, selectedDate: d, selectedTimeSlot: null }))}
                onSelectSlot={(s) => setBooking(b => ({ ...b, selectedTimeSlot: s }))}
              />
            )}
            {step === 2 && (
              <StepMemberDetails
                details={memberDetails}
                onChange={setMemberDetails}
              />
            )}
            {step === 3 && (
              <StepConfirm
                booking={fullBooking}
                onEditStep={editStep}
              />
            )}

            <div className={styles.bookingNav}>
              {step > 0 && (
                <button className={styles.navBtnBack} onClick={back}>
                  <ChevronLeft size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Back
                </button>
              )}
              <button
                className={styles.navBtnNext}
                onClick={advance}
                disabled={!canAdvance() || loading}
              >
                {loading
                  ? 'Confirming...'
                  : step === 3
                  ? 'Confirm Booking'
                  : <>Next <ChevronRight size={14} style={{ display: 'inline', marginLeft: '4px' }} /></>
                }
              </button>
            </div>
          </div>

          <div className={styles.bookingSidebar}>
            <BookingSummary booking={fullBooking} />
          </div>
        </div>
      </div>
    </div>
  )
}
