import { Link } from 'react-router-dom'
import { trainers } from '../data'
import { TrainerCard, SectionHeader } from '../components/ui'
import styles from './Trainers.module.css'

export default function Trainers() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div className="container">
          <SectionHeader
            eyebrow="The Team"
            title="Meet your coaches"
            subtitle="Certified experts. Former athletes. Obsessive about their craft. Each one selected for their ability to push you beyond what you thought possible."
          />
        </div>
      </div>

      <section className={styles.trainersSection}>
        <div className="container">
          <div className={styles.trainersStack}>
            {trainers.map((trainer, i) => (
              <TrainerCard key={trainer.id} trainer={trainer} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.trainerPhilosophySection}>
        <div className="container">
          <div className={styles.philosophyGrid}>
            <div className={styles.philosophyText}>
              <p className={styles.philosophyQuote}>
                "Great coaching is <em>not about motivation.</em> It's about making the right thing feel inevitable."
              </p>
              <p className={styles.philosophyBody}>
                Every trainer at NOIR is selected not just for their certifications — though those are impeccable — but for their ability to see people clearly and challenge them precisely. The difference between a good session and a transformative one is the person leading it.
              </p>
            </div>
            <div className={styles.philosophyImage}>
              <img
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
                alt="Coaching"
              />
              <div className={styles.philosophyImageOverlay} />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.joinSection}>
        <div className="container">
          <h2 className={styles.joinTitle}>
            Train with the <em>best.</em>
          </h2>
          <p className={styles.joinDesc}>
            Book a session with any of our trainers, or join a group class to experience their methodology firsthand.
          </p>
          <div className={styles.joinCtas}>
            <Link to="/booking" className={styles.ctaPrimary}>Book a Class</Link>
            <Link to="/memberships" className={styles.ctaSecondary}>View Memberships</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
