/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { apiFetch } from '../../lib/api'

const fallbackStats = [
  { value: 500, suffix: '+', label: 'Attendees' },
  { value: 30, suffix: '+', label: 'Speakers' },
  { value: 50, suffix: '+', label: 'Exhibitors' },
  { value: 3, suffix: '', label: 'Days' },
]

function useCountUp(target, duration = 1600, started = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, started])
  return count
}

function StatItem({ value, suffix, label, started, isLast }) {
  const count = useCountUp(value, 1400, started)
  return (
    <div className={['flex-1 flex flex-col items-center justify-center py-12 px-6 relative group', !isLast ? 'after:absolute after:right-0 after:top-1/4 after:h-1/2 after:w-px after:bg-gradient-to-b after:from-transparent after:via-blue-200 after:to-transparent after:hidden sm:after:block' : ''].join(' ')}>
      <div className="relative">
        {/* Glow effect behind number */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-sky-500 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
        <span className="relative text-6xl sm:text-7xl font-[var(--font-primary)] font-black bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 bg-clip-text text-transparent tabular-nums drop-shadow-lg">
          {count}{suffix}
        </span>
      </div>
      <span className="text-slate-600 text-sm font-[var(--font-secondary)] font-semibold mt-3 uppercase tracking-widest">{label}</span>
    </div>
  )
}

export default function StatsCounter() {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)
  const [stats, setStats] = useState(fallbackStats)

  useEffect(() => {
    apiFetch('/api/stats')
      .then((data) => {
        setStats([
          { value: data.attendees ?? fallbackStats[0].value, suffix: '+', label: 'Attendees' },
          { value: data.speakers ?? fallbackStats[1].value, suffix: '+', label: 'Speakers' },
          { value: data.exhibitors ?? fallbackStats[2].value, suffix: '+', label: 'Exhibitors' },
          { value: data.days ?? fallbackStats[3].value, suffix: '', label: 'Days' },
        ])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={ref} 
      className="bg-white border-y-2 border-blue-100"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 divide-blue-100">
          {stats.map((s, i) => (
            <StatItem key={s.label} {...s} started={started} isLast={i === stats.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
