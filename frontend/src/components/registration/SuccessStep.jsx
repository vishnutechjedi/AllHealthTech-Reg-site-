import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useRegistrationStore from '../../stores/registrationStore.js'
import Button from '../ui/Button.jsx'
import { CheckIcon, CalendarIcon, UserIcon, MapPinIcon, MailIcon, PhoneIcon, ClockIcon } from '../icons'
import { cleanupRazorpayOverlay } from '../../lib/razorpayOverlay.js'

const cardClass =
  'w-full rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] p-5 text-left shadow-[var(--shadow-card)]'

const sectionLabelClass =
  'mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]'

export default function SuccessStep() {
  const navigate = useNavigate()
  const { confirmedTicketId, attendeeDetails, clearPaymentData, reset } = useRegistrationStore()

  useEffect(() => {
    cleanupRazorpayOverlay()
    clearPaymentData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDone = (e) => {
    e.preventDefault()
    cleanupRazorpayOverlay()
    reset()
    navigate('/register', { replace: true })
  }

  const handleBackHome = () => {
    cleanupRazorpayOverlay()
    reset()
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[rgba(10,123,92,0.25)] bg-[rgba(10,123,92,0.10)]">
        <CheckIcon className="h-9 w-9 text-[var(--color-success)]" />
      </div>

      <h2 className="mb-2 font-[var(--font-display)] text-3xl font-normal text-[var(--text-primary)]">
        You&apos;re registered!
      </h2>
      <p className="mb-8 text-sm text-[var(--text-secondary)]">
        A confirmation email has been sent to{' '}
        <span className="font-semibold text-[var(--text-primary)]">{attendeeDetails?.attendeeEmail}</span>.
      </p>

      <div
        className={[
          'mb-6 w-full rounded-[var(--radius-card)] border border-[rgba(235,66,250,0.25)]',
          'bg-[var(--color-magenta-tint)] p-6 shadow-[var(--shadow-card)]',
        ].join(' ')}
      >
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5B1F61]">
          Your Ticket ID
        </p>
        <p className="font-mono text-2xl font-semibold tracking-wide text-[var(--text-primary)]">
          {confirmedTicketId ?? '—'}
        </p>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">
          Save this ID and your confirmation email — you&apos;ll need both for check-in.
        </p>
      </div>

      <div className={`${cardClass} mb-6 space-y-3`}>
        <h3 className={sectionLabelClass}>Event Details</h3>
        <div className="flex items-center gap-2.5 text-sm text-[var(--text-primary)]">
          <CalendarIcon className="h-4 w-4 flex-shrink-0 text-[var(--color-bridge)]" />
          <span>AllHealth X Tech · July 2026</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-[var(--text-primary)]">
          <MapPinIcon className="h-4 w-4 flex-shrink-0 text-[var(--color-bridge)]" />
          <span>Bangalore, venue TBC</span>
        </div>
        {attendeeDetails?.attendeeName && (
          <div className="flex items-center gap-2.5 text-sm text-[var(--text-primary)]">
            <UserIcon className="h-4 w-4 flex-shrink-0 text-[var(--color-bridge)]" />
            <span>{attendeeDetails.attendeeName}</span>
          </div>
        )}
      </div>

      <div className={`${cardClass} mb-6`}>
        <h3 className={sectionLabelClass}>What Happens Next</h3>
        <div className="space-y-2.5 text-sm text-[var(--text-primary)]">
          <div className="flex items-start gap-2.5">
            <MailIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-bridge)]" />
            <p>
              <strong>Check your email</strong> for a detailed confirmation with your complete ticket information.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-bridge)]" />
            <p>
              <strong>Save your confirmation email</strong> — you&apos;ll need it at check-in along with your Ticket ID.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <ClockIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-bridge)]" />
            <p>You&apos;ll receive event updates and reminders as the conference date approaches.</p>
          </div>
        </div>
      </div>

      <div className={`${cardClass} mb-8`}>
        <h3 className={sectionLabelClass}>Need Help?</h3>
        <p className="mb-3 text-sm text-[var(--text-primary)]">
          If you have questions about your registration or the event, we&apos;re here to help:
        </p>
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5 text-[var(--text-primary)]">
            <MailIcon className="h-4 w-4 flex-shrink-0 text-[var(--color-bridge)]" />
            <a
              href="mailto:info@allhealthtech.com"
              className="font-medium text-[var(--color-blue-deep)] transition-colors hover:text-[var(--color-navy)]"
            >
              info@allhealthtech.com
            </a>
          </div>
          <div className="flex items-center gap-2.5 text-[var(--text-primary)]">
            <PhoneIcon className="h-4 w-4 flex-shrink-0 text-[var(--color-bridge)]" />
            <a
              href="tel:+919876543210"
              className="font-medium text-[var(--color-blue-deep)] transition-colors hover:text-[var(--color-navy)]"
            >
              +91 98765 43210
            </a>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <Button type="button" variant="secondary" onClick={handleDone} className="flex-1">
          Done
        </Button>
        <Button
          type="button"
          variant="primary"
          className="flex-1"
          onClick={() => {
            handleBackHome()
            navigate('/')
          }}
        >
          Back to Home
        </Button>
      </div>
    </div>
  )
}
