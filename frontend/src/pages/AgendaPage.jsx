import { useState, useEffect } from 'react'
import { apiFetch } from '../lib/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import PageHero from '../components/ui/PageHero'
import CTABand from '../components/ui/CTABand'
import Badge from '../components/ui/Badge'
import { ClockIcon, MapPinIcon } from '../components/icons'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { linkBtn } from '../components/ui/buttonClasses'

const filterActive = linkBtn.filterActive

const filterInactive =
  'rounded-[var(--radius-pill)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all duration-300 hover:border-[var(--color-blue-core)] hover:text-[var(--color-blue-deep)]'

function fmt(d) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })
}

function TrackBadge({ track }) {
  const variant = track === 'Main Stage' ? 'navy' : 'default'
  return <Badge variant={variant}>{track}</Badge>
}

function AgendaItem({ item, index }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })
  const delays = [0, 100, 200, 300]

  return (
    <div
      ref={ref}
      className={[
        'group flex flex-col gap-5 rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] p-6 shadow-[var(--shadow-card)] transition-all duration-300 sm:flex-row',
        'hover:-translate-y-0.5 hover:border-[var(--color-bridge)] hover:shadow-[0_12px_35px_rgba(0,14,122,0.12)]',
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8',
      ].join(' ')}
      style={{
        transitionDelay: `${delays[index % 4]}ms`,
        transitionDuration: '600ms',
      }}
    >
      <div className="flex-shrink-0 sm:w-28">
        <div className="mb-0.5 flex items-center gap-1.5 text-sm font-semibold text-[var(--color-blue-deep)]">
          <ClockIcon className="h-3.5 w-3.5" />
          {fmt(item.startTime)}
        </div>
        {item.endTime && (
          <div className="pl-5 text-xs text-[var(--text-muted)]">– {fmt(item.endTime)}</div>
        )}
        {item.location && (
          <div className="mt-2 flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <MapPinIcon className="h-3 w-3 flex-shrink-0" />
            {item.location}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-start gap-2">
          <h3 className="flex-1 text-sm font-semibold leading-snug text-[var(--text-primary)]">{item.title}</h3>
          {item.track && <TrackBadge track={item.track} />}
        </div>
        {item.description && (
          <p className="mb-3 text-xs leading-relaxed text-[var(--text-secondary)]">{item.description}</p>
        )}
        {item.speaker && (
          <div className="flex items-center gap-2">
            {item.speaker.photoUrl ? (
              <img
                src={item.speaker.photoUrl}
                alt={item.speaker.name}
                className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-[var(--color-mist)] bg-[var(--color-frost)] text-[10px] font-semibold text-[var(--color-bridge)]">
                {item.speaker.name.charAt(0)}
              </div>
            )}
            <span className="text-xs text-[var(--text-secondary)]">
              {item.speaker.name}
              {item.speaker.organization && ` · ${item.speaker.organization}`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AgendaPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTrack, setActiveTrack] = useState(null)

  useEffect(() => {
    apiFetch('/api/agenda')
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const tracks = [...new Set(items.map((i) => i.track).filter(Boolean))]
  const filtered = activeTrack ? items.filter((i) => i.track === activeTrack) : items

  const grouped = filtered.reduce((acc, item) => {
    const key = fmtDate(item.startTime)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[var(--color-ice)]">
      <PageHero
        eyebrow="Programme"
        accentEyebrow
        title="Themes We Will Explore"
        subtitle="Panels, workshops, and real networking around the hard questions in healthtech."
        compact
      />

      <div className="mx-auto max-w-4xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}

        {!loading && !error && (
          <>
            {tracks.length > 0 && (
              <div className="mb-10 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTrack(null)}
                  className={activeTrack === null ? filterActive : filterInactive}
                >
                  All Sessions
                </button>
                {tracks.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTrack(t)}
                    className={activeTrack === t ? filterActive : filterInactive}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {Object.entries(grouped).map(([date, dayItems]) => (
              <div key={date} className="mb-10">
                <div className="mb-5 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[var(--color-mist)]" />
                  <span className="px-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                    {date}
                  </span>
                  <div className="h-px flex-1 bg-[var(--color-mist)]" />
                </div>
                <div className="flex flex-col gap-3">
                  {dayItems.map((item, index) => (
                    <AgendaItem key={item.id} item={item} index={index} />
                  ))}
                </div>
              </div>
            ))}

            {Object.keys(grouped).length === 0 && (
              <div className="py-16 text-center text-sm text-[var(--text-muted)]">No sessions found.</div>
            )}
          </>
        )}
      </div>

      <CTABand
        variant="agenda"
        title="Join the conversations in the room."
        subtitle="Limited seats. Curated participation."
        primaryCta={{ to: '/register', label: 'Register to Attend' }}
        secondaryCta={{ to: '/contact', label: 'Partner With Us', showArrow: false }}
      />
    </div>
  )
}
