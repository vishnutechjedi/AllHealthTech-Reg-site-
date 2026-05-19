import AnimatedSection from '../components/ui/AnimatedSection'

const POLICIES = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    updated: 'January 1, 2026',
    content: [
      'AllHealthTech Events ("we", "us") is committed to protecting your personal information. When you register, we collect your name, email, phone number, and organisation. This data is used solely to process your registration, send event communications, and improve future events.',
      'We do not sell or share your personal data with third parties for marketing. We may share limited information with our payment processor (Razorpay) and email provider strictly to facilitate transactions. All data transfers are encrypted using TLS.',
      'You may request access to, correction of, or deletion of your data at any time by emailing info@allhealthtech.com. We retain registration data for 3 years for compliance purposes.',
    ],
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    updated: 'January 1, 2026',
    content: [
      'By registering for AllHealthTech 2026, you agree to these Terms. Tickets are non-transferable and valid only for the registered attendee. Providing false registration information may result in cancellation without refund.',
      'Attendees must conduct themselves professionally. Harassment or disruptive behaviour will result in immediate removal without refund. AllHealthTech Events reserves the right to modify the schedule, speakers, or venue with reasonable notice.',
      'Our total liability shall not exceed the amount paid for your ticket. These terms are governed by the laws of India, with disputes subject to the exclusive jurisdiction of courts in Mumbai.',
    ],
  },
  {
    id: 'refund',
    title: 'No Refund Policy',
    updated: 'January 1, 2026',
    content: [
      'All ticket purchases for AllHealthTech 2026 are final and non-refundable. Once registration is completed, cancellations, no-shows, or changes in personal circumstances will not qualify for a refund.',
      'Tickets are non-transferable and valid only for the registered attendee. To request a correction to your registration details, email info@allhealthtech.com with your Ticket ID.',
      'If AllHealthTech Events cancels or significantly reschedules the conference, registered attendees will be notified of the available options by email.',
    ],
  },
]

export default function PoliciesPage() {
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
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#3B82F6] mb-3">Legal</span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#1F2937] mb-3">Policies</h1>
            <p className="text-[#6B7280] opacity-90 text-lg">Please read our policies carefully before registering.</p>
          </div>
        </div>
      </AnimatedSection>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Anchor nav */}
        <div className="flex flex-wrap gap-2 mb-12">
          {POLICIES.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="px-4 py-2 rounded-xl bg-white border border-[#E8F0FF] text-[#6B7280] text-sm font-medium hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all duration-150"
            >
              {p.title}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-14">
          {POLICIES.map(({ id, title, updated, content }, index) => (
            <AnimatedSection key={id} animation="fadeUp" duration={700} delay={index * 150}>
              <section id={id} className="scroll-mt-24">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <h2 className="text-2xl font-bold text-[#1F2937]">{title}</h2>
                  <span className="text-xs text-[#9CA3AF] whitespace-nowrap mt-1.5">Updated: {updated}</span>
                </div>
                <div className="flex flex-col gap-4">
                  {content.map((para, i) => (
                    <p key={i} className="text-[#6B7280] text-sm leading-relaxed">{para}</p>
                  ))}
                </div>
              </section>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  )
}
