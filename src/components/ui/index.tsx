import { Link } from 'react-router-dom'
import { Clock, Users, Zap, Star } from 'lucide-react'
import type { GymClass, Trainer, Testimonial } from '../../types'
import { cn, formatDuration, formatPrice } from '../../utils'
import styles from './ui.module.css'

// ─── Stars ───────────────────────────────────────
export function Stars({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className={styles.stars} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={12}
          className={cn(styles.star, i < rating && styles.starFilled)}
          fill={i < rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  )
}

// ─── SectionHeader ───────────────────────────────
interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  light?: boolean
}

export function SectionHeader({ eyebrow, title, subtitle, align = 'center', light }: SectionHeaderProps) {
  return (
    <div className={cn(styles.sectionHeader, align === 'center' && styles.sectionHeaderCenter)}>
      {eyebrow && <span className={cn(styles.eyebrow, light && styles.eyebrowLight)}>{eyebrow}</span>}
      <h2 className={styles.sectionTitle}>{title}</h2>
      {subtitle && <p className={cn(styles.sectionSubtitle, light && styles.sectionSubtitleLight)}>{subtitle}</p>}
    </div>
  )
}

// ─── ClassCard ───────────────────────────────────
interface ClassCardProps {
  gymClass: GymClass
  onBook?: (c: GymClass) => void
  compact?: boolean
}

export function ClassCard({ gymClass, onBook, compact }: ClassCardProps) {
  const spotsPercent = (gymClass.spotsRemaining / gymClass.spotsTotal) * 100
  const isFull = gymClass.spotsRemaining === 0
  const isAlmostFull = spotsPercent <= 30

  return (
    <div className={cn(styles.classCard, compact && styles.classCardCompact)}>
      {!compact && (
        <div className={styles.classCardImage}>
          <img src={gymClass.image} alt={gymClass.name} loading="lazy" />
          <div className={styles.classCardOverlay} />
          <span className={cn(
            styles.difficultyBadge,
            gymClass.difficulty === 'Beginner' && styles.difficultyBeginner,
            gymClass.difficulty === 'Intermediate' && styles.difficultyIntermediate,
            gymClass.difficulty === 'Advanced' && styles.difficultyAdvanced,
          )}>
            {gymClass.difficulty}
          </span>
          <span className={styles.categoryBadge}>{gymClass.category}</span>
        </div>
      )}

      <div className={styles.classCardBody}>
        {compact && (
          <div className={styles.classCardCompactHeader}>
            <span className={styles.categoryBadgeInline}>{gymClass.category}</span>
            <span className={cn(
              styles.difficultyBadgeInline,
              gymClass.difficulty === 'Beginner' && styles.difficultyBeginner,
              gymClass.difficulty === 'Intermediate' && styles.difficultyIntermediate,
              gymClass.difficulty === 'Advanced' && styles.difficultyAdvanced,
            )}>
              {gymClass.difficulty}
            </span>
          </div>
        )}

        <h3 className={styles.className}>{gymClass.name}</h3>
        <p className={styles.classTrainer}>{gymClass.trainer}</p>

        {!compact && (
          <p className={styles.classDesc}>{gymClass.description}</p>
        )}

        <div className={styles.classMeta}>
          <span className={styles.classMetaItem}>
            <Clock size={13} />
            {formatDuration(gymClass.duration)}
          </span>
          <span className={styles.classMetaItem}>
            <Users size={13} />
            {gymClass.spotsRemaining} left
          </span>
          <span className={styles.classMetaItem}>
            <Zap size={13} />
            {gymClass.schedule.days.join(', ')}
          </span>
        </div>

        <div className={styles.spotsBar}>
          <div
            className={cn(
              styles.spotsBarFill,
              isAlmostFull && styles.spotsBarFillWarning,
              isFull && styles.spotsBarFillFull,
            )}
            style={{ width: `${100 - spotsPercent}%` }}
          />
        </div>
        {isAlmostFull && !isFull && (
          <p className={styles.spotsWarning}>Only {gymClass.spotsRemaining} spots remaining</p>
        )}

        <div className={styles.classCardFooter}>
          <span className={styles.classPrice}>{formatPrice(gymClass.price)}<span className={styles.classPricePer}>/session</span></span>
          {onBook ? (
            <button
              className={cn(styles.bookBtn, isFull && styles.bookBtnDisabled)}
              onClick={() => !isFull && onBook(gymClass)}
              disabled={isFull}
            >
              {isFull ? 'Full' : 'Book Now'}
            </button>
          ) : (
            <Link
              to={isFull ? '#' : `/booking?class=${gymClass.id}`}
              className={cn(styles.bookBtn, isFull && styles.bookBtnDisabled)}
            >
              {isFull ? 'Full' : 'Book Now'}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── TrainerCard ─────────────────────────────────
interface TrainerCardProps {
  trainer: Trainer
  featured?: boolean
}

export function TrainerCard({ trainer, featured }: TrainerCardProps) {
  return (
    <div className={cn(styles.trainerCard, featured && styles.trainerCardFeatured)}>
      <div className={styles.trainerImageWrap}>
        <img src={trainer.image} alt={trainer.name} loading="lazy" className={styles.trainerImage} />
        <div className={styles.trainerImageOverlay} />
      </div>
      <div className={styles.trainerBody}>
        <div className={styles.trainerMeta}>
          <h3 className={styles.trainerName}>{trainer.name}</h3>
          <p className={styles.trainerTitle}>{trainer.title}</p>
          {trainer.instagram && (
            <span className={styles.trainerInstagram}>{trainer.instagram}</span>
          )}
        </div>
        <p className={styles.trainerBio}>{trainer.bio}</p>
        <div className={styles.trainerSpecialties}>
          {trainer.specialties.map((s) => (
            <span key={s} className={styles.specialtyTag}>{s}</span>
          ))}
        </div>
        <div className={styles.trainerCerts}>
          {trainer.certifications.map((c) => (
            <div key={c} className={styles.certItem}>
              <span className={styles.certDot} />
              <span className={styles.certText}>{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── TestimonialCard ─────────────────────────────
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className={styles.testimonialCard}>
      <div className={styles.testimonialQuote}>"</div>
      <p className={styles.testimonialText}>{testimonial.text}</p>
      <Stars rating={testimonial.rating} />
      <div className={styles.testimonialAuthor}>
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className={styles.testimonialAvatar}
          loading="lazy"
        />
        <div>
          <p className={styles.testimonialName}>{testimonial.name}</p>
          <p className={styles.testimonialRole}>
            {testimonial.role} · Since {testimonial.memberSince}
          </p>
        </div>
      </div>
    </div>
  )
}
