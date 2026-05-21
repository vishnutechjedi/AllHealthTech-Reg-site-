import { Link } from 'react-router-dom'
import { linkBtn } from '../ui/buttonClasses'
import { ArrowRightIcon } from '../icons'

const audiences = [
  'Healthtech founders and operators',
  'Venture capitalists and angel investors',
  'Hospital leaders: CDTOs, CMOs, and operators',
  'Diagnostics, payers, and digital health stakeholders',
  'Hospital and clinical management systems',
  'Policy and ecosystem enablers',
  'Martech, adtech, fintech, and health adjacencies',
  'Academia and research institutions',
]

export default function FeaturedSpeakers() {
  return (
    <section className="bg-[var(--color-navy)] px-4 py-20 text-[var(--text-on-dark)] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-bridge)]">
            Who it&apos;s for
          </p>
          <h2 className="font-[var(--font-display)] text-[clamp(2.4rem,5vw,5.4rem)] font-normal leading-[0.98] text-[var(--text-on-dark)]">
            The room is selective by design.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-[1.65] text-[var(--color-frost)]">
            If you are actively building, investing in, operating, or shaping healthcare, this gathering is built around your questions.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link to="/register" className={linkBtn.primaryMd}>
              Register as a startup
            </Link>
            <Link to="/contact" className={`${linkBtn.ghostOnDarkMd} gap-2`}>
              Register as a partner
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-card)] border border-[rgba(250,243,255,0.15)] bg-[rgba(250,243,255,0.15)] sm:grid-cols-2">
          {audiences.map((audience, index) => (
            <div
              key={audience}
              className="bg-[var(--color-blue-deep)] p-6 transition duration-300 hover:bg-[rgba(0,25,196,0.85)]"
            >
              <span className="text-xs font-semibold text-[var(--color-bridge)]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="mt-8 min-h-16 text-xl font-semibold leading-snug text-[var(--text-on-dark)]">
                {audience}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
