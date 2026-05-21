export default function ErrorMessage({ message, onRetry, className = '' }) {
  if (!message) return null
  return (
    <div
      role="alert"
      className={[
        'flex items-start gap-3 rounded-[var(--radius-card)]',
        'border border-[rgba(200,0,42,0.25)] bg-[rgba(200,0,42,0.06)] p-4',
        'text-[var(--color-error)]',
        className,
      ].join(' ')}
    >
      <svg
        className="h-5 w-5 flex-shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 9v4M12 17h.01" />
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      <div className="flex-1">
        <p className="text-sm font-[var(--font-body)] font-medium">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-1.5 text-xs font-semibold text-[var(--color-blue-deep)] underline hover:no-underline focus:outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  )
}
