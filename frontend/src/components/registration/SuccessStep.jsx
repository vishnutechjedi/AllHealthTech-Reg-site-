import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useRegistrationStore from '../../stores/registrationStore.js'
import { CheckIcon, CalendarIcon, UserIcon, MapPinIcon, MailIcon, PhoneIcon, ClockIcon } from '../icons'
import { cleanupRazorpayOverlay } from '../../lib/razorpayOverlay.js'

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
    reset() // Reset the registration store
    navigate('/register', { replace: true }) // Navigate back to registration form
  }

  const handleBackHome = () => {
    cleanupRazorpayOverlay()
    reset()
  }

  return (
    <div className="flex flex-col items-center text-center py-8 max-w-lg mx-auto">
      {/* Success icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success-500/10 border-2 border-success-500/20 mb-6">
        <CheckIcon className="h-9 w-9 text-success-600" />
      </div>

      <h2 className="text-3xl font-black text-gray-900 mb-2">You're registered!</h2>
      <p className="text-gray-600 mb-8 text-sm">
        A confirmation email has been sent to{' '}
        <span className="font-semibold text-gray-900">{attendeeDetails?.attendeeEmail}</span>.
      </p>

      {/* Ticket ID card */}
      <div className="w-full rounded-2xl border-2 border-brand-500/30 bg-gradient-to-br from-brand-50 to-accent-50 p-6 mb-6 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-1.5">Your Ticket ID</p>
        <p className="text-2xl font-black text-gray-900 tracking-wide font-mono">
          {confirmedTicketId ?? '—'}
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Save this ID and your confirmation email — you'll need both for check-in.
        </p>
      </div>

      {/* Event details - Enhanced with location */}
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-left mb-6 shadow-soft space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Event Details</h3>
        <div className="flex items-center gap-2.5 text-sm text-gray-900">
          <CalendarIcon className="h-4 w-4 text-brand-600 flex-shrink-0" />
          <span>AllHealthTech Conference 2026 · Oct 15–17, 2026</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-gray-900">
          <MapPinIcon className="h-4 w-4 text-brand-600 flex-shrink-0" />
          <span>San Francisco Convention Center, CA</span>
        </div>
        {attendeeDetails?.attendeeName && (
          <div className="flex items-center gap-2.5 text-sm text-gray-900">
            <UserIcon className="h-4 w-4 text-brand-600 flex-shrink-0" />
            <span>{attendeeDetails.attendeeName}</span>
          </div>
        )}
      </div>

      {/* Instructions for future access */}
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-left mb-6 shadow-soft">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">What Happens Next</h3>
        <div className="space-y-2.5 text-sm text-gray-900">
          <div className="flex items-start gap-2.5">
            <MailIcon className="h-4 w-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <p><strong>Check your email</strong> for a detailed confirmation with your complete ticket information and event details.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckIcon className="h-4 w-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <p><strong>Save your confirmation email</strong> for your records — you'll need it at check-in along with your Ticket ID.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <ClockIcon className="h-4 w-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <p>You'll receive event updates and reminders as the conference date approaches.</p>
          </div>
        </div>
      </div>

      {/* Support contact information */}
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-left mb-8 shadow-soft">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Need Help?</h3>
        <p className="text-sm text-gray-900 mb-3">
          If you have questions about your registration or the event, we're here to help:
        </p>
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5 text-gray-900">
            <MailIcon className="h-4 w-4 text-brand-600 flex-shrink-0" />
            <a href="mailto:support@allhealthtech.com" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
              support@allhealthtech.com
            </a>
          </div>
          <div className="flex items-center gap-2.5 text-gray-900">
            <PhoneIcon className="h-4 w-4 text-brand-600 flex-shrink-0" />
            <a href="tel:+1-555-123-4567" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
              +1 (555) 123-4567
            </a>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          onClick={handleDone}
          className="flex-1 rounded-xl bg-success-600 py-3 text-sm font-semibold text-white text-center hover:bg-success-700 hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
        >
          Done
        </button>
        <Link
          to="/"
          onClick={handleBackHome}
          className="flex-1 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white text-center hover:bg-brand-700 hover:shadow-brand transition-all duration-200 active:scale-[0.98]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
