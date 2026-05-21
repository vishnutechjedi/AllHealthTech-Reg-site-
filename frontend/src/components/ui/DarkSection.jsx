export default function DarkSection({ children, className = '', as: Tag = 'section' }) {
  return (
    <Tag
      className={[
        'bg-[var(--color-navy)] text-[var(--text-on-dark)]',
        'px-4 py-20 sm:px-6 lg:px-8',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </Tag>
  )
}
