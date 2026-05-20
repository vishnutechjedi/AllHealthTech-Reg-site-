import { useState } from 'react'
import useRegistrationStore from '../../stores/registrationStore.js'
import Input from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(fields) {
  const errors = {}
  if (!fields.attendeeName.trim()) errors.attendeeName = 'Full name is required.'
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
  return errors
}

export default function AttendeeDetailsStep() {
  const { attendeeDetails, setAttendeeDetails, setStep } = useRegistrationStore()

  const [fields, setFields] = useState({
    attendeeName: attendeeDetails?.attendeeName ?? '',
    attendeeEmail: attendeeDetails?.attendeeEmail ?? '',
    attendeePhone: attendeeDetails?.attendeePhone ?? '',
    organization: attendeeDetails?.organization ?? '',
    role: attendeeDetails?.role ?? '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate(fields)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setAttendeeDetails({
      attendeeName: fields.attendeeName.trim(),
      attendeeEmail: fields.attendeeEmail.trim(),
      attendeePhone: fields.attendeePhone.trim(),
      organization: fields.organization.trim() || undefined,
      role: fields.role.trim() || undefined,
    })
    setStep('success')
  }

  return (
    <div>
      <h2 className="mb-2 font-[var(--font-display)] text-2xl font-normal text-[var(--text-primary)]">
        Your Details
      </h2>
      <p className="mb-8 text-[var(--text-secondary)]">Tell us a bit about yourself.</p>

      <form onSubmit={handleSubmit} noValidate className="w-full max-w-lg space-y-5">
        <Input
          id="attendeeName"
          name="attendeeName"
          label="Full Name"
          required
          value={fields.attendeeName}
          onChange={handleChange}
          placeholder="Jane Doe"
          error={errors.attendeeName}
        />
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
        />
        <Input
          id="organization"
          name="organization"
          label="Organization"
          value={fields.organization}
          onChange={handleChange}
          placeholder="Acme Corp (optional)"
          error={errors.organization}
        />
        <Input
          id="role"
          name="role"
          label="Role / Job Title"
          value={fields.role}
          onChange={handleChange}
          placeholder="Product Manager (optional)"
          error={errors.role}
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => setStep('ticket')}>
            Back
          </Button>
          <Button type="submit" variant="primary">
            Continue
          </Button>
        </div>
      </form>
    </div>
  )
}
