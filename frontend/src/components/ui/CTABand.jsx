import { Link } from 'react-router-dom'
import { linkBtn } from './buttonClasses'
import { ArrowRightIcon } from '../icons'

const variantClasses = {
  default: 'bg-cta-band',
  about: 'bg-cta-band bg-cta-band--about',
  agenda: 'bg-cta-band bg-cta-band--agenda',
}

export default function CTABand({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  variant = 'default',
  className = '',
}) {
  const showAgendaAccent2 = variant === 'agenda'

  return (
    <section
      className={[
        variantClasses[variant] ?? variantClasses.default,
        'rounded-[var(--radius-card)]',
        'px-4 py-16 sm:px-6 lg:px-8 lg:m-16',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="cta-band-orbs" aria-hidden="true">
        <span className="cta-orb cta-orb--bridge" />
        <span className="cta-orb cta-orb--deep" />
        <span className="cta-orb cta-orb--core" />
        <span className="cta-orb cta-orb--accent" />
        {showAgendaAccent2 && <span className="cta-orb cta-orb--accent-2" />}
      </div>

      <div className="cta-band-content mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-frost)]">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mt-3 max-w-3xl font-[var(--font-display)] text-[clamp(2rem,4vw,3.5rem)] font-normal leading-tight text-[var(--text-on-dark)]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-4 max-w-xl text-lg text-[var(--color-frost)]">{subtitle}</p>
          )}
        </div>

        {(primaryCta || secondaryCta) && (
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-shrink-0">
            {primaryCta && (
              <Link to={primaryCta.to} className={`${linkBtn.primary} gap-2`}>
                {primaryCta.label}
                {primaryCta.showArrow !== false && <ArrowRightIcon className="h-4 w-4" />}
              </Link>
            )}
            {secondaryCta && (
              <Link to={secondaryCta.to} className={linkBtn.ghostOnDark}>
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
