import { Link } from 'react-router-dom'
import { ArrowRightIcon, MapPinIcon, CalendarIcon, BrainIcon, NetworkIcon, ChartIcon, TicketIcon } from '../components/icons'
import AnimatedSection from '../components/ui/AnimatedSection'

const PILLARS = [
  {
    icon: CalendarIcon,
    title: 'Focused Agenda',
    desc: 'Every session is curated by a committee of clinicians, technologists, and policymakers to ensure maximum relevance and depth.',
  },
  {
    icon: NetworkIcon,
    title: 'High-Value Networking',
    desc: 'Structured networking sessions, roundtables, and a dedicated app to connect with the right people before, during, and after the event.',
  },
  {
    icon: TicketIcon,
    title: 'HealthTech Awards',
    desc: 'Recognising the most impactful innovations in Indian healthcare technology across 8 categories.',
  },
  {
    icon: ChartIcon,
    title: 'Startup Showcase',
    desc: '20 early-stage health-tech startups pitch to a panel of investors and industry leaders for funding and mentorship opportunities.',
  },
]

const TIMELINE = [
  { year: '2019', event: 'First AllHealthTech Conference, 120 attendees, Bangalore' },
  { year: '2020', event: 'Virtual edition during COVID-19, 800+ online participants' },
  { year: '2021', event: 'Hybrid format, first HealthTech Awards ceremony' },
  { year: '2022', event: 'Expanded to 2 days, 300+ in-person attendees, Delhi' },
  { year: '2023', event: 'Moved to Mumbai, 400+ attendees, 20 sponsors' },
  { year: '2026', event: '3-day flagship event, 500+ expected, Bombay Exhibition Centre' },
]

const EVENT_DAYS = [
  { day: 'Day 1', date: 'Thursday, 15 October 2026', theme: 'AI & Diagnostics' },
  { day: 'Day 2', date: 'Friday, 16 October 2026', theme: 'Digital Health & Policy' },
  { day: 'Day 3', date: 'Saturday, 17 October 2026', theme: 'MedTech & Investment' },
]

