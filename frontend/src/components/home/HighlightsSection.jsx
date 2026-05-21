import { BrainIcon, PillIcon, ShieldIcon, MicroscopeIcon, ChartIcon, NetworkIcon } from '../icons'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import Badge from '../ui/Badge'

const tracks = [
  {
    icon: BrainIcon,
    title: 'AI & Diagnostics',
    description: 'Explore how machine learning and computer vision are transforming clinical decision-making and early disease detection.',
    tag: 'AI Track',
  },
  {
    icon: PillIcon,
    title: 'Digital Therapeutics',
    description: 'Evidence-based software interventions delivering clinical outcomes — from mental health apps to chronic disease management.',
    tag: 'DTx Track',
  },
  {
    icon: ShieldIcon,
    title: 'Health Data & Privacy',
    description: 'Navigating data governance, patient consent, and security in an era of interconnected health systems.',
    tag: 'Data Track',
  },
  {
    icon: MicroscopeIcon,
    title: 'MedTech Innovation',
    description: 'Wearables, point-of-care diagnostics, surgical robotics, and the devices redefining clinical practice.',
    tag: 'MedTech Track',
  },
  {
    icon: ChartIcon,
    title: 'Investment & Growth',
    description: 'Funding landscapes, startup ecosystems, and the business models driving sustainable health-tech ventures.',
    tag: 'Investment Track',
  },
  {
    icon: NetworkIcon,
    title: 'Interoperability',
    description: 'FHIR, HL7, and the standards enabling seamless data exchange across hospitals, labs, and payers.',
    tag: 'Standards Track',
  },
]

function TrackCard({ icon: Icon, title, description, tag, index }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })
  const delays = ['', 'delay-100', 'delay-200', 'delay-100', 'delay-200', 'delay-300']

  return (
    <div
      ref={ref}
      className={[
        'group relative cursor-default overflow-hidden rounded-[var(--radius-card)]',
        'border border-[var(--color-mist)] bg-[var(--color-warm-white)] p-7',
        'shadow-[var(--shadow-card)] transition-all duration-300',
        'hover:-translate-y-1 hover:border-[var(--color-bridge)] hover:shadow-[0_12px_35px_rgba(0,14,122,0.12)]',
        'fade-up-eventor',
        delays[index],
        isVisible ? 'visible' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="relative z-10">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-mist)] bg-[var(--color-frost)] transition-all duration-300 group-hover:border-[var(--color-bridge)] group-hover:scale-105">
          <Icon className="h-7 w-7 text-[var(--color-bridge)] transition-colors duration-300" />
        </div>

        <h3 className="mb-3 text-lg font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--color-blue-deep)]">
          {title}
        </h3>

        <p className="mb-5 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>

        <Badge variant="default">{tag}</Badge>
      </div>
    </div>
  )
}

export default function HighlightsSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.3 })

  return (
    <section className="bg-[var(--color-frost)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div
          ref={headerRef}
          className={`mb-14 text-center fade-up-eventor ${headerVisible ? 'visible' : ''}`}
        >
          <span className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Conference Tracks
          </span>
          <h2 className="mb-4 font-[var(--font-display)] text-4xl font-normal leading-tight text-[var(--text-primary)]">
            Six Tracks. One Vision.
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
            Deep-dive sessions curated by domain experts across the full spectrum of health technology.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track, index) => (
            <TrackCard key={track.title} {...track} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
