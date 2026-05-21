import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Eyebrow from '../ui/Eyebrow'
import MetaRow from '../ui/MetaRow'
import { linkBtn } from '../ui/buttonClasses'
import { ArrowRightIcon, MapPinIcon, CalendarIcon, LockIcon } from '../icons'
import heroBackground from '../../assets/hero-background.png'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
})

const metaItems = [
  { icon: MapPinIcon, label: 'Bangalore · venue TBC' },
  { icon: CalendarIcon, label: 'July 2026' },
  { icon: LockIcon, label: 'Invite-only gathering' },
]

export default function HomeHero() {
  return (
    <section className="relative min-h-[min(92vh,920px)] overflow-hidden text-[var(--text-on-dark)]">
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={heroBackground}
          alt=""
          className="h-full w-full scale-105 object-cover object-[center_42%] sm:object-[62%_center] lg:object-[78%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(0,8,74,0.94)_0%,rgba(0,14,122,0.82)_38%,rgba(0,14,122,0.45)_58%,rgba(0,8,74,0.2)_78%,rgba(0,8,74,0.55)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,8,74,0.88)_0%,rgba(0,8,74,0.25)_28%,transparent_55%)]" />
        <div
          className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(235,66,250,0.35) 0%, transparent 70%)' }}
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,rgba(0,8,74,0.5),transparent)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[min(92vh,920px)] max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 flex-col justify-center pb-8 pt-28 sm:pt-32 lg:max-w-2xl lg:pt-36">
          <motion.div {...fadeUp(0)}>
            <Eyebrow variant="dark">All Health Tech presents</Eyebrow>
          </motion.div>

          <motion.div {...fadeUp(0.06)} className="relative">
            <div
              className="absolute -left-3 top-2 hidden h-[calc(100%-0.5rem)] w-px bg-[linear-gradient(to_bottom,transparent,rgba(107,127,232,0.8),rgba(235,66,250,0.6),transparent)] sm:block"
              aria-hidden="true"
            />
            <h1 className="font-[var(--font-display)] leading-[0.9] tracking-tight text-[var(--text-on-dark)]">
              <span className="block text-[clamp(2.25rem,6.5vw,3.5rem)]">All Health</span>
              <span className="block text-[clamp(2.75rem,9vw,5.25rem)]">X Tech</span>
            </h1>
            <p className="mt-4 font-[var(--font-body)] text-[clamp(0.7rem,1.8vw,0.85rem)] font-semibold uppercase tracking-[0.38em] text-[var(--color-magenta)]">
              Summit 2026
            </p>
          </motion.div>

          <motion.p
            {...fadeUp(0.14)}
            className="mt-7 max-w-lg text-[clamp(1.05rem,2.2vw,1.35rem)] leading-[1.6] text-[var(--color-frost)]"
          >
            A curated, closed-room gathering where healthcare builders, investors, and operators share
            what is actually working — not another panel on the future.
          </motion.p>

          <motion.div {...fadeUp(0.22)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/register" className={`${linkBtn.primary} px-7 py-3.5 font-semibold`}>
              Register to Attend
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link to="/contact" className={`${linkBtn.ghostOnDark} px-7 py-3.5 font-semibold`}>
              Partner With Us
            </Link>
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.3)} className="border-t border-[rgba(250,243,255,0.12)] pb-10 pt-6">
          <MetaRow items={metaItems} variant="chips" />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        aria-hidden="true"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[rgba(250,243,255,0.45)]">
          Scroll
        </span>
        <span className="block h-8 w-px animate-pulse bg-[linear-gradient(to_bottom,rgba(250,243,255,0.5),transparent)]" />
      </motion.div>
    </section>
  )
}
