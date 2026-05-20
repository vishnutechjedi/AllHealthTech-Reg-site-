import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useRegistrationStore from '../../stores/registrationStore.js'
import Input from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'
import ErrorMessage from '../ui/ErrorMessage.jsx'
import { apiFetch } from '../../lib/api.js'
import { cleanupRazorpayOverlay, pinRazorpayOverlayToViewport } from '../../lib/razorpayOverlay.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RAZORPAY_CHECKOUT_URL = 'https://checkout.razorpay.com/v1/checkout.js'

const fieldsetClass =
  'space-y-5 rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-frost)] p-6'

const legendClass = 'px-3 -ml-3 text-base font-semibold text-[var(--text-primary)]'

const textareaClass = [
  'w-full resize-none rounded-[var(--radius-card)] border-[1.5px] border-[var(--color-mist)]',
  'bg-[var(--color-warm-white)] px-4 py-3.5 text-sm text-[var(--text-primary)]',
  'placeholder-[var(--text-muted)] transition-all',
  'focus:border-[var(--color-blue-core)] focus:outline-none',
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2',
].join(' ')

function loadRazorpayCheckout() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const existingScript = document.querySelector(`script[src="${RAZORPAY_CHECKOUT_URL}"]`)
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Unable to load Razorpay Checkout. Please try again.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = RAZORPAY_CHECKOUT_URL
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('Unable to load Razorpay Checkout. Please try again.'))
    document.body.appendChild(script)
  })
}

function validate(fields) {
  const errors = {}

  if (!fields.attendeeName.trim()) {
    errors.attendeeName = 'Full name is required.'
  }

  if (!fields.attendeeEmail.trim()) {
    errors.attendeeEmail = 'Email is required.'
  } else if (!EMAIL_RE.test(fields.attendeeEmail.trim())) {
    errors.attendeeEmail = 'Please enter a valid email address.'
  }

  if (!fields.attendeePhone.trim()) {
    errors.attendeePhone = 'Phone number is required.'
  } else if (fields.attendeePhone.trim().length < 7) {
    errors.attendeePhone = 'Phone number must be at least 7 characters.'
  }

  if (fields.organization && fields.organization.trim().length > 100) {
    errors.organization = 'Organization name must be less than 100 characters.'
  }

  if (fields.role && fields.role.trim().length > 100) {
    errors.role = 'Role must be less than 100 characters.'
  }

  return errors
}

