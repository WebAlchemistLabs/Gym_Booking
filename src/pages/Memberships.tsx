import { useState } from 'react'
import { Check, X, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { memberships, faqItems } from '../data'
import { SectionHeader } from '../components/ui'
import styles from './Memberships.module.css'

const comparisonFeatures = [
  { label: 'Unlimited gym floor access', tiers: [true, true, true] },
  { label: 'Group classes per month', tiers: ['4 classes', 'Unlimited', 'Unlimited'] },
  { label: '24/7 facility access', tiers: [false, true, true] },
  { label: 'Towel & amenity service', tiers: [false, true, true] },
  { label: 'Guest passes', tiers: [false, '2/month', 'Unlimited'] },
  { label: 'Personal training discount', tiers: [false, '10% off', 'Included'] },
  { label: 'Monthly fitness assessment', tiers: [false, true, true] },
  { label: 'Nutrition consultations', tiers: [false, false, 'Monthly'] },
  { label: 'Private studio access', tiers: [false, false, true] },
  { label: 'Dedicated concierge line', tiers: [false, false, true] },
]

const FAQ_CATEGORIES = ['all', 'general', 'membership', 'booking', 'facilities']

export default function Memberships() {
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [faqCategory, setFaqCategory] = useState('all')

  const filteredFaqs = faqCategory === 'all'
    ? faqItems
    : faqItems.filter((f) => f.category === faqCategory)

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id)
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className="container">
          <SectionHeader
            eyebrow="Memberships"
            title="Invest in your practice"
            subtitle="Three tiers. One standard: excellence. Pick the level that matches your commitment."
          />
        </div>
      </div>

      {/* Pricing */}
      <section className={styles.pricingSection}>
        <div className="container">
          <div className={styles.pricingGrid}>
            {memberships.map((m, i) => (
              <div
                key={m.id}
                className={`${styles.pricingCard} ${m.highlight ? styles.pricingCardHighlight : ''}`}
              >
                {m.badge && (
                  <span className={`${styles.pricingBadge} ${i === 2 ? styles.pricingBadgeElite : ''}`}>
                    {m.badge}
                  </span>
                )}

                <p className={styles.pricingTierName}>{m.name}</p>

                <div className={styles.pricingPriceBlock}>
                  <div className={styles.pricingAmount}>
                    <span className={styles.pricingDollar}>$</span>
                    <span className={styles.pricingNum}>{m.price}</span>
                    <span className={styles.pricingPeriod}>/{m.period}</span>
                  </div>
                  <p className={styles.pricingDesc}>{m.description}</p>
                </div>

                <ul className={styles.pricingFeatureList}>
                  {m.features.map((f) => (
                    <li key={f} className={styles.pricingFeatureItem}>
                      <Check size={14} className={styles.pricingFeatureIcon} />
                      {f}
                    </li>
                  ))}
                </ul>

                {m.notIncluded.length > 0 && (
                  <div className={styles.pricingNotIncluded}>
                    <p className={styles.pricingNotIncludedLabel}>Not included</p>
                    {m.notIncluded.map((f) => (
                      <div key={f} className={styles.pricingNotIncludedItem}>
                        <X size={13} className={styles.pricingNotIncludedIcon} />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  to="/contact"
                  className={`${styles.pricingCta} ${i === 2 ? styles.pricingCtaElite : ''}`}
                >
                  {m.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className={styles.comparisonSection}>
        <div className="container">
          <SectionHeader
            eyebrow="Compare"
            title="Feature by feature"
            subtitle="Understand exactly what each tier includes before committing."
          />
          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th className={styles.comparisonHeaderFeature}>Feature</th>
                {memberships.map((m) => (
                  <th key={m.id} className={styles.comparisonHeaderTier}>{m.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((row) => (
                <tr key={row.label}>
                  <td className={styles.comparisonFeatureLabel}>{row.label}</td>
                  {row.tiers.map((val, i) => (
                    <td key={i}>
                      {val === true ? (
                        <Check size={16} className={styles.comparisonCheck} />
                      ) : val === false ? (
                        <X size={16} className={styles.comparisonX} />
                      ) : (
                        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <div className="container">
          <SectionHeader
            eyebrow="FAQ"
            title="Common questions"
            subtitle="Everything you need to know before joining."
          />
          <div className={styles.faqCategoryFilter}>
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.faqFilterBtn} ${faqCategory === cat ? styles.faqFilterBtnActive : ''}`}
                onClick={() => setFaqCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className={styles.faqGrid}>
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={openFaq === faq.id}
                >
                  {faq.question}
                  <ChevronDown
                    size={16}
                    className={`${styles.faqChevron} ${openFaq === faq.id ? styles.faqChevronOpen : ''}`}
                  />
                </button>
                <div className={`${styles.faqAnswer} ${openFaq === faq.id ? styles.faqAnswerOpen : ''}`}>
                  <p className={styles.faqAnswerText}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
