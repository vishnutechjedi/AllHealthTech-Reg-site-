const variants = {
  dark: {
    row: 'border-t border-[rgba(250,243,255,0.2)] text-[var(--color-frost)]',
    icon: 'text-[var(--color-bridge)]',
  },
  light: {
    row: 'border-t border-[var(--color-mist)] text-[var(--text-secondary)]',
    icon: 'text-[var(--color-bridge)]',
  },
  chips: {
    row: 'rounded-[var(--radius-pill)] border border-[rgba(250,243,255,0.18)] bg-[rgba(250,243,255,0.08)] px-4 py-2.5 text-sm font-medium text-[var(--color-frost)] backdrop-blur-md',
    icon: 'text-[var(--color-bridge)]',
  },
}

export default function MetaRow({ items = [], variant = 'dark', className = '' }) {
  if (!items.length) return null

  const styles = variants[variant] ?? variants.dark
  const isChips = variant === 'chips'

  return (
    <div
      className={[
        isChips ? 'flex flex-wrap gap-2.5 sm:gap-3' : 'grid gap-3 sm:grid-cols-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {items.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className={[
            'flex items-center gap-2.5',
            isChips ? styles.row : ['gap-3 pt-4 text-sm font-medium', styles.row].join(' '),
          ].join(' ')}
        >
          <Icon className={['h-4 w-4 flex-shrink-0', styles.icon].join(' ')} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}
