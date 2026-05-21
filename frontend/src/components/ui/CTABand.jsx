import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '../icons'

export default function CTABand({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  className = '',
}) {
  return (
    <section
      className={[
        'bg-[var(--color-blue-core)] rounded-[var(--radius-card)] text-[var(--text-on-dark)]',
        'px-4 py-16 sm:px-6 lg:px-8 lg:m-16',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-frost)]">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mt-3 max-w-3xl font-[var(--font-display)] text-[clamp(2rem,4vw,3.5rem)] font-normal leading-tight">
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
              <Link
                to={primaryCta.to}
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-warm-white)] px-6 py-3.5 text-[13px] font-medium text-[var(--text-primary)] transition duration-300 hover:-translate-y-0.5"
              >
                {primaryCta.label}
                {primaryCta.showArrow !== false && <ArrowRightIcon className="h-4 w-4" />}
              </Link>
            )}
            {secondaryCta && (
              <Link
                to={secondaryCta.to}
                className="inline-flex items-center justify-center rounded-[var(--radius-pill)] border-[1.5px] border-[rgba(250,243,255,0.35)] px-6 py-3.5 text-[13px] font-medium text-[var(--text-on-dark)] transition duration-300 hover:bg-[rgba(250,243,255,0.08)]"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
