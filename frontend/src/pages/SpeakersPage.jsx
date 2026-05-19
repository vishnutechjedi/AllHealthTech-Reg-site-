import { useState, useEffect } from 'react'
import { apiFetch } from '../lib/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import AnimatedSection from '../components/ui/AnimatedSection'
import { XIcon, LinkedInIcon, TwitterIcon } from '../components/icons'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function SpeakerModal({ speaker, onClose }) {
  if (!speaker) return null

  // Close on Escape
  const handleKey = (e) => { if (e.key === 'Escape') onClose() }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2937] bg-opacity-90 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleKey}
      role="dialog"
      aria-modal="true"
      aria-label={`${speaker.name} profile`}
    >
      <div
        className="bg-white rounded-[var(--radius-2xl)] border border-[#E8F0FF] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo header with bright styling */}
        <div className="relative h-52 bg-gradient-to-br from-[#E8F0FF] to-[#F5F9FF] rounded-t-[var(--radius-2xl)] overflow-hidden">
          {speaker.photoUrl && (
            <img
              src={speaker.photoUrl}
              alt={speaker.name}
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.9) 0%, transparent 60%)' }}
            aria-hidden="true"
          />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-9 h-9 rounded-[var(--radius-lg)] bg-white bg-opacity-80 border border-[#E8F0FF] flex items-center justify-center text-[#1F2937] hover:bg-opacity-100 hover:border-[#3B82F6] transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
          <div className="absolute bottom-5 left-6 right-6">
            {speaker.isFeatured && (
              <span className="inline-block px-2.5 py-0.5 rounded-[var(--radius-md)] bg-gradient-to-r from-[#3B82F6] to-[#0EA5E9] text-white text-[10px] font-[var(--font-secondary)] font-bold uppercase tracking-wide mb-2">
                Featured Speaker
              </span>
            )}
            <h2 className="text-[#1F2937] font-[var(--font-primary)] font-black text-xl leading-tight">{speaker.name}</h2>
            <p className="text-[#3B82F6] font-[var(--font-secondary)] text-sm mt-0.5">{speaker.title} · {speaker.organization}</p>
          </div>
        </div>

        {/* Body with bright styling */}
        <div className="p-6">
          {speaker.biography ? (
            <p className="text-[#6B7280] font-[var(--font-secondary)] text-sm leading-relaxed">{speaker.biography}</p>
          ) : (
            <p className="text-[#9CA3AF] font-[var(--font-secondary)] text-sm italic">Biography coming soon.</p>
          )}

          {(speaker.linkedinUrl || speaker.twitterUrl) && (
            <div className="flex gap-3 mt-6 pt-5 border-t border-[#E8F0FF]">
              {speaker.linkedinUrl && (
                <a
                  href={speaker.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-lg)] border border-[#E8F0FF] text-[#6B7280] text-sm font-[var(--font-secondary)] font-medium hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all duration-[var(--transition-eventor-fast)]"
                >
                  <LinkedInIcon className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
              {speaker.twitterUrl && (
                <a
                  href={speaker.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-lg)] border border-[#E8F0FF] text-[#6B7280] text-sm font-[var(--font-secondary)] font-medium hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all duration-[var(--transition-eventor-fast)]"
                >
                  <TwitterIcon className="w-4 h-4" />
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
      ref={ref}
      onClick={onClick}
      className={`group text-left bg-white rounded-[var(--radius-xl)] border border-[#E8F0FF] overflow-hidden hover:shadow-xl hover:border-[#3B82F6] hover:-translate-y-1 transition-all duration-[var(--transition-eventor-normal)] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#F5F9FF] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
      style={{
        transitionDelay: `${delays[index % 10]}ms`,
        transitionDuration: '600ms',
      }}
    >
      {/* Photo */}
      <div className="aspect-square bg-[#F5F9FF] overflow-hidden relative">
        {speaker.photoUrl ? (
          <img
            src={speaker.photoUrl}
            alt={speaker.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-[#F5F9FF] flex items-center justify-center">
            <span className="text-4xl font-[var(--font-primary)] font-black text-[#3B82F6] opacity-20">{speaker.name.charAt(0)}</span>
          </div>
        )}
        {speaker.isFeatured && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-[var(--radius-md)] bg-gradient-to-r from-[#3B82F6] to-[#0EA5E9] text-white text-[10px] font-[var(--font-secondary)] font-bold uppercase tracking-wide shadow-lg">
            Featured
          </div>
        )}
      </div>

      {/* Info with modern typography */}
      <div className="p-4">
        <p className="font-[var(--font-primary)] font-bold text-[#1F2937] text-sm leading-tight">{speaker.name}</p>
        <p className="text-[#3B82F6] font-[var(--font-secondary)] text-xs mt-0.5 truncate font-medium">{speaker.title}</p>
        <p className="text-[#6B7280] font-[var(--font-secondary)] text-xs truncate mt-0.5">{speaker.organization}</p>
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Layer 1: base — white to light sky blue */}
      <div
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #F0F7FF 30%, #DBEAFE 60%, #BFDBFE 100%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 2: ambient blue radial orbs */}
      <div
        className="fixed inset-0 pointer-events-none"
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
        className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(93,169,233,0.20) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 4: bottom-left blue bloom */}
      <div
        className="fixed bottom-0 left-0 w-[500px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom left, rgba(56,149,240,0.13) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 5: subtle grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
        aria-hidden="true"
      />

      {/* Hero header with bright styling */}
      <AnimatedSection animation="fadeUp" duration={800}>
        <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block text-xs font-[var(--font-secondary)] font-bold uppercase tracking-widest text-[#3B82F6] mb-3">AllHealthTech 2026</span>
            <h1 className="text-4xl sm:text-5xl font-[var(--font-primary)] font-black text-[#1F2937] mb-3">Our Speakers</h1>
            <p className="text-[#6B7280] opacity-90 font-[var(--font-secondary)] text-lg max-w-xl">
              30+ visionaries from clinical practice, research, policy, and industry — all under one roof.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {error && <ErrorMessage message={error} onRetry={() => location.reload()} />}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {speakers.map((s, index) => (
              <SpeakerCard key={s.id} speaker={s} onClick={() => setSelected(s)} index={index} />
            ))}
          </div>
        )}
        {!loading && !error && speakers.length === 0 && (
          <div className="text-center py-20 text-[#9CA3AF] font-[var(--font-secondary)] text-sm">Speaker announcements coming soon.</div>
        )}
      </div>

      <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