export default function AboutPage() {
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

      {/* Hero with bright gradient background */}
      <AnimatedSection animation="fadeUp" duration={800}>
        <div className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block text-xs font-[var(--font-secondary)] font-bold uppercase tracking-widest text-[#3B82F6] mb-3">About the Event</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-[var(--font-primary)] font-black text-[#1F2937] mb-5 max-w-2xl leading-tight">
              India's Premier Health Technology Conference
            </h1>
            <p className="text-[#6B7280] opacity-90 font-[var(--font-secondary)] text-lg max-w-xl leading-relaxed mb-8">
              AllHealthTech brings together the brightest minds in healthcare and technology for three days of learning, collaboration, and inspiration.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-[var(--radius-lg)] bg-gradient-to-r from-[#3B82F6] to-[#0EA5E9] text-white font-[var(--font-secondary)] font-bold text-base hover:from-[#2563EB] hover:to-[#0284C7] hover:shadow-lg transition-all duration-[var(--transition-eventor-normal)] hover:-translate-y-0.5"
              >
                Register Now
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/agenda"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-[var(--radius-lg)] border-2 border-[#3B82F6] text-[#3B82F6] font-[var(--font-secondary)] font-semibold text-base hover:bg-[rgba(59,130,246,0.1)] hover:border-[#2563EB] transition-all duration-[var(--transition-eventor-normal)]"
              >
                View Agenda
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-20">
        {/* Mission with bright styling */}
        <AnimatedSection animation="fadeUp" duration={800}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-[var(--font-secondary)] font-bold uppercase tracking-[0.1em] mb-3 text-[#3B82F6] inline-block">Our Mission</span>
              <h2 className="text-4xl font-[var(--font-primary)] font-bold text-[#1F2937] leading-tight mb-4">Accelerating the Future of Healthcare</h2>
              <p className="text-[#6B7280] font-[var(--font-secondary)] leading-relaxed mb-4">
                AllHealthTech was founded on a simple belief: that the most transformative breakthroughs in healthcare happen at the intersection of clinical expertise and technological innovation.
              </p>
              <p className="text-[#6B7280] font-[var(--font-secondary)] leading-relaxed">
                We create the conditions for those breakthroughs — by convening the right people, curating the right conversations, and building a community that persists long after the conference ends.
              </p>
            </div>

            {/* Pillar cards with bright styling */}
            <div className="grid grid-cols-2 gap-4">
              {PILLARS.map(({ icon: Icon, title, desc }, index) => (
                <AnimatedSection key={title} animation="scale" delay={index * 100} duration={600}>
                  <div className="bg-white rounded-[var(--radius-xl)] border border-[#E8F0FF] p-5 shadow-lg hover:shadow-xl hover:border-[#3B82F6] transition-all duration-[var(--transition-eventor-normal)]">
                    <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-[rgba(59,130,246,0.1)] border border-[#3B82F6] border-opacity-20 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                    <h3 className="font-[var(--font-primary)] font-bold text-[#1F2937] text-sm mb-1">{title}</h3>
                    <p className="text-[#6B7280] font-[var(--font-secondary)] text-xs leading-relaxed">{desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Venue with bright styling */}
        <AnimatedSection animation="fadeUp" duration={800}>
          <div
            className="bg-white rounded-[var(--radius-2xl)] p-8 sm:p-12 text-[#1F2937] border border-[#E8F0FF] shadow-lg"
            style={{
              backgroundImage: `
              radial-gradient(ellipse 60% 40% at 100% 50%, rgba(59,130,246,0.08) 0%, transparent 20%)
            `,
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block text-xs font-[var(--font-secondary)] font-bold uppercase tracking-widest text-[#3B82F6] mb-3">Venue</span>
                <h2 className="text-3xl font-[var(--font-primary)] font-black mb-4 text-[#1F2937]">Bombay Exhibition Centre</h2>
                <p className="text-[#6B7280] font-[var(--font-secondary)] leading-relaxed mb-5">
                  One of India's largest and most modern exhibition venues, the BEC offers world-class facilities across 45,000 sq. metres of exhibition space in the heart of Mumbai.
                </p>
                <div className="flex flex-col gap-2.5 text-sm text-[#6B7280] font-[var(--font-secondary)]">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                    Goregaon East, Mumbai, Maharashtra 400063
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 flex-shrink-0 text-[#3B82F6] text-center text-xs font-bold">M</span>
                    10 min from Goregaon Metro Station
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 flex-shrink-0 text-[#3B82F6] text-center text-xs font-bold">A</span>
                    25 min from Chhatrapati Shivaji Maharaj International Airport
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#F5F9FF] to-[#E8F0FF] rounded-[var(--radius-xl)] p-6 border border-[#E8F0FF]">
                <h3 className="font-[var(--font-secondary)] font-bold text-[#3B82F6] mb-5 text-sm uppercase tracking-widest">Event Dates</h3>
                {EVENT_DAYS.map(({ day, date, theme }) => (
                  <div key={day} className="flex items-start gap-4 py-3.5 border-b border-[#E8F0FF] last:border-0">
                    <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[rgba(59,130,246,0.1)] border border-[#3B82F6] border-opacity-20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#3B82F6] font-[var(--font-secondary)] text-xs font-bold">{day}</span>
                    </div>
                    <div>
                      <p className="text-[#1F2937] font-[var(--font-secondary)] font-semibold text-sm">{date}</p>
                      <p className="text-[#6B7280] opacity-60 font-[var(--font-secondary)] text-xs mt-0.5">{theme}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Timeline with bright styling */}
        <AnimatedSection animation="fadeUp" duration={800}>
          <div>
            <div className="text-center mb-14">
              <span className="text-xs font-[var(--font-secondary)] font-bold uppercase tracking-[0.1em] mb-3 text-[#3B82F6] inline-block">Our Journey</span>
              <h2 className="text-4xl font-[var(--font-primary)] font-bold text-[#1F2937] leading-tight">Six Years of Impact</h2>
            </div>
            <div className="relative max-w-3xl mx-auto">
              {/* Center line */}
              <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-[#E8F0FF] hidden sm:block" aria-hidden="true" />
              <div className="flex flex-col gap-6">
                {TIMELINE.map(({ year, event }, i) => (
                  <AnimatedSection
                    key={year}
                    animation={i % 2 === 0 ? 'slideRight' : 'slideLeft'}
                    delay={i * 100}
                    duration={600}
                  >
                    <div
                      className={['flex items-center gap-6', i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'].join(' ')}
                    >
                      <div className={['flex-1', i % 2 === 0 ? 'sm:text-right' : 'sm:text-left'].join(' ')}>
                        <div className="bg-white rounded-[var(--radius-xl)] border border-[#E8F0FF] shadow-md p-4 inline-block text-left">
                          <p className="text-[#3B82F6] font-[var(--font-secondary)] font-bold text-sm">{year}</p>
                          <p className="text-[#6B7280] font-[var(--font-secondary)] text-sm mt-0.5">{event}</p>
                        </div>
                      </div>
                      <div className="hidden sm:flex w-4 h-4 rounded-full bg-[#3B82F6] border-4 border-[#F5F9FF] flex-shrink-0 z-10" aria-hidden="true" />
                      <div className="flex-1" />
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