export default function SimpleRegistrationForm() {
  const navigate = useNavigate()
  const { setConfirmedTicketId, setAttendeeDetails, isSubmitting, setSubmitting } = useRegistrationStore()

  const [fields, setFields] = useState({
    attendeeName: '',
    attendeeEmail: '',
    attendeePhone: '',
    organization: '',
    role: '',
    dietaryRestrictions: '',
    accessibilityNeeds: '',
  })

  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    if (generalError) {
      setGeneralError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate(fields)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const submissionData = {
      attendeeName: fields.attendeeName.trim(),
      attendeeEmail: fields.attendeeEmail.trim(),
      attendeePhone: fields.attendeePhone.trim(),
      organization: fields.organization.trim() || undefined,
      role: fields.role.trim() || undefined,
      dietaryRestrictions: fields.dietaryRestrictions.trim() || undefined,
      accessibilityNeeds: fields.accessibilityNeeds.trim() || undefined,
    }

    setSubmitting(true)
    setGeneralError('')

    try {
      const order = await apiFetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendeeName: submissionData.attendeeName,
          attendeeEmail: submissionData.attendeeEmail,
        }),
      })

      if (!order.success || !order.orderId || !order.keyId) {
        throw new Error('Unable to start payment. Please try again.')
      }

      await loadRazorpayCheckout()

      const paymentResult = await new Promise((resolve, reject) => {
        const checkout = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: 'AllHealthTech',
          description: 'Event Registration',
          order_id: order.orderId,
          prefill: {
            name: submissionData.attendeeName,
            email: submissionData.attendeeEmail,
            contact: submissionData.attendeePhone,
          },
          theme: {
            color: '#0023FD',
          },
          handler: resolve,
          modal: {
            ondismiss: () => {
              cleanupRazorpayOverlay()
              reject(new Error('Payment was cancelled. Your registration was not created.'))
            },
          },
        })

        checkout.on('payment.failed', (response) => {
          cleanupRazorpayOverlay()
          reject(new Error(response.error?.description || 'Payment failed. Your registration was not created.'))
        })

        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        checkout.open()
        pinRazorpayOverlayToViewport()
      })

      cleanupRazorpayOverlay()

      const response = await apiFetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...submissionData,
          razorpay_order_id: paymentResult.razorpay_order_id,
          razorpay_payment_id: paymentResult.razorpay_payment_id,
          razorpay_signature: paymentResult.razorpay_signature,
        }),
      })

      if (!response.success || !response.ticketId) {
        throw new Error('Payment succeeded, but registration could not be confirmed. Please contact support.')
      }

      setConfirmedTicketId(response.ticketId)
      setAttendeeDetails({
        attendeeName: submissionData.attendeeName,
        attendeeEmail: submissionData.attendeeEmail,
        attendeePhone: submissionData.attendeePhone,
        organization: submissionData.organization,
        role: submissionData.role,
      })
      navigate('/registration/success')
    } catch (error) {
      cleanupRazorpayOverlay()

      let errorMessage = 'An unexpected error occurred. Please try again.'

      if (error.message?.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.'
      } else if (error.message?.includes('NetworkError')) {
        errorMessage = 'Network error occurred. Please check your connection and try again.'
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.'
      } else if (error.message?.includes('already registered')) {
        errorMessage =
          'This email is already registered for the event. Contact info@allhealthtech.com if you need assistance.'
      } else if (error.message?.includes('validation')) {
        errorMessage = `Please check your information and try again. ${error.message}`
      } else if (error.message?.includes('500') || error.message?.includes('503')) {
        errorMessage = 'Server error occurred. Our team has been notified. Please try again in a few minutes.'
      } else if (error.message && error.message.length < 200) {
        errorMessage = error.message
      }

      setGeneralError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetry = () => {
    setGeneralError('')
  }

  return (
    <div>
      <div className="mb-8">
        <h2
          id="registration-form-title"
          className="mb-2 font-[var(--font-display)] text-3xl font-normal text-[var(--text-primary)]"
        >
          Complete Your Registration
        </h2>
        <p id="registration-form-description" className="text-[var(--text-secondary)]">
          Fill out the form below to secure your spot. Fields marked with{' '}
          <span className="font-semibold text-[var(--color-blue-deep)]">*</span> are required.
        </p>
      </div>

      {generalError && (
        <div className="mb-6" role="alert" aria-live="assertive">
          <ErrorMessage message={generalError} onRetry={handleRetry} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full space-y-8"
        aria-labelledby="registration-form-title"
        aria-describedby="registration-form-description"
      >
        <fieldset className={fieldsetClass}>
          <legend className={legendClass}>Personal Information</legend>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                id="attendeeName"
                name="attendeeName"
                label="Full Name"
                required
                value={fields.attendeeName}
                onChange={handleChange}
                placeholder="Jane Doe"
                error={errors.attendeeName}
                aria-required="true"
              />
            </div>

            <Input
              id="attendeeEmail"
              name="attendeeEmail"
              label="Email Address"
              type="email"
              required
              value={fields.attendeeEmail}
              onChange={handleChange}
              placeholder="jane@example.com"
              error={errors.attendeeEmail}
              aria-required="true"
            />

            <Input
              id="attendeePhone"
              name="attendeePhone"
              label="Phone Number"
              type="tel"
              required
              value={fields.attendeePhone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              error={errors.attendeePhone}
              aria-required="true"
            />
          </div>
        </fieldset>

        <fieldset className={fieldsetClass}>
          <legend className={legendClass}>
            Professional Information
            <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">(Optional)</span>
          </legend>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input
              id="organization"
              name="organization"
              label="Organization"
              value={fields.organization}
              onChange={handleChange}
              placeholder="Acme Corp"
              error={errors.organization}
              aria-required="false"
            />

            <Input
              id="role"
              name="role"
              label="Role / Job Title"
              value={fields.role}
              onChange={handleChange}
              placeholder="Product Manager"
              error={errors.role}
              aria-required="false"
            />
          </div>
        </fieldset>

        <fieldset className={fieldsetClass}>
          <legend className={legendClass}>
            Special Requirements
            <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">(Optional)</span>
          </legend>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="dietaryRestrictions" className="text-sm font-medium text-[var(--text-secondary)]">
                Dietary Restrictions
              </label>
              <textarea
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                value={fields.dietaryRestrictions}
                onChange={handleChange}
                placeholder="e.g., Vegetarian, Vegan, Gluten-free, Allergies..."
                rows={3}
                className={textareaClass}
                aria-label="Dietary Restrictions (optional)"
                aria-required="false"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="accessibilityNeeds" className="text-sm font-medium text-[var(--text-secondary)]">
                Accessibility Needs
              </label>
              <textarea
                id="accessibilityNeeds"
                name="accessibilityNeeds"
                value={fields.accessibilityNeeds}
                onChange={handleChange}
                placeholder="e.g., Wheelchair access, Sign language interpreter..."
                rows={3}
                className={textareaClass}
                aria-label="Accessibility Needs (optional)"
                aria-required="false"
              />
            </div>
          </div>
        </fieldset>

        <div className="rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-frost)] p-5">
          <p className="text-sm font-medium text-[var(--text-primary)]">Registration fee</p>
          <p className="mt-1 font-[var(--font-display)] text-2xl font-normal text-[var(--color-navy)]">
            Rs. 2,999
          </p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Confirmed only after successful payment via Razorpay.
          </p>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
            aria-label={isSubmitting ? 'Processing registration payment, please wait' : 'Pay and complete registration'}
          >
            {isSubmitting ? 'Processing...' : 'Pay Rs. 2,999 & Complete Registration'}
          </Button>
        </div>

        <p className="pt-2 text-center text-xs text-[var(--text-muted)]" role="note">
          Registration is confirmed only after successful payment. You will receive a confirmation email with your ticket details.
        </p>
      </form>
    </div>
  )
}
