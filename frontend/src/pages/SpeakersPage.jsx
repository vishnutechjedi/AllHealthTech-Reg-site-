import { useState, useEffect } from 'react'
import { apiFetch } from '../lib/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import PageHero from '../components/ui/PageHero'
import Badge from '../components/ui/Badge'
import { XIcon, LinkedInIcon, TwitterIcon } from '../components/icons'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function SpeakerModal({ speaker, onClose }) {
  if (!speaker) return null

  const handleKey = (e) => {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,8,74,0.9)] p-4 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleKey}
      role="dialog"
      aria-modal="true"
      aria-label={`${speaker.name} profile`}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-52 overflow-hidden rounded-t-[var(--radius-card)] bg-[var(--color-frost)]">
          {speaker.photoUrl && (
            <img
              src={speaker.photoUrl}
              alt={speaker.name}
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(255,254,249,0.95) 0%, transparent 60%)' }}
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] text-[var(--text-primary)] transition-colors hover:border-[var(--color-blue-core)]"
          >
            <XIcon className="h-4 w-4" />
          </button>
          <div className="absolute bottom-5 left-6 right-6">
            {speaker.isFeatured && (
              <Badge variant="accent" className="mb-2">
                Featured Speaker
              </Badge>
            )}
            <h2 className="font-[var(--font-display)] text-xl font-normal leading-tight text-[var(--text-primary)]">
              {speaker.name}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--color-blue-deep)]">
              {speaker.title} · {speaker.organization}
            </p>
          </div>
        </div>

        <div className="p-6">
          {speaker.biography ? (
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{speaker.biography}</p>
          ) : (
            <p className="text-sm italic text-[var(--text-muted)]">Biography coming soon.</p>
          )}

          {(speaker.linkedinUrl || speaker.twitterUrl) && (
            <div className="mt-6 flex gap-3 border-t border-[var(--color-mist)] pt-5">
              {speaker.linkedinUrl && (
                <a
                  href={speaker.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-mist)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--color-blue-core)] hover:text-[var(--color-blue-deep)]"
                >
                  <LinkedInIcon className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {speaker.twitterUrl && (
                <a
                  href={speaker.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-mist)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--color-blue-core)] hover:text-[var(--color-blue-deep)]"
                >
                  <TwitterIcon className="h-4 w-4" />
                  Twitter
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SpeakerCard({ speaker, onClick, index }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })
  const delays = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450]

  return (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      className={[
        'group overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] text-left transition-all duration-300',
        'hover:-translate-y-1 hover:border-[var(--color-bridge)] hover:shadow-[0_12px_35px_rgba(0,14,122,0.12)]',
        'focus:outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2',
        isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
      ].join(' ')}
      style={{
        transitionDelay: `${delays[index % 10]}ms`,
        transitionDuration: '600ms',
      }}
    >
      <div className="relative aspect-square overflow-hidden bg-[var(--color-frost)]">
        {speaker.photoUrl ? (
          <img
            src={speaker.photoUrl}
            alt={speaker.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-[var(--font-display)] text-4xl font-normal text-[var(--color-bridge)] opacity-30">
              {speaker.name.charAt(0)}
            </span>
          </div>
        )}
        {speaker.isFeatured && (
          <div className="absolute left-2 top-2">
            <Badge variant="accent">Featured</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm font-semibold leading-tight text-[var(--text-primary)]">{speaker.name}</p>
        <p className="mt-0.5 truncate text-xs font-medium text-[var(--color-blue-deep)]">{speaker.title}</p>
        <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">{speaker.organization}</p>
      </div>
    </button>
  )
}

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    apiFetch('/api/speakers')
      .then(setSpeakers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[var(--color-ice)]">
      <PageHero
        eyebrow="AllHealth X Tech 2026"
        title="Our Speakers"
        subtitle="Visionaries from clinical practice, research, policy, and industry — all under one roof."
        compact
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}
        {!loading && !error && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {speakers.map((s, index) => (
              <SpeakerCard key={s.id} speaker={s} onClick={() => setSelected(s)} index={index} />
            ))}
          </div>
        )}
        {!loading && !error && speakers.length === 0 && (
          <div className="py-20 text-center text-sm text-[var(--text-muted)]">
            Speaker announcements coming soon.
          </div>
        )}
      </div>

      <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
