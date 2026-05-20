const variants = {
  default: 'bg-[var(--color-frost)] text-[var(--color-navy)]',
  mist: 'bg-[var(--color-mist)] text-[var(--text-primary)]',
  accent: 'bg-[var(--color-magenta-tint)] text-[#5B1F61] border border-[rgba(205,68,223,0.25)]',
  navy: 'bg-[var(--color-navy)] text-[var(--color-mist)]',
  outline: 'bg-transparent text-[var(--color-blue-deep)] border border-[var(--color-mist)]',
  success: 'bg-[rgba(10,123,92,0.10)] text-[var(--color-success)] border border-[rgba(10,123,92,0.25)]',
  error: 'bg-[rgba(200,0,42,0.08)] text-[var(--color-error)] border border-[rgba(200,0,42,0.25)]',
  warning: 'bg-[rgba(180,83,9,0.10)] text-[#92400E] border border-[rgba(180,83,9,0.25)]',
  info: 'bg-[var(--color-frost)] text-[var(--color-blue-deep)]',
  /* legacy aliases */
  brand: 'bg-[var(--color-blue-core)] text-white',
  gold: 'bg-[var(--color-frost)] text-[var(--color-navy)]',
}

export default function Badge({ variant = 'default', children, className = '' }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-0.5',
        'text-[11px] font-[var(--font-body)] font-medium',
        variants[variant] ?? variants.default,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
