export default function GridOverlay({ className = '' }) {
  return (
    <div
      className={['absolute inset-0 opacity-[0.08]', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      style={{
        backgroundImage:
          'linear-gradient(rgba(214, 207, 255, 0.38) 1px, transparent 1px), linear-gradient(90deg, rgba(214, 207, 255, 0.28) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
      }}
    />
  )
}
