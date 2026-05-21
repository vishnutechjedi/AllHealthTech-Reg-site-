import LoadingSpinner from './LoadingSpinner'
import { btnBase, btnVariants, btnSizes, btnDisabled } from './buttonClasses'

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
        btnBase,
        isDisabled ? btnDisabled : (btnVariants[variant] ?? btnVariants.primary),
        btnSizes[size] ?? btnSizes.md,
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
