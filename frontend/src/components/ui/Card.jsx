export default function Card({
  children,
  className = '',
  hover = true,
  variant = 'default',
  surface = 'ice',
  interactive = false,
}) {
  const surfaceBg = surface === 'frost' ? 'bg-white' : 'bg-[var(--color-warm-white)]'

  const baseClasses = [
    surfaceBg,
    'rounded-[var(--radius-card)]',
    'border border-[var(--color-mist)]',
    'shadow-[var(--shadow-card)]',
    'p-5 sm:p-6',
    'transition-all duration-300 ease-out',
  ]

  const hoverClasses = hover
    ? [
        'hover:shadow-[0_12px_35px_rgba(0,14,122,0.12)]',
        'hover:-translate-y-0.5',
        'hover:border-[var(--color-bridge)]',
      ]
    : []

  const interactiveClasses = interactive ? ['cursor-pointer', 'hover:scale-[1.01]'] : []

  const variantClasses = {
    default: [],
    speaker: ['overflow-hidden'],
    agenda: ['border-[var(--color-blue-core)]/20'],
    sponsor: ['text-center'],
    feature: ['relative overflow-hidden'],
    dark: [
      'bg-[var(--color-navy)]',
      'border-[rgba(250,243,255,0.15)]',
      'text-[var(--text-on-dark)]',
    ],
  }

  const allClasses = [
    ...baseClasses,
    ...hoverClasses,
    ...interactiveClasses,
    ...(variantClasses[variant] || []),
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={allClasses}>{children}</div>
}
