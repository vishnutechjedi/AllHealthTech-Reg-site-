import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import GridOverlay from './GridOverlay'
import Eyebrow from './Eyebrow'
import MetaRow from './MetaRow'
import { ArrowRightIcon } from '../icons'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
})

const primaryCtaClass =
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-blue-core)] px-6 py-3.5 text-[13px] font-medium text-white shadow-[0_18px_50px_rgba(0,14,122,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-blue-deep)]'

const ghostCtaClass =
  'inline-flex items-center justify-center rounded-[var(--radius-pill)] border-[1.5px] border-[rgba(250,243,255,0.35)] px-6 py-3.5 text-[13px] font-medium text-[var(--text-on-dark)] transition duration-300 hover:-translate-y-0.5 hover:bg-[rgba(250,243,255,0.08)]'

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  meta,
  image,
  accentEyebrow = false,
  fullHeight = false,
  compact = false,
  children,
  className = '',
}) {
  const minHeight = fullHeight ? 'min-h-[96vh]' : compact ? 'min-h-[50vh]' : 'min-h-[70vh]'
  const hasImage = Boolean(image?.src)

  return (
    <section
      className={['relative overflow-hidden text-[var(--text-on-dark)]', minHeight, className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="absolute inset-0 bg-gradient-eventor-dark" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,rgba(250,243,255,0.12),transparent)]" />
        <GridOverlay />
      </div>

      <div
        className={[
          'relative z-10 mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-28 sm:px-6 lg:px-8',
          minHeight,
          hasImage ? 'grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]' : 'grid-cols-1',
          compact ? 'pt-24 pb-12' : 'lg:pt-24',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="flex flex-col justify-center">
          {eyebrow && (
            <motion.div {...fadeUp(0)}>
              <Eyebrow variant="dark" accent={accentEyebrow}>
                {eyebrow}
              </Eyebrow>
            </motion.div>
          )}

          {title && (
            <motion.h1
              {...fadeUp(eyebrow ? 0.08 : 0)}
              className="max-w-7xl font-[var(--font-display)] text-[clamp(2rem,8vw,4rem)] font-normal leading-[0.92] text-[var(--text-on-dark)]"
            >
              {title}
            </motion.h1>
          )}

          {subtitle && (
            <motion.p
              {...fadeUp(eyebrow ? 0.16 : 0.08)}
              className={[
                'max-w-2xl leading-[1.55] text-[var(--color-frost)]',
                compact ? 'mt-5 text-lg' : 'mt-7 text-[clamp(1.15rem,2vw,1.55rem)]',
              ].join(' ')}
            >
              {subtitle}
            </motion.p>
          )}

          {(primaryCta || secondaryCta) && (
            <motion.div
              {...fadeUp(eyebrow ? 0.24 : 0.16)}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              {primaryCta && (
                <Link to={primaryCta.to} className={primaryCtaClass}>
                  {primaryCta.label}
                  {primaryCta.showArrow !== false && <ArrowRightIcon className="h-4 w-4" />}
                </Link>
              )}
              {secondaryCta && (
                <Link to={secondaryCta.to} className={ghostCtaClass}>
                  {secondaryCta.label}
                </Link>
              )}
            </motion.div>
          )}

          {meta?.length > 0 && (
            <motion.div {...fadeUp(eyebrow ? 0.32 : 0.24)} className="mt-12">
              <MetaRow items={meta} variant="dark" />
            </motion.div>
          )}

          {children}
        </div>

        {hasImage && (
          <motion.div {...fadeUp(0.18)} className="flex items-end justify-center lg:justify-end">
            <div className="relative w-full max-w-[520px]">
              <div
                className="absolute -left-8 -top-8 h-32 w-32 border border-[rgba(250,243,255,0.22)]"
                aria-hidden="true"
              />
              <img
                src={image.src}
                alt={image.alt ?? ''}
                className="relative aspect-[4/5] w-full rounded-[var(--radius-card)] border border-[rgba(250,243,255,0.22)] object-cover shadow-[0_34px_90px_rgba(0,8,74,0.38)]"
              />
              {image.quote && (
                <div className="absolute -bottom-6 right-4 max-w-[270px] rounded-[var(--radius-card)] bg-[var(--color-warm-white)] p-5 shadow-2xl">
                  <p className="text-sm font-medium leading-snug text-[var(--text-primary)]">
                    {image.quote}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
