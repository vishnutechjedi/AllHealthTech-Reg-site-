import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send a registration confirmation email.
 * @param {Object} registration
 * @param {string} registration.ticketId
 * @param {string} registration.attendeeName
 * @param {string} registration.attendeeEmail
 * @param {string} [registration.organization]
 * @param {string} [registration.role]
 * @param {string} [registration.dietaryRestrictions]
 * @param {string} [registration.accessibilityNeeds]
 */
export async function sendConfirmationEmail(registration) {
  const {
    ticketId,
    attendeeName,
    attendeeEmail,
    organization,
    role,
    dietaryRestrictions,
    accessibilityNeeds,
  } = registration;

  // Hardcoded event information (single event)
  const eventName = 'AllHealthTech 2026';
  const eventDate = 'October 15-17, 2026';
  const eventLocation = 'Bombay Exhibition Centre, Mumbai';
  const ticketTypeName = 'General Admission';

  // Build optional fields rows
  let optionalFieldsRows = '';

  if (organization) {
    optionalFieldsRows += `
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Organization</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${organization}</td>
          </tr>`;
  }

  if (role) {
    optionalFieldsRows += `
          <tr style="background: #f9fafb;">
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Role</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${role}</td>
          </tr>`;
  }

  if (dietaryRestrictions) {
    optionalFieldsRows += `
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Dietary Restrictions</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${dietaryRestrictions}</td>
          </tr>`;
  }

  if (accessibilityNeeds) {
    optionalFieldsRows += `
          <tr style="background: #f9fafb;">
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Accessibility Needs</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${accessibilityNeeds}</td>
          </tr>`;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #1e40af, #059669); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Registration Confirmed!</h1>
        <p style="color: #d1fae5; margin: 8px 0 0;">${eventName}</p>
      </div>
      <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
        <p style="font-size: 16px;">Dear <strong>${attendeeName}</strong>,</p>
        <p>Your registration for <strong>${eventName}</strong> has been confirmed. Here are your registration details:</p>

        <!-- Ticket ID Highlight -->
        <div style="background: #eff6ff; border-left: 4px solid #1e40af; padding: 16px; margin: 24px 0; border-radius: 4px;">
          <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #1e40af; text-transform: uppercase;">Your Ticket ID</p>
          <p style="margin: 0; font-family: monospace; font-size: 20px; font-weight: bold; color: #1e40af; letter-spacing: 2px;">${ticketId}</p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #1e40af;">Keep this ID safe — you'll need it for check-in</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Event</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${eventName}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Date</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${eventDate}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Location</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${eventLocation}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Ticket Type</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${ticketTypeName}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Name</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${attendeeName}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Email</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${attendeeEmail}</td>
          </tr>${optionalFieldsRows}
        </table>

        <!-- Important Instructions -->
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
          <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: bold; color: #92400e; text-transform: uppercase;">Important: Save This Email</p>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #92400e;">
            <li style="margin-bottom: 8px;">Save this email for your records — it contains your ticket confirmation</li>
            <li style="margin-bottom: 8px;">Print or screenshot this email to bring to the event</li>
            <li style="margin-bottom: 8px;">You'll need your Ticket ID (${ticketId}) for check-in</li>
            <li>Keep your Ticket ID in a safe place for easy reference</li>
          </ul>
        </div>

        <!-- Support Contact -->
        <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 16px; margin: 24px 0; border-radius: 4px;">
          <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: bold; color: #166534; text-transform: uppercase;">Need Help?</p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #166534;">If you have any questions about your registration or the event:</p>
          <p style="margin: 8px 0; font-size: 14px; color: #166534;">
            <strong>Email:</strong> <a href="mailto:support@allhealthtech.com" style="color: #059669; text-decoration: none;">support@allhealthtech.com</a>
          </p>
          <p style="margin: 8px 0; font-size: 14px; color: #166534;">
            <strong>Phone:</strong> <a href="tel:+1-555-123-4567" style="color: #059669; text-decoration: none;">+1 (555) 123-4567</a>
          </p>
        </div>

        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">We look forward to seeing you at <strong>${eventName}</strong>!</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.ORGANIZER_EMAIL,
    to: attendeeEmail,
    subject: `Your ${eventName} Ticket Confirmation - ${ticketId}`,
    html,
  });
}

/**
 * Send a cancellation confirmation email.
 * @param {Object} registration
 * @param {string} registration.ticketId
 * @param {string} registration.attendeeName
 * @param {string} registration.attendeeEmail
 * @param {string} registration.refundId
 * @param {string} registration.refundStatus
 * @param {number} registration.amountPaid
 */
export async function sendCancellationEmail(registration) {
  const { ticketId, attendeeName, attendeeEmail, refundId, refundStatus, amountPaid } =
    registration;

  // Hardcoded event information (single event)
  const eventName = 'AllHealthTech 2026';

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amountPaid / 100); // amountPaid stored in paise

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: #dc2626; padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Registration Cancelled</h1>
        <p style="color: #fecaca; margin: 8px 0 0;">${eventName}</p>
      </div>
      <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
        <p style="font-size: 16px;">Dear <strong>${attendeeName}</strong>,</p>
        <p>Your registration for <strong>${eventName}</strong> has been successfully cancelled.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr style="background: #fef2f2;">
            <td style="padding: 12px 16px; font-weight: bold; width: 40%; border-bottom: 1px solid #e5e7eb;">Ticket ID</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-family: monospace; font-size: 15px;">${ticketId}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Event</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${eventName}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Refund ID</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-family: monospace;">${refundId}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Refund Amount</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #059669; font-weight: bold;">${formattedAmount}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 12px 16px; font-weight: bold;">Refund Status</td>
            <td style="padding: 12px 16px;">${refundStatus}</td>
          </tr>
        </table>

        <p style="color: #6b7280; font-size: 14px;">Refunds typically take 5–7 business days to reflect in your account, depending on your bank.</p>
        <p style="color: #6b7280; font-size: 14px;">If you have any questions, please contact us with your Ticket ID.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.ORGANIZER_EMAIL,
    to: attendeeEmail,
    subject: `Registration Cancellation Confirmed - ${ticketId}`,
    html,
  });
}

export { transporter };
