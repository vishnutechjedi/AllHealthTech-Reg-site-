import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPinIcon, CalendarIcon, TicketIcon, ArrowRightIcon } from '../icons'
import heroImage from '../../assets/May 12, 2026, 10_28_12 AM.png'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut', delay },
})

const metaItems = [
  { icon: MapPinIcon, label: 'Bombay Exhibition Centre, Mumbai' },
  { icon: CalendarIcon, label: 'October 15–17, 2026' },
  { icon: TicketIcon, label: '500+ Attendees Expected' },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Layer 1: base — white to light sky blue */}
      <div
        className="absolute inset-0 gpu-accelerated"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #F0F7FF 30%, #DBEAFE 60%, #BFDBFE 100%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 2: ambient blue radial orbs */}
      <div
        className="absolute inset-0 pointer-events-none gpu-accelerated"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 900px 700px at 80% 20%, rgba(59,130,246,0.14) 0%, transparent 65%),
            radial-gradient(ellipse 700px 500px at 10% 80%, rgba(96,165,250,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 500px 400px at 50% 50%, rgba(147,197,253,0.10) 0%, transparent 55%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Layer 3: top-right blue bloom */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none gpu-accelerated"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(93,169,233,0.20) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 4: bottom-left blue bloom */}
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[400px] pointer-events-none gpu-accelerated"
        style={{
          background: 'radial-gradient(ellipse at bottom left, rgba(56,149,240,0.13) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 5: subtle grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] gpu-accelerated"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 mb-8 w-fit" />

            <motion.h1
              {...fadeUp(0.08)}
              className="text-5xl sm:text-6xl lg:text-7xl font-[var(--font-primary)] font-black text-[#0F172A] leading-[1.05] tracking-tight mb-6"
            >
              Where Health Meets
              <br />
              <span className="text-[#2563EB]">Technology</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="text-lg sm:text-xl text-[#334155] opacity-95 max-w-2xl leading-relaxed mb-10 font-[var(--font-secondary)]"
            >
              India's premier health technology conference — three days of keynotes, workshops, and connections that shape the future of healthcare.
            </motion.p>

            <motion.div {...fadeUp(0.24)} className="flex flex-col sm:flex-row items-start gap-4 mb-16">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-[var(--radius-lg)] bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-[var(--font-secondary)] font-bold text-base hover:from-[#1D4ED8] hover:to-[#2563EB] hover:shadow-xl transition-all duration-[var(--transition-eventor-normal)] hover:-translate-y-0.5 shadow-lg"
              >
                Secure Your Seat
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/agenda"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-[var(--radius-lg)] border-2 border-[#2563EB] text-[#2563EB] font-[var(--font-secondary)] font-semibold text-base hover:bg-[rgba(37,99,235,0.1)] hover:border-[#1D4ED8] transition-all duration-[var(--transition-eventor-normal)]"
              >
                View Programme
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.32)} className="flex flex-col gap-3">
              {metaItems.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-[#475569] text-sm font-[var(--font-secondary)] font-medium">
                  <Icon className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div {...fadeUp(0.16)} className="hidden lg:flex items-center justify-center">
            <div className="relative w-full h-full max-w-md">
              <div className="relative left-[110px] transform scale-150">
                <img
                  src={heroImage}
                  alt="Healthcare Technology"
                  className="w-full h-auto rounded-2xl object-cover"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(191,219,254,0.35))' }}
        aria-hidden="true"
      />
    </section>
  )
}
