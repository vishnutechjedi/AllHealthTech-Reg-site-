import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '../icons'

const partnerSlots = ['HealthTech Alpha', 'Partner', 'Sponsor', 'Ecosystem Ally']

const ghostCtaClass =
  'inline-flex items-center justify-center rounded-[var(--radius-pill)] border-[1.5px] border-[rgba(250,243,255,0.35)] px-6 py-3.5 text-[13px] font-medium text-[var(--text-on-dark)] transition duration-300 hover:bg-[rgba(250,243,255,0.08)]'

export default function SponsorsSection() {
  return (
    <section className="bg-[var(--color-ice)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              About AHT
            </p>
            <h2 className="font-[var(--font-display)] text-[clamp(2rem,5vw,5rem)] font-normal leading-[0.98] text-[var(--text-primary)]">
              We do not just report on the ecosystem. We bring it together.
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-[1.65] text-[var(--text-secondary)]">
            <p>
              All Health Tech is a platform focused on healthtech insights, trends, and stories
              shaping the future of healthcare.
            </p>
            <p>
              AllHealth X Tech extends that mission by bringing startups, hospitals, capital,
              policy, and research into one focused room.
            </p>
            <p className="font-semibold text-[var(--text-primary)]">
              In partnership with HealthTech Alpha, a global healthtech intelligence platform.
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
          {partnerSlots.map((slot) => (
            <div
              key={slot}
              className="flex aspect-[3/2] items-center justify-center rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] p-5 text-center shadow-[var(--shadow-card)]"
            >
              <span className="text-sm font-semibold tracking-wide text-[var(--color-navy)]">
                {slot}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-16 grid overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-blue-core)] text-[var(--text-on-dark)] shadow-[0_30px_80px_rgba(0,35,253,0.22)] lg:grid-cols-[1fr_auto]">
          <div className="p-8 sm:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-frost)]">
              Final CTA
            </p>
            <h3 className="mt-4 max-w-3xl font-[var(--font-display)] text-4xl font-normal leading-tight text-[var(--text-on-dark)] sm:text-5xl">
              Join the room where healthtech conversations actually happen.
            </h3>
            <p className="mt-5 text-lg text-[var(--color-frost)]">
              Limited seats. Curated participation.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 border-t border-[rgba(250,243,255,0.2)] p-8 sm:flex-row lg:min-w-[330px] lg:flex-col lg:border-l lg:border-t-0">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-warm-white)] px-6 py-3.5 text-[13px] font-medium text-[var(--text-primary)] transition duration-300 hover:-translate-y-0.5"
            >
              Register to Attend
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link to="/contact" className={ghostCtaClass}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
