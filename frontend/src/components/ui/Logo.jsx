import logoOnLight from '../../assets/png - aht-logo.png'
import logoOnDark from '../../assets/allhealth-x-tech-logo-on-dark.png'

const sizes = {
  nav: 'h-16 w-auto sm:h-[4.5rem] md:h-20 rounded-[6px]',
  footer: 'h-24 w-auto sm:h-28 rounded-[6px]',
}

/** @param {'light' | 'dark'} theme - light = ice/frost backgrounds; dark = navy/blue hero */
export default function Logo({ variant = 'nav', theme = 'light', className = '' }) {
  const src = theme === 'dark' ? logoOnDark : logoOnLight

  return (
    <img
      src={src}
      alt="All Health X Tech Summit 2026"
      className={[sizes[variant] ?? sizes.nav, 'object-contain object-left', className].filter(Boolean).join(' ')}
      decoding="async"
    />
  )
}
