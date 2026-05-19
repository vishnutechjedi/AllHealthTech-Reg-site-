import { NavLink } from 'react-router-dom'
import { TwitterIcon, LinkedInIcon, InstagramIcon } from '../icons'

const links = {
  Event: [
    { to: '/about', label: 'About' },
    { to: '/agenda', label: 'Agenda' },
    { to: '/speakers', label: 'Speakers' },
  ],
  Attendees: [
    { to: '/register', label: 'Register' },
    { to: '/contact', label: 'Contact' },
    { to: '/policies', label: 'Policies' },
  ],
}

const socials = [
  { icon: TwitterIcon, href: '#', label: 'Twitter / X' },
  { icon: LinkedInIcon, href: '#', label: 'LinkedIn' },
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
]

function FooterLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-[var(--radius-lg)] bg-[var(--eventor-primary)] flex items-center justify-center shadow-[var(--shadow-eventor-blue)] flex-shrink-0">
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M1.5 12.5V5.5C1.5 4.1 2.4 3.2 3.8 3.2H6.2C7.6 3.2 8.5 4.1 8.5 5.5V8.5H1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.5 8.5V12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M11.5 3.2H18.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M15 3.2V12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M11.5 8.5H18.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[var(--eventor-white)] font-[var(--font-primary)] font-black text-[15px] tracking-tight">AllHealthTech</span>
        <span className="text-[var(--eventor-primary-light)] text-[10px] font-[var(--font-secondary)] font-bold uppercase tracking-widest">Conference 2026</span>
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="relative z-20 bg-[var(--eventor-dark-800)] text-[var(--eventor-gray-100)] border-t border-[var(--eventor-dark-700)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column with Eventor styling */}
          <div className="md:col-span-2">
            <FooterLogo />
            <p className="text-sm font-[var(--font-secondary)] leading-relaxed max-w-xs mt-4">
              India's premier health technology conference. Three days of innovation, insights, and connections shaping the future of healthcare.
            </p>
            <div className="flex gap-2 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--eventor-dark-700)] border border-[var(--eventor-dark-600)] flex items-center justify-center text-[var(--eventor-gray-100)] hover:bg-[var(--eventor-primary)] hover:text-[var(--eventor-white)] hover:border-[var(--eventor-primary-light)] transition-all duration-[var(--transition-eventor-normal)]"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns with Eventor typography */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-[var(--eventor-white)] font-[var(--font-secondary)] font-semibold text-sm mb-4 tracking-wide">{group}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className="text-sm font-[var(--font-secondary)] hover:text-[var(--eventor-primary-light)] transition-colors duration-[var(--transition-eventor-fast)]"
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar with Eventor styling */}
        <div className="border-t border-[var(--eventor-dark-700)] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-[var(--font-secondary)]">
          <p>© {new Date().getFullYear()} AllHealthTech Events. All rights reserved.</p>
          <div className="flex gap-5">
            <NavLink to="/policies" className="hover:text-[var(--eventor-primary-light)] transition-colors duration-[var(--transition-eventor-fast)]">
              Privacy Policy
            </NavLink>
            <NavLink to="/policies" className="hover:text-[var(--eventor-primary-light)] transition-colors duration-[var(--transition-eventor-fast)]">
              Terms of Service
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
