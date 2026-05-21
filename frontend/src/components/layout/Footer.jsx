import { NavLink } from 'react-router-dom'
import Logo from '../ui/Logo'
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

export default function Footer() {
  return (
    <footer className="relative z-20 border-t border-[rgba(250,243,255,0.12)] bg-[var(--color-navy)] text-[var(--color-frost)]">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo variant="footer" theme="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-frost)]">
              A curated, closed-room gathering for the people building healthcare&apos;s future.
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[rgba(250,243,255,0.15)] bg-[var(--color-blue-deep)] text-[var(--text-on-dark)] transition-all duration-300 hover:border-[var(--color-bridge)] hover:bg-[var(--color-blue-core)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="mb-4 text-sm font-semibold tracking-wide text-[var(--text-on-dark)]">
                {group}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {items.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className="text-sm text-[var(--color-frost)] transition-colors duration-300 hover:text-[var(--text-on-dark)]"
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[rgba(250,243,255,0.12)] pt-6 text-xs sm:flex-row">
          <p className="text-[var(--color-frost)]">
            © {new Date().getFullYear()} AllHealthTech Events. All rights reserved.
          </p>
          <div className="flex gap-5">
            <NavLink
              to="/policies"
              className="text-[var(--color-frost)] transition-colors duration-300 hover:text-[var(--text-on-dark)]"
            >
              Privacy Policy
            </NavLink>
            <NavLink
              to="/policies"
              className="text-[var(--color-frost)] transition-colors duration-300 hover:text-[var(--text-on-dark)]"
            >
              Terms of Service
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
