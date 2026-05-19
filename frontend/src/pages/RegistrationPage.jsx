import { useLocation } from 'react-router-dom'
import useRegistrationStore from '../stores/registrationStore.js'
import SimpleRegistrationForm from '../components/registration/SimpleRegistrationForm.jsx'
import SuccessStep from '../components/registration/SuccessStep.jsx'
import AnimatedSection from '../components/ui/AnimatedSection'

export default function RegistrationPage() {
  const location = useLocation()
  const confirmedTicketId = useRegistrationStore((s) => s.confirmedTicketId)
  
  // Show success only while the current session still has a confirmed ticket.
  const isSuccess = Boolean(confirmedTicketId)

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

      {/* Modern hero header with gradient */}
      <AnimatedSection animation="fadeUp" duration={800}>
        <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
          
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(59,130,246,0.1)] border border-[#3B82F6] border-opacity-20 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">AllHealthTech 2026</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-3 tracking-tight">
              Register for the Conference
            </h1>
            <p className="text-[#6B7280] text-lg">October 15–17, 2026 · Bombay Exhibition Centre, Mumbai</p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="scale" duration={800} delay={200}>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Modern registration card with subtle shadow */}
          <div className="bg-white rounded-2xl border border-[#E8F0FF] shadow-lg p-8 sm:p-10">
            {isSuccess ? <SuccessStep /> : <SimpleRegistrationForm key={location.key} />}
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
