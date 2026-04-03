import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gymClasses } from '../data'
import { ClassCard, SectionHeader } from '../components/ui'
import type { GymClass } from '../types'
import styles from './Classes.module.css'

const CATEGORIES = ['All', 'Yoga', 'HIIT', 'Strength', 'Cardio', 'Pilates', 'Boxing', 'Cycling', 'Barre']

export default function Classes() {
  const [activeCategory, setActiveCategory] = useState('All')
  const navigate = useNavigate()

  const filtered = activeCategory === 'All'
    ? gymClasses
    : gymClasses.filter((c) => c.category === activeCategory)

  const handleBook = (c: GymClass) => {
    navigate(`/booking?class=${c.id}`)
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className="container">
          <div className={styles.pageHeaderInner}>
            <SectionHeader
              eyebrow="The Schedule"
              title="Classes & Training"
              subtitle="Eight disciplines. Every level. Serious programming."
              align="left"
            />
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.filterBar}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.classesContent}>
          <p className={styles.classesCount}>
            Showing {filtered.length} class{filtered.length !== 1 ? 'es' : ''}
            {activeCategory !== 'All' && ` in ${activeCategory}`}
          </p>
          <div className={styles.classesGrid}>
            {filtered.length === 0 ? (
              <div className={styles.emptyState}>
                <h3 className={styles.emptyStateTitle}>No classes found</h3>
                <p className={styles.emptyStateText}>Try selecting a different category.</p>
              </div>
            ) : (
              filtered.map((c) => (
                <ClassCard key={c.id} gymClass={c} onBook={handleBook} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
