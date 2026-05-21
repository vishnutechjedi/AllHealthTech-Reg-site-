import { useState } from 'react'
import { apiFetch } from '../lib/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import PageHero from '../components/ui/PageHero'
import AnimatedSection from '../components/ui/AnimatedSection'
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon, CheckIcon } from '../components/icons'

const INFO = [
  { icon: MailIcon, label: 'Email', value: 'info@allhealthtech.com', href: 'mailto:info@allhealthtech.com' },
  { icon: PhoneIcon, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: MapPinIcon, label: 'Venue', value: 'Bangalore, venue TBC', href: null },
  { icon: ClockIcon, label: 'Office Hours', value: 'Mon–Fri, 9 AM – 6 PM IST', href: null },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    try {
      await apiFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSuccess(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setError(err.message || 'Failed to send. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-ice)]">
      <PageHero
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="Questions about the event? We're here to help."
        compact
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <AnimatedSection animation="slideRight" duration={800} delay={200} className="flex flex-col gap-4 lg:col-span-2">
            <div className="rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] p-5 shadow-[var(--shadow-card)]">
              <h2 className="mb-1 font-[var(--font-display)] text-base font-normal text-[var(--text-primary)]">
                AllHealth X Tech
              </h2>
              <p className="mb-4 text-xs text-[var(--text-secondary)]">
                A curated, closed-room healthtech gathering.
              </p>
              <div className="flex flex-col gap-3">
                {INFO.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-mist)] bg-[var(--color-frost)]">
                      <Icon className="h-3.5 w-3.5 text-[var(--color-bridge)]" />
                    </div>
                    <div>
                      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-xs text-[var(--text-primary)] transition-colors hover:text-[var(--color-blue-deep)]"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-xs text-[var(--text-primary)]">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-frost)] p-4">
              <p className="mb-1 text-xs font-semibold text-[var(--color-blue-deep)]">Registration Queries</p>
              <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">
                For ticket-related questions, contact us at{' '}
                <strong className="text-[var(--text-primary)]">info@allhealthtech.com</strong> with your Ticket ID.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection
            animation="slideLeft"
            duration={800}
            delay={200}
            className="rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] p-5 shadow-[var(--shadow-card)] lg:col-span-3"
          >
            <h2 className="mb-4 font-[var(--font-display)] text-lg font-normal text-[var(--text-primary)]">
              Send a Message
            </h2>

            {success && (
              <div className="mb-3 flex items-center gap-2 rounded-[var(--radius-card)] border border-[rgba(10,123,92,0.25)] bg-[rgba(10,123,92,0.08)] p-3 text-[var(--color-success)]">
                <CheckIcon className="h-4 w-4 flex-shrink-0" />
                <p className="text-xs font-medium">Message sent! We&apos;ll get back to you within 24 hours.</p>
              </div>
            )}
            {error && (
              <div className="mb-3 rounded-[var(--radius-card)] border border-[rgba(200,0,42,0.25)] bg-[rgba(200,0,42,0.06)] p-3 text-xs text-[var(--color-error)]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  id="name"
                  name="name"
                  label="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Dr. Priya Sharma"
                  required
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="priya@hospital.com"
                  required
                />
              </div>
              <Input
                id="subject"
                name="subject"
                label="Subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Speaker nomination, sponsorship, general enquiry..."
                required
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-sm font-medium text-[var(--text-secondary)]">
                  Message <span className="text-[var(--color-magenta)]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Tell us how we can help..."
                  className="w-full resize-none rounded-[var(--radius-card)] border-[1.5px] border-[var(--color-mist)] bg-[var(--color-warm-white)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all focus:border-[var(--color-blue-core)] focus:outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
                />
              </div>
              <Button type="submit" loading={submitting} className="mt-1 w-full">
                {submitting ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
