const variants = {
  dark: 'border-[rgba(250,243,255,0.34)] bg-[rgba(250,243,255,0.10)] text-[var(--color-frost)]',
  light: 'border-[var(--color-mist)] bg-[var(--color-frost)] text-[var(--text-muted)]',
}

export default function Eyebrow({ children, variant = 'dark', accent = false, className = '' }) {
  return (
    <p
      className={[
        'mb-5 w-fit rounded-[var(--radius-pill)] border px-4 py-2',
        'text-[11px] font-semibold uppercase tracking-[0.12em]',
        variants[variant] ?? variants.dark,
        accent ? 'border-[rgba(235,66,250,0.45)]' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </p>
  )
}
