const sizes = { sm: 'w-4 h-4 border-2', md: 'w-7 h-7 border-2', lg: 'w-12 h-12 border-[3px]' }

export default function LoadingSpinner({ size = 'md', className = '', light = false }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={[
        'inline-block rounded-full animate-spin',
        light
          ? 'border-white/30 border-t-white'
          : 'border-[var(--color-mist)] border-t-[var(--color-blue-core)]',
        sizes[size] ?? sizes.md,
        className,
      ].join(' ')}
    />
  )
}
