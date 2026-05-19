import '../src/config/env.js';
import prisma from '../src/lib/prisma.js';
import { generateTicketId } from '../src/services/ticketService.js';
import { sendConfirmationEmail } from '../src/services/emailService.js';
import {
  REGISTRATION_AMOUNT_PAISE,
  verifyRazorpaySignature,
} from '../src/services/paymentService.js';

const requiredEnv = [
  'RECOVERY_ATTENDEE_NAME',
  'RECOVERY_ATTENDEE_EMAIL',
  'RECOVERY_ATTENDEE_PHONE',
  'RECOVERY_RAZORPAY_ORDER_ID',
  'RECOVERY_RAZORPAY_PAYMENT_ID',
  'RECOVERY_RAZORPAY_SIGNATURE',
];

function readRecoveryData() {
  const missing = requiredEnv.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }

  return {
    attendeeName: process.env.RECOVERY_ATTENDEE_NAME.trim(),
    attendeeEmail: process.env.RECOVERY_ATTENDEE_EMAIL.trim().toLowerCase(),
    attendeePhone: process.env.RECOVERY_ATTENDEE_PHONE.trim(),
    organization: process.env.RECOVERY_ORGANIZATION?.trim() || undefined,
    role: process.env.RECOVERY_ROLE?.trim() || undefined,
    dietaryRestrictions: process.env.RECOVERY_DIETARY_RESTRICTIONS?.trim() || undefined,
    accessibilityNeeds: process.env.RECOVERY_ACCESSIBILITY_NEEDS?.trim() || undefined,
    razorpayOrderId: process.env.RECOVERY_RAZORPAY_ORDER_ID.trim(),
    razorpayPaymentId: process.env.RECOVERY_RAZORPAY_PAYMENT_ID.trim(),
    razorpaySignature: process.env.RECOVERY_RAZORPAY_SIGNATURE.trim(),
  };
}

async function main() {
  const data = readRecoveryData();

  const isPaymentValid = verifyRazorpaySignature({
    orderId: data.razorpayOrderId,
    paymentId: data.razorpayPaymentId,
    signature: data.razorpaySignature,
  });

  if (!isPaymentValid) {
    throw new Error('Payment signature verification failed. Registration was not recovered.');
  }

  const existingPayment = await prisma.registration.findFirst({
    where: { razorpayPaymentId: data.razorpayPaymentId },
  });

  if (existingPayment) {
    console.log(`Payment already has registration ${existingPayment.id} with ticket ${existingPayment.ticketId}`);
    return;
  }

  const existingRegistration = await prisma.registration.findFirst({
    where: {
      attendeeEmail: data.attendeeEmail,
      status: { not: 'CANCELLED' },
    },
  });

  if (existingRegistration) {
    throw new Error(
      `Email is already registered with ticket ${existingRegistration.ticketId}. Payment was not attached to a new registration.`
    );
  }

  const ticketId = await generateTicketId(prisma);

  const registration = await prisma.registration.create({
    data: {
      ticketId,
      attendeeName: data.attendeeName,
      attendeeEmail: data.attendeeEmail,
      attendeePhone: data.attendeePhone,
      organization: data.organization,
      role: data.role,
      dietaryRestrictions: data.dietaryRestrictions,
      accessibilityNeeds: data.accessibilityNeeds,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentTransactionId: data.razorpayPaymentId,
      razorpayOrderId: data.razorpayOrderId,
      razorpayPaymentId: data.razorpayPaymentId,
      razorpaySignature: data.razorpaySignature,
      amountPaid: REGISTRATION_AMOUNT_PAISE,
    },
  });

  console.log(`Recovered registration ${registration.id} with ticket ${registration.ticketId}`);

  if (process.env.RECOVERY_SEND_EMAIL !== 'false') {
    try {
      await sendConfirmationEmail(registration);
      console.log(`Confirmation email sent to ${registration.attendeeEmail}`);
    } catch (error) {
      console.error(`Registration recovered, but confirmation email failed: ${error.message}`);
    }
  }
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
