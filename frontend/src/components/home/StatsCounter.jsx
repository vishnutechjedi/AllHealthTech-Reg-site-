const ecosystemStats = [
  {
    value: '~$10 Bn',
    label: 'Funding over the past decade',
    detail:
      'India healthtech funding peaked at $2.6 Bn in 2021 and continues to attract meaningful annual investment after the correction.',
  },
  {
    value: '850+',
    label: 'Deals shaping the ecosystem',
    detail:
      'Deal activity crossed 100 annual deals at its peak, signaling durable category creation across digital health, diagnostics, and infrastructure.',
  },
  {
    value: '5x',
    label: 'Growth in average deal size',
    detail:
      'Average deal size moved from about $3 Mn to $15 Mn plus, reflecting stronger conviction in scalable, category-defining companies.',
  },
  {
    value: '555+',
    label: 'Partnerships powering growth',
    detail:
      'Indian ventures are collaborating with startups, hospitals, corporates, and global players including Y Combinator and Mayo Clinic.',
  },
]

export default function StatsCounter() {
  return (
    <section className="bg-[var(--color-ice)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              What it&apos;s all about
            </p>
            <h2 className="max-w-xl font-[var(--font-display)] text-[clamp(2.3rem,5vw,5rem)] font-normal leading-[0.98] text-[var(--text-primary)]">
              One room for the ecosystem that usually works in silos.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-[1.65] text-[var(--text-secondary)]">
            AllHealth X Tech is an invite-only gathering for real conversations across healthcare. Leaders, investors, operators, and decision-makers exchange what is actually working today.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 border border-[var(--color-mist)] bg-[var(--color-warm-white)] md:grid-cols-2 lg:grid-cols-4">
          {ecosystemStats.map((stat) => (
            <article
              key={stat.label}
              className="group min-h-[260px] border-b border-[var(--color-mist)] p-6 transition duration-300 hover:bg-[var(--color-frost)] md:[&:nth-child(2n+1)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <p className="font-[var(--font-display)] text-5xl font-normal text-[var(--color-navy)] transition duration-300 group-hover:text-[var(--color-abyss)]">
                {stat.value}
              </p>
              <h3 className="mt-5 text-xl font-semibold leading-tight text-[var(--text-primary)]">{stat.label}</h3>
              <p className="mt-8 text-sm leading-6 text-[var(--text-secondary)] opacity-80 transition duration-300 group-hover:opacity-100">
                {stat.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
