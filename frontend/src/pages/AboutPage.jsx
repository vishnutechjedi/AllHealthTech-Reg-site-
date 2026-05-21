import PageHero from '../components/ui/PageHero'
import CTABand from '../components/ui/CTABand'
import AnimatedSection from '../components/ui/AnimatedSection'

const principles = [
  {
    title: 'High-quality signal',
    text: 'The gathering is built for real insight from people operating inside healthcare, not generic panels or recycled talking points.',
  },
  {
    title: 'Cross-ecosystem depth',
    text: 'Startups, hospitals, capital, policy, and research are brought into one room because healthcare does not scale in isolation.',
  },
  {
    title: 'Practical collaboration',
    text: 'The format favors workshops, direct exchange, and partnership-building over passive listening.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <PageHero
        eyebrow="About AHT"
        accentEyebrow
        title="We do not just report on healthtech. We bring the ecosystem together."
        subtitle="All Health Tech is a platform focused on the insights, trends, and stories shaping the future of healthcare. AllHealth X Tech extends that mission into a curated closed-room gathering."
        compact
      />

      <AnimatedSection animation="fadeUp" duration={800}>
        <section className="bg-[var(--color-ice)] px-4 pb-8 pt-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {principles.map((item) => (
              <article
                key={item.title}
                className="rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] p-7 shadow-[var(--shadow-card)]"
              >
                <h2 className="text-2xl font-semibold leading-tight text-[var(--text-primary)]">{item.title}</h2>
                <p className="mt-6 text-sm leading-6 text-[var(--text-secondary)]">{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </AnimatedSection>

      <CTABand
        variant="about"
        eyebrow="AllHealth X Tech"
        title="A curated room for the people actively building healthcare's future."
        subtitle="Bangalore, July 2026. Limited seats. Curated participation. In partnership with HealthTech Alpha."
        primaryCta={{ to: '/register', label: 'Register to Attend' }}
        secondaryCta={{ to: '/contact', label: 'Partner With Us' }}
      />
    </main>
  )
}
