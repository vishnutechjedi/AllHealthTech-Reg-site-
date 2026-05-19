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

/**
 * Validates registration form fields
 * @param {Object} fields - Form field values
 * @returns {Object} Validation errors object
 */
function validate(fields) {
  const errors = {}
  
  // Required field: attendeeName
  if (!fields.attendeeName.trim()) {
    errors.attendeeName = 'Full name is required.'
  }
  
  // Required field: attendeeEmail with format validation
  if (!fields.attendeeEmail.trim()) {
    errors.attendeeEmail = 'Email is required.'
  } else if (!EMAIL_RE.test(fields.attendeeEmail.trim())) {
    errors.attendeeEmail = 'Please enter a valid email address.'
  }
  
  // Required field: attendeePhone with minimum length validation
  if (!fields.attendeePhone.trim()) {
    errors.attendeePhone = 'Phone number is required.'
  } else if (fields.attendeePhone.trim().length < 7) {
    errors.attendeePhone = 'Phone number must be at least 7 characters.'
  }
  
  // Optional field validation: organization length
  if (fields.organization && fields.organization.trim().length > 100) {
    errors.organization = 'Organization name must be less than 100 characters.'
  }
  
  // Optional field validation: role length
  if (fields.role && fields.role.trim().length > 100) {
    errors.role = 'Role must be less than 100 characters.'
  }
  
  return errors
}

/**
 * SimpleRegistrationForm - Single-page registration form component
 * Combines all registration fields with client-side validation and submission
 * 
 * Requirements: 2.1-2.9, 3.1-3.7, 13.4, 13.5
 */
export default function SimpleRegistrationForm() {
  const navigate = useNavigate()
  const { setConfirmedTicketId, setAttendeeDetails, isSubmitting, setSubmitting } = useRegistrationStore()

  // Form field state
  const [fields, setFields] = useState({
    attendeeName: '',
    attendeeEmail: '',
    attendeePhone: '',
    organization: '',
    role: '',
    dietaryRestrictions: '',
    accessibilityNeeds: '',
  })

  // Validation and error state
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')

  /**
   * Handle input field changes with real-time error clearing
   * Requirement 3.5: Clear errors when fields are corrected
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    
    // Clear field-specific error when user starts correcting
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    
    // Clear general error when user makes changes
    if (generalError) {
      setGeneralError('')
    }
  }

  /**
   * Handle form submission
   * Requirements: 3.6 (prevent invalid submission), 4.1-4.6 (registration processing), 10.1-10.4 (error handling)
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Client-side validation
    const validationErrors = validate(fields)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Prepare submission data
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
            color: '#3B82F6',
          },
          handler: resolve,
          modal: {
            ondismiss: () => reject(new Error('Payment was cancelled. Your registration was not created.')),
          },
        })

        checkout.on('payment.failed', (response) => {
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
      // Handle different error types with user-friendly messages
      let errorMessage = 'An unexpected error occurred. Please try again.'
      
      // Network errors (no connection, timeout, etc.)
      if (error.message && error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.'
      } else if (error.message && error.message.includes('NetworkError')) {
        errorMessage = 'Network error occurred. Please check your connection and try again.'
      } else if (error.message && error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.'
      }
      // Duplicate email error
      else if (error.message && error.message.includes('already registered')) {
        errorMessage = 'This email is already registered for the event. If you need assistance, please contact our support team at support@allhealthtech.com or call +1 (555) 123-4567.'
      }
      // Validation errors from backend
      else if (error.message && error.message.includes('validation')) {
        errorMessage = 'Please check your information and try again. ' + error.message
      }
      // Server errors (500, 503, etc.)
      else if (error.message && (error.message.includes('500') || error.message.includes('503'))) {
        errorMessage = 'Server error occurred. Our team has been notified. Please try again in a few minutes.'
      }
      // Use the error message if it's user-friendly
      else if (error.message && error.message.length < 200) {
        errorMessage = error.message
      }
      
      setGeneralError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Handle retry after error
   * Requirement 10.2: Retry options for network errors
   */
  const handleRetry = () => {
    setGeneralError('')
    // Optionally, could auto-resubmit here, but letting user click submit again is safer
  }

  return (
    <div>
      <div className="mb-8">
        <h2 id="registration-form-title" className="text-3xl font-bold text-gray-900 mb-2">
          Complete Your Registration
        </h2>
        <p id="registration-form-description" className="text-gray-600">
          Fill out the form below to secure your spot. Fields marked with <span className="text-brand-600 font-semibold">*</span> are required.
        </p>
      </div>

      {/* General error message */}
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
        {/* Personal Information Section */}
        <fieldset className="space-y-5 p-6 rounded-xl bg-gray-50 border border-gray-200">
          <legend className="text-lg font-bold text-gray-900 px-3 -ml-3">
            Personal Information
          </legend>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Required: Full Name */}
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

            {/* Required: Email Address */}
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

            {/* Required: Phone Number */}
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

        {/* Professional Information Section */}
        <fieldset className="space-y-5 p-6 rounded-xl bg-gray-50 border border-gray-200">
          <legend className="text-lg font-bold text-gray-900 px-3 -ml-3">
            Professional Information
            <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
          </legend>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Optional: Organization */}
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

            {/* Optional: Role/Job Title */}
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

        {/* Special Requirements Section */}
        <fieldset className="space-y-5 p-6 rounded-xl bg-gray-50 border border-gray-200">
          <legend className="text-lg font-bold text-gray-900 px-3 -ml-3">
            Special Requirements
            <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
          </legend>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Optional: Dietary Restrictions */}
            <div className="flex flex-col gap-2">
              <label htmlFor="dietaryRestrictions" className="text-sm font-semibold text-gray-700">
                Dietary Restrictions
              </label>
              <textarea
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                value={fields.dietaryRestrictions}
                onChange={handleChange}
                placeholder="e.g., Vegetarian, Vegan, Gluten-free, Allergies..."
                rows={3}
                className="w-full rounded-xl border border-gray-300 bg-white hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 px-4 py-3.5 text-gray-900 placeholder-gray-400 text-sm font-medium transition-all duration-200 focus:outline-none resize-none"
                aria-label="Dietary Restrictions (optional)"
                aria-required="false"
              />
            </div>

            {/* Optional: Accessibility Needs */}
            <div className="flex flex-col gap-2">
              <label htmlFor="accessibilityNeeds" className="text-sm font-semibold text-gray-700">
                Accessibility Needs
              </label>
              <textarea
                id="accessibilityNeeds"
                name="accessibilityNeeds"
                value={fields.accessibilityNeeds}
                onChange={handleChange}
                placeholder="e.g., Wheelchair access, Sign language interpreter, Hearing assistance..."
                rows={3}
                className="w-full rounded-xl border border-gray-300 bg-white hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 px-4 py-3.5 text-gray-900 placeholder-gray-400 text-sm font-medium transition-all duration-200 focus:outline-none resize-none"
                aria-label="Accessibility Needs (optional)"
                aria-required="false"
              />
            </div>
          </div>
        </fieldset>

        {/* Submit Button */}
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

        {/* Help text */}
        <p className="text-xs text-gray-500 text-center pt-2" role="note">
          Registration is confirmed only after successful payment. You will receive a confirmation email with your ticket details.
        </p>
      </form>
    </div>
  )
}
