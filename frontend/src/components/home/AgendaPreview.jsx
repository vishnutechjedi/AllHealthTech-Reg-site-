import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '../icons'

const differences = [
  {
    title: 'Curated, not crowded',
    text: 'A group of high-intent leaders chosen for the conversations they can move forward.',
  },
  {
    title: 'Expert-first conversations',
    text: 'Less theory, more lived experience from people building inside complex healthcare systems.',
  },
  {
    title: 'Cross-ecosystem perspective',
    text: 'Startups, hospitals, capital, policy, and academia in the same room.',
  },
  {
    title: 'Built for interaction',
    text: 'Panels, workshops, and real networking designed for participation, not passive listening.',
  },
]

const themes = [
  'Scaling healthtech startups in complex systems',
  'Hospital-startup collaboration: what works and what does not',
  'The role of capital in shaping healthcare innovation',
  'Interoperability, data, and digital infrastructure',
  'What the next decade of healthcare looks like',
]

export default function AgendaPreview() {
  return (
    <section className="bg-[var(--color-frost)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              What makes it different
            </p>
            <h2 className="max-w-4xl font-[var(--font-display)] text-[clamp(2.3rem,5vw,5rem)] font-normal leading-[0.98] text-[var(--text-primary)]">
              Designed for conversations that would not happen on a public stage.
            </h2>
          </div>
          <div className="flex items-end">
            <p className="max-w-xl text-lg leading-[1.65] text-[var(--text-secondary)]">
              The format is practical, founder-aware, hospital-aware, and capital-aware. It is built around the friction points that decide whether healthtech scales.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {differences.map((item) => (
            <article
              key={item.title}
              className="rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <h3 className="text-xl font-semibold leading-tight text-[var(--text-primary)]">{item.title}</h3>
              <p className="mt-6 text-sm leading-6 text-[var(--text-secondary)]">{item.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid overflow-hidden rounded-[var(--radius-card)] border border-[rgba(250,243,255,0.12)] bg-[var(--color-navy)] lg:grid-cols-[0.72fr_1fr]">
          <div className="p-7 sm:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-bridge)]">
              Themes we will explore
            </p>
            <h3 className="mt-4 max-w-sm font-[var(--font-display)] text-4xl font-normal leading-tight text-[var(--text-on-dark)]">
              Practical questions, not generic tracks.
            </h3>
            <Link
              to="/agenda"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-frost)] transition duration-300 hover:gap-3 hover:text-[var(--text-on-dark)]"
            >
              View agenda
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid border-t border-[rgba(250,243,255,0.12)] lg:border-l lg:border-t-0">
            {themes.map((theme, index) => (
              <div
                key={theme}
                className="flex gap-5 border-b border-[rgba(250,243,255,0.1)] p-6 last:border-b-0 sm:p-7"
              >
                <span className="font-[var(--font-display)] text-3xl font-normal text-[var(--color-bridge)]">
                  {index + 1}
                </span>
                <p className="self-center text-lg font-medium leading-snug text-[var(--color-frost)]">{theme}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
