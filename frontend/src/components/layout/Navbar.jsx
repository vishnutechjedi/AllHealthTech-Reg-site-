import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useUIStore from '../../stores/uiStore'
import Logo from '../ui/Logo'
import { MenuIcon, XIcon } from '../icons'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/agenda', label: 'Agenda' },
  { to: '/speakers', label: 'Speakers' },
  { to: '/contact', label: 'Contact' },
]

const DARK_HERO_ROUTES = ['/', '/about', '/agenda', '/speakers', '/contact', '/policies']

export default function Navbar() {
  const { mobileMenuOpen, toggleMobileMenu } = useUIStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const isDarkHeroPage = DARK_HERO_ROUTES.includes(location.pathname)
  const overHero = isDarkHeroPage && !isScrolled

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  const headerClass = overHero
    ? 'border-b border-transparent bg-transparent'
    : 'border-b border-[var(--color-mist)] bg-[rgba(250,243,255,0.92)] backdrop-blur-[20px]'

  const linkClass = (isActive) => {
    if (overHero) {
      return isActive
        ? 'text-[var(--text-on-dark)]'
        : 'text-[var(--color-frost)] hover:bg-[rgba(250,243,255,0.08)] hover:text-[var(--text-on-dark)]'
    }
    return isActive
      ? 'text-[var(--color-blue-deep)]'
      : 'text-[var(--text-secondary)] hover:bg-[var(--color-frost)] hover:text-[var(--color-blue-deep)]'
  }

  const activeBarClass = overHero ? 'bg-[var(--color-bridge)]' : 'bg-[var(--color-blue-core)]'

  const registerClass = overHero
    ? 'hidden items-center rounded-[var(--radius-pill)] border-[1.5px] border-[rgba(250,243,255,0.35)] px-5 py-2.5 text-[13px] font-medium text-[var(--text-on-dark)] transition-all duration-300 hover:bg-[rgba(250,243,255,0.08)] sm:inline-flex'
    : 'hidden items-center rounded-[var(--radius-pill)] bg-[var(--color-blue-core)] px-5 py-2.5 text-[13px] font-medium text-white transition-all duration-300 hover:-translate-y-px hover:bg-[var(--color-blue-deep)] sm:inline-flex'

  const menuBtnClass = overHero
    ? 'rounded-[var(--radius-md)] p-2 text-[var(--text-on-dark)] transition-colors hover:bg-[rgba(250,243,255,0.08)]'
    : 'rounded-[var(--radius-md)] p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--color-frost)] hover:text-[var(--color-blue-deep)]'

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${headerClass}`}>
      <nav className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="group flex min-w-0 flex-shrink-0 items-center"
          onClick={() => mobileMenuOpen && toggleMobileMenu()}
        >
          <Logo variant="nav" theme={overHero ? 'dark' : 'light'} />
        </NavLink>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => [
                  'relative rounded-[var(--radius-md)] px-3.5 py-2 text-sm font-medium transition-all duration-[var(--transition-fast)]',
                  linkClass(isActive),
                ].join(' ')}
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <span
                        className={`absolute bottom-0 left-1/2 h-0.5 w-full -translate-x-1/2 rounded-full ${activeBarClass}`}
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <NavLink to="/register" className={registerClass}>
            Register
          </NavLink>
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={toggleMobileMenu}
            className={`${menuBtnClass} lg:hidden`}
          >
            {mobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        className={[
          'overflow-hidden transition-all duration-300 ease-in-out lg:hidden',
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="border-t border-[var(--color-mist)] bg-[var(--color-ice)] px-4 pb-5 pt-3">
          <ul className="flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={toggleMobileMenu}
                  className={({ isActive }) => [
                    'block rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--color-frost)] font-semibold text-[var(--color-blue-deep)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--color-frost)] hover:text-[var(--color-blue-deep)]',
                  ].join(' ')}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2">
              <NavLink
                to="/register"
                onClick={toggleMobileMenu}
                className="block rounded-[var(--radius-pill)] bg-[var(--color-blue-core)] px-4 py-3 text-center text-[13px] font-medium text-white transition-all hover:bg-[var(--color-blue-deep)]"
              >
                Register
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
