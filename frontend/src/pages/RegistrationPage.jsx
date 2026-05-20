import { useLocation } from 'react-router-dom'
import useRegistrationStore from '../stores/registrationStore.js'
import SimpleRegistrationForm from '../components/registration/SimpleRegistrationForm.jsx'
import SuccessStep from '../components/registration/SuccessStep.jsx'
import AnimatedSection from '../components/ui/AnimatedSection'
import Eyebrow from '../components/ui/Eyebrow'

export default function RegistrationPage() {
  const location = useLocation()
  const confirmedTicketId = useRegistrationStore((s) => s.confirmedTicketId)
  const isSuccess = Boolean(confirmedTicketId)

  return (
    <div className="min-h-screen bg-[var(--color-frost)]">
      <AnimatedSection animation="fadeUp" duration={800}>
        <div className="px-4 pb-4 pt-28 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Eyebrow variant="light" accent className="mx-auto mb-4">
              AllHealth X Tech
            </Eyebrow>
            <h1 className="font-[var(--font-display)] text-4xl font-normal tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Register to Attend
            </h1>
            <p className="mt-3 text-lg text-[var(--text-secondary)]">
              Bangalore, July 2026. Curated participation.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fadeUp" duration={800} delay={200}>
        <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] p-8 shadow-[var(--shadow-card)] sm:p-10">
            {isSuccess ? <SuccessStep /> : <SimpleRegistrationForm key={location.key} />}
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
