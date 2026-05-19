import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useUIStore from '../../stores/uiStore'
import { MenuIcon, XIcon } from '../icons'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/agenda', label: 'Agenda' },
  { to: '/speakers', label: 'Speakers' },
  { to: '/contact', label: 'Contact' },
]

function LogoMark() {
  return (
    <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-brand flex-shrink-0">
      <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M1.5 12.5V5.5C1.5 4.1 2.4 3.2 3.8 3.2H6.2C7.6 3.2 8.5 4.1 8.5 5.5V8.5H1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.5 8.5V12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M11.5 3.2H18.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M15 3.2V12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M11.5 8.5H18.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

export default function Navbar() {
  const { mobileMenuOpen, toggleMobileMenu } = useUIStore()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gradient-to-r from-white to-[#F5F9FF] backdrop-blur-[20px] bg-opacity-90 border-b border-[#E8F0FF]' 
        : 'bg-transparent backdrop-blur-0 border-b border-transparent'
    }`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20 md:h-16">
        {/* Logo with Eventor styling */}
        <NavLink to="/" className="flex items-center gap-2.5 group flex-shrink-0" onClick={() => mobileMenuOpen && toggleMobileMenu()}>
          <LogoMark />
          <div className="flex flex-col leading-none">
            <span className={`font-[var(--font-primary)] font-black text-[15px] tracking-tight transition-colors ${
              isScrolled ? 'text-[#1F2937]' : 'text-[#1F2937]'
            }`}>
              All<span className="text-[#3B82F6]">Health</span>Tech
            </span>
            <span className="text-[#3B82F6] text-[10px] font-[var(--font-secondary)] font-bold uppercase tracking-widest">2026</span>
          </div>
        </NavLink>

        {/* Desktop nav links with Eventor styling */}
        <ul className="hidden lg:flex items-center gap-0.5">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => [
                  'relative px-3.5 py-2 rounded-[var(--radius-md)] text-sm',
                  'font-[var(--font-secondary)] font-medium',
                  'transition-all duration-[var(--transition-eventor-fast)]',
                  isActive
                    ? isScrolled ? 'text-[#3B82F6]' : 'text-[#1F2937]'
                    : isScrolled 
                      ? 'text-[#2D3748] hover:text-[#3B82F6] hover:bg-[rgba(59,130,246,0.1)]'
                      : 'text-[#1F2937] hover:text-[#3B82F6] hover:bg-[rgba(59,130,246,0.1)]',
                ].join(' ')}
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <span 
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-0.5 rounded-full transition-colors ${
                          isScrolled ? 'bg-[#3B82F6]' : 'bg-[#3B82F6]'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA + hamburger with Eventor styling */}
        <div className="flex items-center gap-3">
          <NavLink
            to="/register"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[var(--radius-lg)] text-white text-sm font-[var(--font-secondary)] font-semibold transition-all duration-[var(--transition-eventor-normal)] hover:shadow-lg hover:-translate-y-[1px] bg-gradient-to-r from-[#3B82F6] to-[#0EA5E9] hover:from-[#2563EB] hover:to-[#0284C7]"
          >
            Register Now
          </NavLink>
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={toggleMobileMenu}
            className={`lg:hidden p-2 rounded-[var(--radius-md)] transition-colors ${
              isScrolled
                ? 'text-[#2D3748] hover:text-[#3B82F6] hover:bg-[rgba(59,130,246,0.1)]'
                : 'text-[#1F2937] hover:text-[#3B82F6] hover:bg-[rgba(59,130,246,0.1)]'
            }`}
          >
            {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile slide-down menu with Eventor dark background */}
      <div
        className={[
          'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="bg-[#F0F4FF] border-t border-[#E8F0FF] px-4 pb-5 pt-3">
          <ul className="flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={toggleMobileMenu}
                  className={({ isActive }) => [
                    'block px-4 py-2.5 rounded-[var(--radius-lg)] text-sm',
                    'font-[var(--font-secondary)] font-medium transition-colors',
                    isActive
                      ? 'text-[#3B82F6] bg-[rgba(59,130,246,0.1)] font-semibold'
                      : 'text-[#2D3748] hover:text-[#3B82F6] hover:bg-[rgba(59,130,246,0.1)]',
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
                className="block px-4 py-3 rounded-[var(--radius-lg)] bg-gradient-to-r from-[#3B82F6] to-[#0EA5E9] text-white text-sm font-[var(--font-secondary)] font-semibold text-center hover:from-[#2563EB] hover:to-[#0284C7] transition-all"
              >
                Register Now
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
