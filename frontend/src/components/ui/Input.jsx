export default function Input({
  label,
  error,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  ...ariaProps
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-[var(--font-body)] font-medium text-[var(--text-secondary)]"
        >
          {label}
          {required && (
            <span className="text-[var(--color-blue-deep)] ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...ariaProps}
        className={[
          'w-full rounded-[var(--radius-pill)] border-[1.5px] px-4 py-3.5',
          'font-[var(--font-body)] text-sm',
          'transition-all duration-[var(--transition-normal)]',
          'focus:outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2',
          'min-h-[44px]',
          disabled
            ? 'bg-[var(--color-frost)] border-[var(--color-mist)] text-[var(--color-disabled-text)] cursor-not-allowed'
            : error
              ? 'border-[var(--color-error)] bg-[rgba(200,0,42,0.04)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-error)]'
              : 'border-[var(--color-mist)] bg-[var(--color-warm-white)] text-[var(--text-primary)] placeholder-[var(--text-muted)] hover:border-[var(--color-bridge)] focus:border-[var(--color-blue-core)]',
          className,
        ].join(' ')}
      />
      {error && (
        <p
          id={`${id}-error`}
          className="text-xs text-[var(--color-error)] font-[var(--font-body)] font-medium flex items-center gap-1.5"
          role="alert"
          aria-live="polite"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
