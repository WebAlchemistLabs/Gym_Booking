import { Link } from 'react-router-dom'
import { ArrowRight, Dumbbell, Clock, Users, Zap, Star, Shield } from 'lucide-react'
import { gymClasses, memberships, testimonials } from '../data'
import { ClassCard, TestimonialCard, SectionHeader } from '../components/ui'
import { formatPrice } from '../utils'
import styles from './Home.module.css'

const features = [
  {
    icon: <Dumbbell size={22} />,
    title: 'Premium Equipment',
    desc: 'Rogue power racks, Olympic platforms, premium cardio machines. Every piece of equipment is maintained to professional standard.',
  },
  {
    icon: <Users size={22} />,
    title: 'Elite Trainers',
    desc: 'Certified coaches with backgrounds in competitive athletics, dance, and movement science. They teach, not just instruct.',
  },
  {
    icon: <Clock size={22} />,
    title: '24/7 Access',
    desc: 'For Adept and Sovereign members, the sanctuary is always open. Train when your body is ready, not when the clock allows.',
  },
  {
    icon: <Zap size={22} />,
    title: 'Science-Backed Programming',
    desc: 'Every class is periodized and purposeful. No filler, no trends. Just evidence-based methodology and measurable results.',
  },
  {
    icon: <Star size={22} />,
    title: 'Luxury Amenities',
    desc: 'Steam room, cold plunge, towel service, and curated locker rooms. Your recovery matters as much as your training.',
  },
  {
    icon: <Shield size={22} />,
    title: 'Exclusive Community',
    desc: 'Member events, workshops, and social runs. NOIR is a community of people who take their practice seriously.',
  },
]

export default function Home() {
  return (
    <div>
      {/* ─── Hero ─── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80"
            alt="NOIR Gym"
            className={styles.heroBgImage}
          />
          <div className={styles.heroBgOverlay} />
        </div>

        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroEyebrow}>
              <span className={styles.heroEyebrowLine} />
              Toronto's Premier Fitness Sanctuary
            </div>
            <h1 className={styles.heroTitle}>
              Discipline<br />
              <span className={styles.heroTitleItalic}>Refined.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Where aesthetic commitment meets athletic rigor. NOIR is more than a gym — it is a practice, a philosophy, and a community built around becoming more.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/booking" className={styles.ctaPrimary}>
                Book a Class
              </Link>
              <Link to="/memberships" className={styles.ctaSecondary}>
                View Memberships
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <p className={styles.heroStatNum}>12+</p>
                <p className={styles.heroStatLabel}>Weekly Classes</p>
              </div>
              <div className={styles.heroStat}>
                <p className={styles.heroStatNum}>4</p>
                <p className={styles.heroStatLabel}>Expert Trainers</p>
              </div>
              <div className={styles.heroStat}>
                <p className={styles.heroStatNum}>800+</p>
                <p className={styles.heroStatLabel}>Active Members</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.heroScrollIndicator}>
          <span className={styles.heroScrollText}>Scroll</span>
          <div className={styles.heroScrollLine} />
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className={styles.featuresSection}>
        <div className="container">
          <SectionHeader
            eyebrow="Why NOIR"
            title="Built for those who demand more"
            subtitle="Every detail of this facility was designed with one question in mind: what would make this the best possible place to train?"
          />
          <div className={styles.featuresGrid}>
            {features.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Classes ─── */}
      <section className={styles.classesSection}>
        <div className="container">
          <div className={styles.classesSectionHeader}>
            <SectionHeader
              eyebrow="The Schedule"
              title="Classes that challenge you"
              subtitle="Eight distinct disciplines, one philosophy: no wasted movement."
              align="left"
            />
            <Link to="/classes" className={styles.seeAllLink}>
              View all classes <ArrowRight size={14} />
            </Link>
          </div>
          <div className={styles.classesGrid}>
            {gymClasses.slice(0, 3).map((c) => (
              <ClassCard key={c.id} gymClass={c} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Memberships Preview ─── */}
      <section className={styles.membershipsSection}>
        <div className="container">
          <SectionHeader
            eyebrow="Memberships"
            title="Choose your tier"
            subtitle="Every level of commitment deserves the right level of access."
          />
          <div className={styles.membershipPreviewGrid}>
            {memberships.map((m) => (
              <div
                key={m.id}
                className={`${styles.membershipPreviewCard} ${m.highlight ? styles.membershipPreviewHighlight : ''}`}
              >
                {m.badge && (
                  <span className={styles.membershipPreviewBadge}>{m.badge}</span>
                )}
                <p className={styles.membershipPreviewName}>{m.name}</p>
                <div className={styles.membershipPreviewPrice}>
                  <span className={styles.membershipPreviewAmount}>{formatPrice(m.price)}</span>
                  <span className={styles.membershipPreviewPeriod}>/{m.period}</span>
                </div>
                <p className={styles.membershipPreviewDesc}>{m.description}</p>
                <ul className={styles.membershipPreviewFeatures}>
                  {m.features.slice(0, 4).map((f) => (
                    <li key={f} className={styles.membershipPreviewFeature}>
                      <span className={styles.membershipPreviewFeatureDot} />
                      {f}
                    </li>
                  ))}
                  {m.features.length > 4 && (
                    <li className={styles.membershipPreviewFeature} style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      +{m.features.length - 4} more benefits
                    </li>
                  )}
                </ul>
                <Link to="/memberships" className={styles.membershipPreviewCta}>{m.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className={styles.testimonialsSection}>
        <div className="container">
          <SectionHeader
            eyebrow="Member Stories"
            title="Spoken by those who stayed"
            subtitle="Not testimonials. Evidence."
          />
          <div className={styles.testimonialsGrid}>
            {testimonials.slice(0, 3).map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerBg}>
          <img
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&q=80"
            alt="Training"
          />
          <div className={styles.ctaBannerOverlay} />
        </div>
        <div className="container">
          <div className={styles.ctaBannerContent}>
            <h2 className={styles.ctaBannerTitle}>
              Your first class<br /><em>is on us.</em>
            </h2>
            <p className={styles.ctaBannerSubtitle}>
              New members receive one complimentary trial class. No commitment required. Just show up.
            </p>
            <div className={styles.ctaBannerActions}>
              <Link to="/booking" className={styles.ctaPrimary}>
                Claim Free Trial
              </Link>
              <Link to="/contact" className={styles.ctaSecondary}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
