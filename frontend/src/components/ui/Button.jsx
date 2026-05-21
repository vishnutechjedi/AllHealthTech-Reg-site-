import LoadingSpinner from './LoadingSpinner'

const variants = {
  primary: [
    'bg-[var(--color-blue-core)] text-white',
    'hover:bg-[var(--color-blue-deep)]',
    'shadow-[0_4px_20px_rgba(0,35,253,0.25)] hover:shadow-[0_8px_30px_rgba(0,35,253,0.3)]',
    'active:scale-[0.98] hover:-translate-y-0.5',
    'transition-all duration-300 ease-out',
  ].join(' '),

  secondary: [
    'bg-transparent text-[var(--color-blue-deep)]',
    'border-[1.5px] border-[var(--color-blue-core)]',
    'hover:bg-[rgba(0,35,253,0.06)]',
    'active:scale-[0.98]',
    'transition-all duration-300 ease-out',
  ].join(' '),

  ghost: [
    'bg-transparent text-[var(--color-blue-deep)]',
    'border-[1.5px] border-[var(--color-mist)]',
    'hover:bg-[rgba(237,232,255,0.5)] hover:border-[var(--color-blue-core)]',
    'active:scale-[0.98]',
    'transition-all duration-300 ease-out',
  ].join(' '),

  'ghost-on-dark': [
    'bg-transparent text-[var(--text-on-dark)]',
    'border-[1.5px] border-[rgba(250,243,255,0.35)]',
    'hover:bg-[rgba(250,243,255,0.08)]',
    'active:scale-[0.98] hover:-translate-y-0.5',
    'transition-all duration-300 ease-out',
  ].join(' '),

  outline: [
    'bg-transparent text-[var(--color-blue-deep)]',
    'border-[1.5px] border-[var(--color-blue-core)]',
    'hover:bg-[var(--color-blue-core)] hover:text-white',
    'active:scale-[0.98]',
    'transition-all duration-300 ease-out',
  ].join(' '),

  navy: [
    'bg-[var(--color-navy)] text-[var(--text-on-dark)]',
    'hover:bg-[var(--color-abyss)]',
    'active:scale-[0.98] hover:-translate-y-0.5',
    'transition-all duration-300 ease-out',
  ].join(' '),

  accent: [
    'bg-[var(--color-magenta)] text-white',
    'hover:brightness-110',
    'shadow-[0_4px_20px_rgba(235,66,250,0.3)]',
    'active:scale-[0.98] hover:-translate-y-0.5',
    'transition-all duration-300 ease-out',
  ].join(' '),

  danger: [
    'bg-[var(--color-error)] text-white',
    'hover:brightness-95',
    'shadow-lg hover:shadow-xl',
    'active:scale-[0.98] hover:-translate-y-0.5',
    'transition-all duration-300 ease-out',
  ].join(' '),
}

const sizes = {
  sm: 'px-4 py-2 text-xs rounded-[var(--radius-pill)]',
  md: 'px-5 py-2.5 text-[13px] rounded-[var(--radius-pill)]',
  lg: 'px-6 py-3 text-sm rounded-[var(--radius-pill)]',
  xl: 'px-8 py-4 text-base rounded-[var(--radius-pill)]',
}

const lightSpinnerVariants = new Set(['primary', 'danger', 'navy', 'accent'])

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
  type = 'button',
  className = '',
  ...ariaProps
}) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      {...ariaProps}
      className={[
        'inline-flex items-center justify-center gap-2',
        'font-[var(--font-body)] font-medium',
        'cursor-pointer select-none',
        'focus:outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2',
        'min-h-[44px] min-w-[44px]',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        isDisabled
          ? 'bg-[var(--color-disabled-bg)] text-[var(--color-disabled-text)] border-[var(--color-disabled-bg)] cursor-not-allowed opacity-100 hover:transform-none hover:shadow-none active:scale-100'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading && (
        <LoadingSpinner
          size="sm"
          light={lightSpinnerVariants.has(variant)}
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}
