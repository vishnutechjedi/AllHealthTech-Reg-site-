import Eyebrow from './Eyebrow'

const surfaces = {
  ice: {
    section: 'bg-[var(--color-ice)]',
    eyebrow: 'light',
    title: 'text-[var(--text-primary)]',
    subtitle: 'text-[var(--text-secondary)]',
  },
  frost: {
    section: 'bg-[var(--color-frost)]',
    eyebrow: 'light',
    title: 'text-[var(--text-primary)]',
    subtitle: 'text-[var(--text-secondary)]',
  },
  navy: {
    section: 'bg-[var(--color-navy)] text-[var(--text-on-dark)]',
    eyebrow: 'dark',
    title: 'text-[var(--text-on-dark)]',
    subtitle: 'text-[var(--color-frost)]',
  },
}

export default function SectionShell({
  eyebrow,
  title,
  subtitle,
  surface = 'ice',
  accentEyebrow = false,
  children,
  className = '',
  headerClassName = '',
}) {
  const tokens = surfaces[surface] ?? surfaces.ice

  return (
    <section className={[tokens.section, 'px-4 py-20 sm:px-6 lg:px-8', className].filter(Boolean).join(' ')}>
      <div className="mx-auto max-w-7xl">
        {(eyebrow || title || subtitle) && (
          <header className={headerClassName}>
            {eyebrow && (
              <Eyebrow variant={tokens.eyebrow} accent={accentEyebrow} className={surface === 'navy' ? '' : 'mb-4'}>
                {eyebrow}
              </Eyebrow>
            )}
            {title && (
              <h2
                className={[
                  'max-w-4xl font-[var(--font-display)] text-[clamp(2.3rem,5vw,5rem)] font-normal leading-[0.98]',
                  tokens.title,
                ].join(' ')}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={['mt-6 max-w-2xl text-lg leading-[1.65]', tokens.subtitle].join(' ')}>
                {subtitle}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
